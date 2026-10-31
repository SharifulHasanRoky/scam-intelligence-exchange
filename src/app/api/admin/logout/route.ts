import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE } from "@/lib/admin-auth";
import { audit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const c = await cookies();
  c.delete(ADMIN_COOKIE);
  await audit({ actor: "admin", action: "logout" });
  return NextResponse.json({ ok: true });
}
