import { NextRequest, NextResponse } from "next/server";
import { getReportStore } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/reports/[id] — fetch a single approved report by ID. */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!/^SC-\d{4,}$/.test(id)) {
    return NextResponse.json({ error: "Invalid report ID." }, { status: 400 });
  }
  const store = getReportStore();
  const report = await store.getReport(id);
  if (!report) {
    return NextResponse.json({ error: "Report not found." }, { status: 404 });
  }
  return NextResponse.json(report, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
