import { NextResponse } from "next/server";
import { getReportStore } from "@/lib/storage";

export const runtime = "nodejs";
export const revalidate = 300;

/**
 * GET /api/stats — real counts derived from approved JSON data only.
 *
 * IMPORTANT: this never invents statistics. If the store returns no data,
 * every count is 0.
 */
export async function GET() {
  const store = getReportStore();
  const all = await store.listApprovedReports();
  const index = await store.getSearchIndex();

  const byCategory: Record<string, number> = {};
  const byCountry: Record<string, number> = {};
  for (const r of all) {
    byCategory[r.category] = (byCategory[r.category] || 0) + 1;
    byCountry[r.country] = (byCountry[r.country] || 0) + 1;
  }

  return NextResponse.json({
    total_reports: all.length,
    total_identifiers: index.length,
    by_category: byCategory,
    by_country: byCountry,
  });
}
