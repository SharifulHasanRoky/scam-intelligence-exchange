import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateSession, ADMIN_COOKIE } from "@/lib/admin-auth";

/** Helper: returns true if the current request has a valid admin session. */
export async function requireAdmin(): Promise<boolean> {
  const c = await cookies();
  const token = c.get(ADMIN_COOKIE)?.value || null;
  return validateSession(token).ok;
}

export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  // Lazy import to avoid loading github client when not admin
  const { listPendingIssues } = await import("@/lib/github");
  const page = Number(req.nextUrl.searchParams.get("page") || "1");
  const { issues, configured } = await listPendingIssues(page, 30);
  return NextResponse.json({ issues, configured, page });
}
