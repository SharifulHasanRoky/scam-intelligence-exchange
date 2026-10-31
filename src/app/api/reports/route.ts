import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { rateLimitCheck, rateLimitKeyFor, getClientIp } from "@/lib/rate-limit";
import {
  sanitizeDescription,
  sanitizeAdditional,
  sanitizeIdentifier,
  sanitizeHandle,
  sanitizeCountry,
  isValidIncidentDate,
} from "@/lib/sanitize";
import { generateReference, prepareIdentifier } from "@/lib/normalize";
import { analyzeReport } from "@/lib/gemini";
import { createModerationIssue, moderationConfigured, ensureLabels } from "@/lib/github";
import { audit } from "@/lib/audit";
import type { ReportSubmission, ScamCategory, CommunicationChannel, IdentifierType } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ConsentSchema = z.object({
  good_faith: z.literal(true),
  not_false: z.literal(true),
  understands_review: z.literal(true),
  understands_redaction: z.literal(true),
});

const BodySchema = z.object({
  category: z.enum([
    "online_shopping", "fake_job", "investment", "phishing", "romance",
    "impersonation", "giveaway", "advance_payment", "fake_website", "other",
  ]),
  channel: z.enum([
    "whatsapp", "facebook", "instagram", "telegram", "website",
    "email", "phone_call", "sms", "other",
  ]),
  identifier_type: z.enum([
    "phone", "domain", "url", "email", "social_profile", "business_name",
  ]),
  identifier_value: z.string().min(3).max(256),
  country: z.string().min(2).max(64),
  description: z.string().min(20).max(2000),
  incident_date: z.string().min(8).max(20),
  asked_for_money: z.boolean(),
  lost_money: z.boolean(),
  additional_info: z.string().max(1000).optional(),
  reporter_handle: z.string().max(64).optional(),
  consent: ConsentSchema,
  company: z.string().max(0).optional().or(z.literal("")), // honeypot
});

/**
 * POST /api/reports
 *
 * Validates, sanitizes, runs Gemini analysis (best-effort) and creates a
 * private GitHub moderation issue. Never publishes immediately. Returns a
 * reference number the visitor can use to track the report.
 *
 * If neither GitHub nor Gemini is configured (development), the report is
 * accepted, analyzed via the fallback path, and a synthetic reference is
 * returned so the user flow still works end-to-end.
 */
export async function POST(req: NextRequest) {
  const headers = req.headers;
  const ip = getClientIp(headers);
  const rl = rateLimitCheck(rateLimitKeyFor(ip, "report"), 3, 0.2); // 3 per ~15s
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many submissions. Please wait a few minutes before trying again.", retryAfter: rl.retryAfterMs },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  // Honeypot: if 'company' is non-empty, silently accept but discard.
  const honeypot = (body as any)?.company;
  if (typeof honeypot === "string" && honeypot.length > 0) {
    // Pretend success to bots
    return NextResponse.json({
      reference: generateReference(),
      status: "pending_review",
      message: "Your report was received and is pending review.",
    });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const p = parsed.data;

  if (!isValidIncidentDate(p.incident_date)) {
    return NextResponse.json({ error: "Invalid incident date." }, { status: 400 });
  }

  // Sanitize all free-text fields. The identifier is normalized, hashed and
  // masked before being stored or shown publicly.
  const submission: ReportSubmission = {
    category: p.category as ScamCategory,
    channel: p.channel as CommunicationChannel,
    identifier_type: p.identifier_type as IdentifierType,
    identifier_value: sanitizeIdentifier(p.identifier_value),
    country: sanitizeCountry(p.country),
    description: sanitizeDescription(p.description),
    incident_date: p.incident_date,
    asked_for_money: !!p.asked_for_money,
    lost_money: !!p.lost_money,
    additional_info: p.additional_info ? sanitizeAdditional(p.additional_info) : undefined,
    reporter_handle: p.reporter_handle ? sanitizeHandle(p.reporter_handle) : undefined,
    consent: p.consent,
  };

  if (submission.description.length < 20) {
    return NextResponse.json({ error: "Please provide a more detailed description (at least 20 characters)." }, { status: 400 });
  }

  const reference = generateReference();

  // Best-effort Gemini analysis — never blocks submission.
  const { analysis, source, error: aiError } = await analyzeReport(submission);

  // Best-effort GitHub issue — never blocks submission.
  let issueNumber: number | null = null;
  let ghError: string | undefined;
  if (moderationConfigured()) {
    await ensureLabels();
    const r = await createModerationIssue({ reference, submission, analysis });
    issueNumber = r.issueNumber;
    ghError = r.error;
  }

  await audit({
    actor: "visitor",
    action: "submit",
    target: reference,
    meta: {
      category: submission.category,
      country: submission.country,
      ai_source: source,
      ai_error: aiError,
      issue_number: issueNumber,
      gh_error: ghError,
      ip: ip ? "[hashed]" : null,
    },
  });

  return NextResponse.json({
    reference,
    status: "pending_review",
    ai_source: source,
    message:
      "Your report was received and is pending moderation. It will be reviewed by an editor before being published. Thank you for helping protect the community.",
    note:
      !moderationConfigured()
        ? "GitHub moderation repository is not configured in this environment. Reports are accepted but not persisted to a moderation queue."
        : undefined,
  });
}
