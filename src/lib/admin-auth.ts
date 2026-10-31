/**
 * Minimal admin session helper for the MVP.
 *
 * The MVP uses a single-admin access mechanism: `ADMIN_SECRET` is compared
 * server-side using a constant-time compare, and a short-lived signed
 * session cookie is issued. `ADMIN_EMAILS` is reserved for future
 * multi-admin support.
 *
 * This is intentionally simple — production deployments should add OAuth
 * (NextAuth) or a managed identity provider.
 */

import { createHmac, timingSafeEqual } from "node:crypto";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "";
const SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8 hours
const COOKIE_NAME = "sie_admin";

function sign(payload: string): string {
  return createHmac("sha256", ADMIN_SECRET).update(payload).digest("hex");
}

/** Verify an admin login attempt. Returns a signed session token on success. */
export function verifyAdminLogin(password: string): { ok: boolean; token?: string; expires?: number } {
  if (!ADMIN_SECRET) return { ok: false };
  const a = Buffer.from(String(password));
  const b = Buffer.from(ADMIN_SECRET);
  if (a.length !== b.length) return { ok: false };
  if (!timingSafeEqual(a, b)) return { ok: false };
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = `admin:${expires}`;
  const token = `${payload}.${sign(payload)}`;
  return { ok: true, token, expires };
}

/** Validate a session token from a cookie. */
export function validateSession(token: string | null | undefined): { ok: boolean; expires?: number } {
  if (!token || !ADMIN_SECRET) return { ok: false };
  const parts = token.split(".");
  if (parts.length !== 2) return { ok: false };
  const [payload, sig] = parts;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return { ok: false };
  if (!timingSafeEqual(a, b)) return { ok: false };
  const [, expiresStr] = payload.split(":");
  const expires = Number(expiresStr);
  if (!expires || Date.now() > expires) return { ok: false };
  return { ok: true, expires };
}

export const ADMIN_COOKIE = COOKIE_NAME;
