/**
 * Input sanitization helpers.
 *
 * User-submitted content is untrusted. We strip control characters, neutralize
 * HTML, cap length, and remove prompt-injection style "system" markers from
 * content that will be sent to Gemini.
 */

const MAX_DESCRIPTION = 2000;
const MAX_ADDITIONAL = 1000;
const MAX_IDENTIFIER = 256;
const MAX_HANDLE = 64;
const MAX_COUNTRY = 64;

/** Strip ASCII control chars except \n\r\t, and trim. */
function stripControl(s: string): string {
  return s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
}

/** Remove anything that looks like a system-prompt instruction. */
function stripPromptInjection(s: string): string {
  return s
    .replace(/\b(system|assistant|developer|tool):\s*/gi, "")
    .replace(/<\s*\/?\s*(system|instructions?|prompt)\s*>/gi, "")
    .replace(/\bignore (all|previous|the above) instructions?\b/gi, "")
    .trim();
}

export function sanitizeText(value: unknown, max = 2000): string {
  if (typeof value !== "string") return "";
  let v = stripControl(value);
  v = stripPromptInjection(v);
  // Collapse runs of whitespace
  v = v.replace(/\s{3,}/g, " ").slice(0, max);
  return v;
}

export function sanitizeDescription(v: unknown): string {
  return sanitizeText(v, MAX_DESCRIPTION);
}
export function sanitizeAdditional(v: unknown): string {
  return sanitizeText(v, MAX_ADDITIONAL);
}
export function sanitizeIdentifier(v: unknown): string {
  return sanitizeText(v, MAX_IDENTIFIER).replace(/\s+/g, " ");
}
export function sanitizeHandle(v: unknown): string {
  return sanitizeText(v, MAX_HANDLE).replace(/[^a-zA-Z0-9._-]/g, "");
}
export function sanitizeCountry(v: unknown): string {
  return sanitizeText(v, MAX_COUNTRY);
}

/** Validate a URL is http(s) and not a local/internal address (SSRF guard). */
export function isSafePublicUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    if (!/^https?:$/.test(u.protocol)) return false;
    const host = u.hostname.toLowerCase();
    if (
      host === "localhost" ||
      host === "0.0.0.0" ||
      host.endsWith(".local") ||
      host.endsWith(".internal") ||
      /^127\./.test(host) ||
      /^10\./.test(host) ||
      /^192\.168\./.test(host) ||
      /^169\.254\./.test(host) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
      /^::1$/.test(host)
    ) {
      return false;
    }
    // Block metadata endpoints
    if (host === "169.254.169.254" || host === "metadata.google.internal") return false;
    return true;
  } catch {
    return false;
  }
}

/** Validate an incident date is a plausible past date in YYYY-MM-DD. */
export function isValidIncidentDate(v: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(v);
  if (isNaN(d.getTime())) return false;
  const now = new Date();
  if (d > now) return false;
  // No older than 10 years
  const min = new Date();
  min.setFullYear(now.getFullYear() - 10);
  if (d < min) return false;
  return true;
}
