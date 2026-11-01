import { NextResponse } from "next/server";
import { SAFETY_GUIDES } from "@/data/safety-guides";

export const runtime = "nodejs";
export const revalidate = 3600;

/** GET /api/guides — list of safety guides (summary fields only). */
export async function GET() {
  return NextResponse.json({
    guides: SAFETY_GUIDES.map((g) => ({
      slug: g.slug,
      title: g.title,
      category: g.category,
      summary: g.summary,
    })),
  });
}
