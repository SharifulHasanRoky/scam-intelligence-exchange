/**
 * Storage abstraction layer.
 *
 * In the MVP, approved reports live as JSON files committed to the public
 * GitHub repository. The platform reads them either:
 *   - from local bundled seed data (development / preview), OR
 *   - from the GitHub Contents API (production).
 *
 * This module exposes a single `ReportStore` interface so a database adapter
 * can be introduced later without rewriting the rest of the application.
 */

import type {
  ScamReport,
  SearchIndexEntry,
  SearchResult,
  IdentifierType,
} from "./types";
import { detectIdentifierType, normalizeIdentifier, hashIdentifier, prepareIdentifier } from "./normalize";

/** Built-in seed data (used in development & preview). */
import seedReports from "@/data/reports.json";
import seedIndex from "@/data/indexes/search-index.json";

const seedReportList = seedReports as ScamReport[];
const seedIndexList = seedIndex as SearchIndexEntry[];

export interface ReportStore {
  listApprovedReports(): Promise<ScamReport[]>;
  getReport(id: string): Promise<ScamReport | null>;
  getSearchIndex(): Promise<SearchIndexEntry[]>;
}

/**
 * Local seed store. Reads from bundled JSON. This is the default in
 * development and in the preview environment, where GitHub API credentials
 * are not configured.
 */
class LocalSeedStore implements ReportStore {
  async listApprovedReports(): Promise<ScamReport[]> {
    return seedReportList;
  }
  async getReport(id: string): Promise<ScamReport | null> {
    return seedReportList.find((r) => r.id === id) || null;
  }
  async getSearchIndex(): Promise<SearchIndexEntry[]> {
    return seedIndexList;
  }
}

/**
 * GitHub-backed store. Reads approved reports and search indexes from the
 * public GitHub repository's `data/` directory via the Contents API.
 *
 * Requires GITHUB_PUBLIC_OWNER, GITHUB_PUBLIC_REPO and GITHUB_PUBLIC_TOKEN.
 */
class GitHubStore implements ReportStore {
  private owner: string;
  private repo: string;
  private token: string;

  constructor() {
    this.owner = process.env.GITHUB_PUBLIC_OWNER || "";
    this.repo = process.env.GITHUB_PUBLIC_REPO || "";
    this.token = process.env.GITHUB_PUBLIC_TOKEN || "";
    if (!this.owner || !this.repo || !this.token) {
      throw new Error("GitHubStore requires GITHUB_PUBLIC_OWNER/REPO/TOKEN");
    }
  }

  private headers() {
    return {
      Authorization: `Bearer ${this.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };
  }

  private async fetchJson(path: string): Promise<any | null> {
    const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}`;
    const res = await fetch(url, { headers: this.headers() });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.content) return null;
    const content = Buffer.from(data.content, "base64").toString("utf-8");
    return JSON.parse(content);
  }

  async listApprovedReports(): Promise<ScamReport[]> {
    const idx = await this.fetchJson("data/indexes/reports-index.json");
    if (idx && Array.isArray(idx.reports) && idx.reports.length > 0) {
      return idx.reports as ScamReport[];
    }
    // Fallback to bundled seed data if GitHub repo has no published reports yet.
    return seedReportList;
  }

  async getReport(id: string): Promise<ScamReport | null> {
    // Try year directory based on id prefix (SC-YYYY-...)
    const yearMatch = id.match(/^SC-(\d{4})-/);
    const year = yearMatch ? yearMatch[1] : new Date().getFullYear().toString();
    const remote = await this.fetchJson(`data/reports/${year}/${id}.json`);
    if (remote) return remote as ScamReport;
    // Fallback to seed data.
    return seedReportList.find((r) => r.id === id) || null;
  }

  async getSearchIndex(): Promise<SearchIndexEntry[]> {
    const idx = await this.fetchJson("data/indexes/search-index.json");
    if (idx && Array.isArray(idx.entries) && idx.entries.length > 0) {
      return idx.entries as SearchIndexEntry[];
    }
    // Fallback to bundled seed data.
    return seedIndexList;
  }
}

let _store: ReportStore | null = null;

export function getReportStore(): ReportStore {
  if (_store) return _store;
  const useGithub =
    process.env.GITHUB_PUBLIC_OWNER &&
    process.env.GITHUB_PUBLIC_REPO &&
    process.env.GITHUB_PUBLIC_TOKEN;
  _store = useGithub ? new GitHubStore() : new LocalSeedStore();
  return _store;
}

