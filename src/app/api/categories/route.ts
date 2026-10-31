import { NextResponse } from "next/server";
import { CATEGORIES } from "@/data/categories";

export const runtime = "nodejs";
export const revalidate = 3600;

/** GET /api/categories — list of scam categories with metadata. */
export async function GET() {
  return NextResponse.json({ categories: CATEGORIES });
}
