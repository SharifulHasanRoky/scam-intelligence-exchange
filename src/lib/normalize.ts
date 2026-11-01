/**
 * Identifier normalization & masking utilities.
 *
 * Goals:
 *  - Normalize incoming identifiers so the same phone number / domain / email
 *    always matches itself regardless of formatting.
 *  - Produce a stable HMAC hash for matching without exposing the raw value.
 *  - Produce a display-safe masked value for public listing.
 *
 * The HMAC secret MUST come from `IDENTIFIER_HMAC_SECRET` and never be exposed
 * to the client. All functions here are safe to call from server code only.
 */

import { createHmac, randomBytes } from "node:crypto";
import type { IdentifierType } from "./types";

const HMAC_SECRET = process.env.IDENTIFIER_HMAC_SECRET || "dev-insecure-secret-change-me";

/** Detect the type of an identifier from its raw value. */
export function detectIdentifierType(value: string): IdentifierType {
  const v = value.trim();
  if (!v) return "business_name";

  // Email
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "email";

  // URL with protocol
  if (/^https?:\/\//i.test(v)) {
    try {
      const u = new URL(v);
      const host = u.hostname.toLowerCase();
      if (/^(www\.)?(facebook|fb|instagram|tiktok|twitter|x|linkedin|telegram|youtube|snapchat|wechat|whatsapp)\./.test(host)) {
        return "social_profile";
      }
      return "url";
    } catch {
      return "url";
    }
  }

  // Bare domain like example.com (but not "example phone")
  if (/^([a-z0-9-]+\.)+[a-z]{2,}$/i.test(v)) {
    return "domain";
  }

  // Social profile short form like @user or instagram.com/user
  if (/^@?[a-z0-9._-]+$/i.test(v) && v.length <= 64) {
    // Heuristic: if it looks like a handle treat as social_profile
    return "social_profile";
  }

  // Phone number — +, digits, spaces, dashes, parentheses, 7–15 digits
  const digits = v.replace(/[^\d]/g, "");
  if (/^[+\d][\d\s\-()]{6,}$/.test(v) && digits.length >= 7 && digits.length <= 15) {
    return "phone";
  }

  return "business_name";
}

/** E.164-ish phone normalization (best effort, no external libs). */
export function normalizePhone(raw: string): string {
  let v = raw.trim();
  const hasPlus = v.startsWith("+");
  const digits = v.replace(/[^\d]/g, "");
  if (!digits) return "";
  // If user typed "+60..." keep leading country code
  if (hasPlus) return "+" + digits;
  // If 11 digits starting with 00 -> international
  if (digits.startsWith("00")) return "+" + digits.slice(2);
  return digits;
}

export function normalizeDomain(raw: string): string {
  try {
    let v = raw.trim().toLowerCase();
    if (/^https?:\/\//i.test(v)) {
      v = new URL(v).hostname;
    }
    v = v.replace(/^www\./, "");
    // Strip path/port
    v = v.split("/")[0].split(":")[0];
    return v;
  } catch {
    return raw.trim().toLowerCase();
  }
}

export function normalizeEmail(raw: string): string {
  const v = raw.trim().toLowerCase();
  const at = v.lastIndexOf("@");
  if (at < 0) return v;
  const local = v.slice(0, at);
  const domain = v.slice(at + 1);
  return `${local}@${normalizeDomain(domain)}`;
}

export function normalizeUrl(raw: string): string {
  try {
    const u = new URL(raw.includes("://") ? raw : `https://${raw}`);
    return u.toString().replace(/\/$/, "");
  } catch {
    return raw.trim();
  }
}

export function normalizeSocialProfile(raw: string): string {
  let v = raw.trim().toLowerCase();
  if (v.startsWith("@")) v = v.slice(1);
  return v;
}