/** Cache TTL in milliseconds for in-process caching of search results. */
const CACHE_TTL_MS = 60_000; // 1 minute
const cache = new Map<string, { ts: number; value: SearchResult }>();

/** Search approved reports by a raw identifier query. */
export async function searchByIdentifier(query: string): Promise<SearchResult> {
  const trimmed = query.trim();
  const cacheKey = trimmed.toLowerCase();
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return cached.value;
  }

  const store = getReportStore();
  const index = await store.getSearchIndex();
  const reports = await store.listApprovedReports();

  // Normalize the query the same way identifiers are normalized.
  const detectedType = detectIdentifierType(trimmed);
  const normalized = normalizeIdentifier(trimmed, detectedType);
  const hash = hashIdentifier(normalized);

  // Match by hash first (exact). Then fall back to partial domain match.
  let matched = index.find((e) => e.hash === hash);

  if (!matched && (detectedType === "domain" || detectedType === "url")) {
    // Try matching by normalized domain suffix
    const domain = detectedType === "url" ? (() => {
      try { return new URL(normalized).hostname.replace(/^www\./, ""); } catch { return normalized; }
    })() : normalized;
    matched = index.find((e) => e.normalized && (e.normalized === domain || e.normalized.endsWith("." + domain) || domain.endsWith("." + e.normalized)));
  }

  if (!matched) {
    const result: SearchResult = {
      query: trimmed,
      identifier_type: detectedType,
      status: "no_reports",
      identifier_display: "",
      total_reports: 0,
      reports: [],
      categories: [],
      countries: [],
      safety_advice:
        "No community reports were found for this identifier. The absence of reports does not guarantee safety — scammers constantly create new phone numbers, websites and accounts. Always verify independently before sending money or sharing personal information.",
    };
    cache.set(cacheKey, { ts: Date.now(), value: result });
    return result;
  }

  const matchedReports = reports.filter((r) => matched!.report_ids.includes(r.id));
  const disputed = matched.disputed || matchedReports.some((r) => r.disputed);

  const status: SearchResult["status"] = disputed
    ? "disputed"
    : matched.evidence_status === "independently_confirmed"
    ? "independently_confirmed"
    : matched.evidence_status === "evidence_reviewed"
    ? "evidence_reviewed"
    : matched.corroboration_count > 1
    ? "multiple_reports"
    : "unverified";

  const result: SearchResult = {
    query: trimmed,
    identifier_type: matched.type,
    status,
    identifier_display: matched.display,
    total_reports: matched.report_ids.length,
    reports: matchedReports
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .map((r) => ({
        id: r.id,
        category: r.category,
        country: r.country,
        channel: r.channel,
        identifier_display: r.identifier_display,
        incident_date: r.incident_date,
        evidence_status: r.evidence_status,
        corroboration_count: r.corroboration_count,
        disputed: !!r.disputed,
      })),
    categories: matched.categories,
    countries: matched.countries,
    safety_advice: adviceForStatus(status, detectedType),
  };
  cache.set(cacheKey, { ts: Date.now(), value: result });
  return result;
}

function adviceForStatus(status: SearchResult["status"], type: IdentifierType): string {
  if (status === "no_reports") {
    return "No community reports were found. The absence of reports does not guarantee safety. Always verify independently before sending money or sharing personal information.";
  }
  const typeWord =
    type === "phone" ? "phone number" :
    type === "email" ? "email address" :
    type === "domain" || type === "url" ? "website" :
    type === "social_profile" ? "social profile" : "business name";
  if (status === "unverified") {
    return `One community member has reported this ${typeWord}. This is an unverified claim and does not establish wrongdoing. Proceed with caution and verify independently.`;
  }
  if (status === "multiple_reports") {
    return `Multiple independent community members have reported this ${typeWord}. Treat with elevated caution. Do not send money or share personal information without independent verification.`;
  }
  if (status === "evidence_reviewed") {
    return `This ${typeWord} has been reported by multiple community members and supporting evidence has been reviewed by editors. Treat with high caution.`;
  }
  if (status === "independently_confirmed") {
    return `This ${typeWord} has been independently corroborated by trusted sources. Do not engage, send money, or share personal information.`;
  }
  if (status === "disputed") {
    return `Community reports exist for this ${typeWord}, but the subject has submitted a correction or response. Review the reports and the response carefully before drawing any conclusion.`;
  }
  return "Treat unknown identifiers with caution and verify independently before engaging.";
}

/** Prepare an identifier for hashing/display (server-only helper). */
export { prepareIdentifier };
