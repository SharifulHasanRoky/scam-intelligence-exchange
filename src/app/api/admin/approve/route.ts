import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "../pending/route";
import { setIssueLabels, addAuditComment, publishApprovedReport, publicRepoConfigured } from "@/lib/github";
import { audit } from "@/lib/audit";
import { prepareIdentifier } from "@/lib/normalize";
import { sanitizeDescription } from "@/lib/sanitize";
import type { ScamReport, ScamCategory, CommunicationChannel, IdentifierType, EvidenceStatus } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  issue_number: z.number().int().positive(),
  reference: z.string().min(6).max(64),
  category: z.enum([
    "online_shopping", "fake_job", "investment", "phishing", "romance",
    "impersonation", "giveaway", "advance_payment", "fake_website", "other",
  ]),
  channel: z.enum([
    "whatsapp", "facebook", "instagram", "telegram", "website",
    "email", "phone_call", "sms", "other",
  ]),
  identifier_type: z.enum(["phone", "domain", "url", "email", "social_profile", "business_name"]),
  identifier_value: z.string().min(3).max(256), // raw, server-side only
  country: z.string().min(2).max(64),
  description: z.string().min(20).max(2000),
  incident_date: z.string().min(8).max(20),
  evidence_status: z.enum(["unverified", "multiple_reports", "evidence_reviewed", "independently_confirmed"]),
  corroboration_count: z.number().int().min(1).max(9999).default(1),
  disputed: z.boolean().default(false),
  safety_advice: z.string().max(500).optional(),
});

/**
 * POST /api/admin/approve
 *
 * Approves a pending report:
 *  1. Validates the admin session.
 *  2. Normalizes and masks the identifier.
 *  3. Builds an approved ScamReport.
 *  4. Publishes it to the public GitHub repository (SHA-protected).
 *  5. Updates the moderation issue's labels and adds an audit comment.
 *
 * If the GitHub public repo is not configured, the request is accepted and
 * the report is returned for local inspection, but no JSON file is published.
 */
export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }
  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", issues: parsed.error.issues }, { status: 400 });
  }
  const p = parsed.data;

  const prepared = prepareIdentifier(p.identifier_value, p.identifier_type as IdentifierType);

  const report: ScamReport = {
    id: p.reference.replace(/^SC-\d+-/, "SC-").padStart(7, "0").replace(/^SC-/, "SC-"),
    // The line above is a no-op safety; we trust the admin-provided reference.
    // Actually: use the reference as-is, it is already formatted SC-YYYY-XXXX.
    category: p.category as ScamCategory,
    country: p.country,
    channel: p.channel as CommunicationChannel,
    identifier_type: p.identifier_type as IdentifierType,
    identifier_display: prepared.display,
    identifier_hash: prepared.hash,
    description: sanitizeDescription(p.description),
    incident_date: p.incident_date,
    publication_status: "approved",
    evidence_status: p.evidence_status as EvidenceStatus,
    corroboration_count: p.corroboration_count,
    created_at: new Date().toISOString().slice(0, 10),
    published_at: new Date().toISOString().slice(0, 10),
    related_reports: [],
    risk_indicators: [],
    safety_advice: p.safety_advice,
    disputed: p.disputed,
  };
  // Use the admin-supplied reference as the public id.
  report.id = p.reference;

  let publishResult: { ok: boolean; configured: boolean; error?: string } | null = null;
  if (publicRepoConfigured()) {
    publishResult = await publishApprovedReport(report);
  }

  // Update issue labels & leave an audit comment
  const labels = p.disputed
    ? ["approved", "disputed"]
    : ["approved"];
  if (p.evidence_status !== "unverified") labels.push("ai-analysis-complete");
  await setIssueLabels(p.issue_number, labels);
  await addAuditComment(
    p.issue_number,
    `**Approved** by admin at ${new Date().toISOString()}\n` +
    `- Public ID: \`${report.id}\`\n` +
    `- Evidence status: \`${report.evidence_status}\`\n` +
    `- Corroboration count: ${report.corroboration_count}\n` +
    `- Published to public repo: ${publishResult?.ok ? "yes" : publishResult ? `failed (${publishResult.error})` : "repo not configured"}`
  );

  await audit({
    actor: "admin",
    action: "approve",
    target: p.reference,
    meta: { issue: p.issue_number, published: publishResult?.ok ?? false },
  });

  return NextResponse.json({ ok: true, report, publish: publishResult });
}
