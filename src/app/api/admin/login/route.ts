import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminLogin, ADMIN_COOKIE } from "@/lib/admin-auth";
import { rateLimitCheck, rateLimitKeyFor, getClientIp } from "@/lib/rate-limit";
import { audit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST /api/admin/login { password } — issues a signed session cookie. */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const rl = rateLimitCheck(rateLimitKeyFor(ip, "admin-login"), 5, 0.1);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }
  const password = typeof body?.password === "string" ? body.password : "";
  if (!password) {
    return NextResponse.json({ error: "Password required." }, { status: 400 });
  }

  const r = verifyAdminLogin(password);
  if (!r.ok || !r.token) {
    await audit({ actor: "visitor", action: "login-failed", target: "admin" });
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const expires = r.expires || (Date.now() + 1000 * 60 * 60 * 8);
  const c = await cookies();
  c.set(ADMIN_COOKIE, r.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor((expires - Date.now()) / 1000),
  });
  await audit({ actor: "admin", action: "login" });
  return NextResponse.json({ ok: true });
}
