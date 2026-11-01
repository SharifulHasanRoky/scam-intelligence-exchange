import { NextResponse } from "next/server";
import { getReportStore } from "@/lib/storage";

export const runtime = "nodejs";
export const revalidate = 300;

/** GET /api/latest-reports — most recent approved reports (for the homepage). */
export async function GET() {
  const store = getReportStore();
  const all = await store.listApprovedReports();
  const latest = [...all]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 6)
    .map((r) => ({
      id: r.id,
      category: r.category,
      country: r.country,
      channel: r.channel,
      identifier_type: r.identifier_type,
      identifier_display: r.identifier_display,
      incident_date: r.incident_date,
      created_at: r.created_at,
      evidence_status: r.evidence_status,
      corroboration_count: r.corroboration_count,
      description_preview: r.description.slice(0, 140) + (r.description.length > 140 ? "…" : ""),
      disputed: !!r.disputed,
    }));
  return NextResponse.json({ reports: latest, total: all.length });
}
