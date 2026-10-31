import { NextResponse } from "next/server";
import { getReportStore } from "@/lib/storage";
import { listPendingIssues, moderationConfigured } from "@/lib/github";
import { requireAdmin } from "../pending/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/admin/stats — dashboard overview counts (real data only). */
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const store = getReportStore();
  const approved = await store.listApprovedReports();
  const index = await store.getSearchIndex();

  let pending = 0;
  let ghConfigured = false;
  if (moderationConfigured()) {
    ghConfigured = true;
    const r = await listPendingIssues(1, 100);
    pending = r.issues.length;
  }

  return NextResponse.json({
    approved: approved.length,
    published_identifiers: index.length,
    pending,
    rejected: 0, // rejected issues are closed; not enumerable without scanning
    disputed: approved.filter((r) => r.disputed).length,
    gh_configured: ghConfigured,
    recent: [...approved]
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, 8)
      .map((r) => ({
        id: r.id,
        category: r.category,
        country: r.country,
        created_at: r.created_at,
        evidence_status: r.evidence_status,
      })),
  });
}
