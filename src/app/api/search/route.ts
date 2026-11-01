import { NextRequest, NextResponse } from "next/server";
import { searchByIdentifier } from "@/lib/storage";
import { rateLimitCheck, rateLimitKeyFor, getClientIp } from "@/lib/rate-limit";
import { sanitizeText } from "@/lib/sanitize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/search?q=<identifier>
 *
 * Searches approved public reports. The query is normalized and matched
 * against HMAC identifier hashes — raw identifiers are never returned.
 *
 * Rate-limited per IP. Cached in-process for 60s (see storage.ts).
 */
export async function GET(req: NextRequest) {
  const headers = req.headers;
  const ip = getClientIp(headers);
  const rl = rateLimitCheck(rateLimitKeyFor(ip, "search"), 20, 1);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down.", retryAfter: rl.retryAfterMs },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } }
    );
  }

  const q = sanitizeText(req.nextUrl.searchParams.get("q") || "", 256);
  if (!q) {
    return NextResponse.json({ error: "Query parameter 'q' is required." }, { status: 400 });
  }
  if (q.length < 3) {
    return NextResponse.json({ error: "Query must be at least 3 characters." }, { status: 400 });
  }

  try {
    const result = await searchByIdentifier(q);
    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (e: any) {
    console.error("[api/search] error", e);
    return NextResponse.json({ error: "Search failed." }, { status: 500 });
  }
}
