import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "../pending/route";
import { setIssueLabels, addAuditComment } from "@/lib/github";
import { audit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  issue_number: z.number().int().positive(),
  reference: z.string().min(6).max(64),
  reason: z.string().max(500).optional(),
});

/** POST /api/admin/reject — rejects a pending report (closes issue with label). */
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
  await setIssueLabels(p.issue_number, ["rejected"]);
  await addAuditComment(
    p.issue_number,
    `**Rejected** by admin at ${new Date().toISOString()}${p.reason ? `\nReason: ${p.reason}` : ""}`
  );
  await audit({
    actor: "admin",
    action: "reject",
    target: p.reference,
    meta: { issue: p.issue_number, reason: p.reason },
  });
  return NextResponse.json({ ok: true });
}
