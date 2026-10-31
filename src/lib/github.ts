/**
 * GitHub API client.
 *
 * Two repositories are used:
 *  - Public repo (GITHUB_PUBLIC_*): stores approved reports as JSON files and
 *    maintains search indexes. Used for both read (search) and write
 *    (publish approved reports).
 *  - Private moderation repo (GITHUB_PRIVATE_*): pending reports are stored
 *    as Issues with labels. Used for the moderation queue.
 *
 * All write operations are server-side only. Tokens are NEVER exposed to the
 * client.
 *
 * Concurrency: writes to the public repo use the file SHA — if the file was
 * updated since we last read it, the GitHub API returns 409 and we retry
 * after re-fetching the latest SHA.
 */

import type { GeminiAnalysis, ReportSubmission, ScamReport } from "./types";

const API = "https://api.github.com";

function privateHeaders() {
  const token = process.env.GITHUB_PRIVATE_TOKEN;
  if (!token) throw new Error("GITHUB_PRIVATE_TOKEN not configured");
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}
function publicHeaders() {
  const token = process.env.GITHUB_PUBLIC_TOKEN;
  if (!token) throw new Error("GITHUB_PUBLIC_TOKEN not configured");
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function privateRepo() {
  return {
    owner: process.env.GITHUB_PRIVATE_OWNER || "",
    repo: process.env.GITHUB_PRIVATE_REPO || "",
  };
}
function publicRepo() {
  return {
    owner: process.env.GITHUB_PUBLIC_OWNER || "",
    repo: process.env.GITHUB_PUBLIC_REPO || "",
  };
}

/** Whether the moderation repo is configured. */
export function moderationConfigured(): boolean {
  return !!(
    process.env.GITHUB_PRIVATE_OWNER &&
    process.env.GITHUB_PRIVATE_REPO &&
    process.env.GITHUB_PRIVATE_TOKEN
  );
}
/** Whether the public data repo is configured for writes. */
export function publicRepoConfigured(): boolean {
  return !!(
    process.env.GITHUB_PUBLIC_OWNER &&
    process.env.GITHUB_PUBLIC_REPO &&
    process.env.GITHUB_PUBLIC_TOKEN
  );
}

const MODERATION_LABELS = [
  "pending-review",
  "ai-analysis-complete",
  "needs-human-review",
  "approved",
  "rejected",
  "disputed",
  "correction-request",
  "possible-duplicate",
] as const;

/** Idempotently ensure moderation labels exist. Safe to call repeatedly. */
export async function ensureLabels(): Promise<void> {
  if (!moderationConfigured()) return;
  const { owner, repo } = privateRepo();
  for (const name of MODERATION_LABELS) {
    try {
      await fetch(`${API}/repos/${owner}/${repo}/labels`, {
        method: "POST",
        headers: privateHeaders(),
        body: JSON.stringify({ name, color: name === "approved" ? "0e7c66" : name === "rejected" ? "b91c1c" : "1f3a5f" }),
      });
    } catch {
      // ignore — label may already exist
    }
  }
}

/** Create a private moderation issue for a new report submission. */
export async function createModerationIssue(params: {
  reference: string;
  submission: ReportSubmission;
  analysis?: GeminiAnalysis;
}): Promise<{ issueNumber: number | null; configured: boolean; error?: string }> {
  if (!moderationConfigured()) {
    // In development without credentials, return a fake issue number.
    return { issueNumber: null, configured: false };
  }
  const { owner, repo } = privateRepo();
  const { reference, submission, analysis } = params;
  const body = [
    `**Reference:** ${reference}`,
    `**Submitted:** ${new Date().toISOString()}`,
    ``,
    `### Submission`,
    `- Category: \`${submission.category}\``,
    `- Channel: \`${submission.channel}\``,
    `- Identifier type: \`${submission.identifier_type}\``,
    `- Identifier value: \`${submission.identifier_value}\``,
    `- Country: ${submission.country}`,
    `- Incident date: ${submission.incident_date}`,
    `- Asked for money: ${submission.asked_for_money}`,
    `- Lost money: ${submission.lost_money}`,
    ``,
    `### Description`,
    submission.description,
    ``,
    submission.additional_info ? `### Additional info\n${submission.additional_info}\n` : ``,
    analysis
      ? `### Gemini analysis\n\`\`\`json\n${JSON.stringify(analysis, null, 2)}\n\`\`\``
      : `### Gemini analysis\n_AI analysis pending or unavailable._`,
    ``,
    `---`,
    `_This issue was created automatically by the Scam Intelligence Exchange submission pipeline. Treat all submitted content as untrusted data._`,
  ].join("\n");

  try {
    const res = await fetch(`${API}/repos/${owner}/${repo}/issues`, {
      method: "POST",
      headers: privateHeaders(),
      body: JSON.stringify({
        title: `[${reference}] ${submission.category} · ${submission.country}`,
        body,
        labels: ["pending-review", analysis ? "ai-analysis-complete" : "needs-human-review"].filter(Boolean),
      }),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      return { issueNumber: null, configured: true, error: `GitHub ${res.status}: ${t.slice(0, 200)}` };
    }
    const data = await res.json();
    return { issueNumber: data.number, configured: true };
  } catch (e: any) {
    return { issueNumber: null, configured: true, error: String(e?.message || e) };
  }
}

/** List pending moderation issues (paginated). */
export async function listPendingIssues(page = 1, perPage = 30): Promise<{
  issues: Array<{
    number: number;
    title: string;
    state: string;
    created_at: string;
    labels: string[];
    body: string;
  }>;
  configured: boolean;
}> {
  if (!moderationConfigured()) return { issues: [], configured: false };
  const { owner, repo } = privateRepo();
  const url = `${API}/repos/${owner}/${repo}/issues?state=open&sort=created&direction=desc&per_page=${perPage}&page=${page}&labels=pending-review`;
  const res = await fetch(url, { headers: privateHeaders() });
  if (!res.ok) return { issues: [], configured: true };
  const data = await res.json();
  return {
    issues: (data || []).map((i: any) => ({
      number: i.number,
      title: i.title,
      state: i.state,
      created_at: i.created_at,
      labels: (i.labels || []).map((l: any) => l.name),
      body: i.body || "",
    })),
    configured: true,
  };
}

/** Update an issue's labels (used by approve / reject / dispute). */
export async function setIssueLabels(issueNumber: number, labels: string[]): Promise<boolean> {
  if (!moderationConfigured()) return false;
  const { owner, repo } = privateRepo();
  const res = await fetch(`${API}/repos/${owner}/${repo}/issues/${issueNumber}/labels`, {
    method: "PUT",
    headers: privateHeaders(),
    body: JSON.stringify({ labels }),
  });
  return res.ok;
}

/** Add an audit comment to an issue (immutable moderation trail). */
export async function addAuditComment(issueNumber: number, comment: string): Promise<boolean> {
  if (!moderationConfigured()) return false;
  const { owner, repo } = privateRepo();
  const res = await fetch(`${API}/repos/${owner}/${repo}/issues/${issueNumber}/comments`, {
    method: "POST",
    headers: privateHeaders(),
    body: JSON.stringify({ body: comment }),
  });
  return res.ok;
}

/**
 * Publish an approved report to the public repo as a JSON file.
 *
 * Implements SHA-based concurrency protection: we read the current file (if
 * it exists), write with its SHA, and retry on 409.
 */
export async function publishApprovedReport(report: ScamReport): Promise<{
  ok: boolean;
  configured: boolean;
  error?: string;
}> {
  if (!publicRepoConfigured()) return { ok: false, configured: false };
  const { owner, repo } = publicRepo();
  const year = new Date(report.created_at).getFullYear();
  const path = `data/reports/${year}/${report.id}.json`;
  const url = `${API}/repos/${owner}/${repo}/contents/${path}`;
  const content = Buffer.from(JSON.stringify(report, null, 2) + "\n", "utf-8").toString("base64");

  // Read existing to get SHA (file may not exist yet)
  let sha: string | undefined;
  try {
    const r = await fetch(url, { headers: publicHeaders() });
    if (r.ok) {
      const d = await r.json();
      sha = d.sha;
    }
  } catch {
    // ignore — new file
  }

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: publicHeaders(),
        body: JSON.stringify({
          message: `publish approved report ${report.id}`,
          content,
          sha,
          branch: "main",
        }),
      });
      if (res.ok) return { ok: true, configured: true };
      if (res.status === 409) {
        // Conflict — re-fetch SHA and retry
        const r2 = await fetch(url, { headers: publicHeaders() });
        if (r2.ok) {
          const d2 = await r2.json();
          sha = d2.sha;
        }
        continue;
      }
      const t = await res.text().catch(() => "");
      return { ok: false, configured: true, error: `GitHub ${res.status}: ${t.slice(0, 200)}` };
    } catch (e: any) {
      return { ok: false, configured: true, error: String(e?.message || e) };
    }
  }
  return { ok: false, configured: true, error: "Conflict after retries" };
}