/** Full normalization by type. */
export function normalizeIdentifier(value: string, type: IdentifierType): string {
  switch (type) {
    case "phone":
      return normalizePhone(value);
    case "email":
      return normalizeEmail(value);
    case "domain":
      return normalizeDomain(value);
    case "url":
      return normalizeUrl(value);
    case "social_profile":
      return normalizeSocialProfile(value);
    case "business_name":
      return value.trim().toLowerCase();
  }
}

/** HMAC-SHA256 of a normalized identifier. Stable across requests. */
export function hashIdentifier(normalizedValue: string): string {
  return createHmac("sha256", HMAC_SECRET).update(normalizedValue).digest("hex");
}

/** Generate a short, URL-safe idempotency / reference key. */
export function generateReference(prefix = "SC"): string {
  const year = new Date().getFullYear();
  const rand = randomBytes(4).toString("hex").toUpperCase();
  return `${prefix}-${year}-${rand}`;
}

/** Mask a phone number for public display: +60****1234 */
export function maskPhone(normalized: string): string {
  if (!normalized) return "";
  const digits = normalized.replace(/[^\d]/g, "");
  if (digits.length <= 4) return "*".repeat(digits.length);
  const last4 = digits.slice(-4);
  const masked = "*".repeat(Math.max(4, digits.length - 4));
  return (normalized.startsWith("+") ? "+" : "") + masked + last4;
}

/** Mask an email for public display: exa***@example.com */
export function maskEmail(normalized: string): string {
  const at = normalized.lastIndexOf("@");
  if (at < 0) return "***";
  const local = normalized.slice(0, at);
  const domain = normalized.slice(at + 1);
  const head = local.slice(0, Math.min(3, local.length));
  return `${head}${"*".repeat(3)}@${domain}`;
}

/** Mask a domain for public display: exa***.com */
export function maskDomain(normalized: string): string {
  const parts = normalized.split(".");
  if (parts.length < 2) return normalized;
  const tld = parts.slice(-1)[0];
  const sld = parts.slice(-2)[0];
  const head = sld.slice(0, Math.min(3, sld.length));
  const maskedSld = `${head}${"*".repeat(3)}`;
  // Preserve subdomains if any
  const subs = parts.slice(0, -2);
  return [...subs, maskedSld, tld].join(".");
}

/** Mask a URL using its domain mask + path length hint. */
export function maskUrl(normalized: string): string {
  try {
    const u = new URL(normalized);
    const maskedHost = maskDomain(u.hostname);
    const pathLen = u.pathname.replace(/\/$/, "").length;
    const pathHint = pathLen > 0 ? `/…${pathLen}` : "";
    return `${u.protocol}//${maskedHost}${pathHint}`;
  } catch {
    return maskDomain(normalized);
  }
}

/** Mask a social profile: jo*** */
export function maskSocialProfile(normalized: string): string {
  if (!normalized) return "";
  const head = normalized.slice(0, Math.min(2, normalized.length));
  return `${head}${"*".repeat(3)}`;
}

/** Mask a business name: keep first word, mask rest lightly. */
export function maskBusinessName(value: string): string {
  const v = value.trim();
  if (!v) return "";
  const first = v.split(/\s+/)[0];
  return `${first} ***`;
}

/** Produce the public-display (masked) form for an identifier. */
export function maskIdentifier(normalized: string, type: IdentifierType): string {
  switch (type) {
    case "phone":
      return maskPhone(normalized);
    case "email":
      return maskEmail(normalized);
    case "domain":
      return maskDomain(normalized);
    case "url":
      return maskUrl(normalized);
    case "social_profile":
      return maskSocialProfile(normalized);
    case "business_name":
      return maskBusinessName(normalized);
  }
}

/** Combined helper: normalize -> mask for display, and normalize -> hash for matching. */
export function prepareIdentifier(value: string, type?: IdentifierType) {
  const t = type ?? detectIdentifierType(value);
  const normalized = normalizeIdentifier(value, t);
  const display = maskIdentifier(normalized, t);
  const hash = hashIdentifier(normalized);
  return { type: t, normalized, display, hash };
}
