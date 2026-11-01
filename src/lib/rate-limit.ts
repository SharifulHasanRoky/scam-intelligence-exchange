/**
 * Lightweight in-memory rate limiter for the MVP.
 *
 * In production this should be backed by Vercel KV / Upstash Redis, but for the
 * MVP we use a per-instance in-memory token bucket. On Vercel each serverless
 * instance maintains its own state; for stricter limits use the Upstairs
 * Redis adapter (configured via `RATE_LIMIT_SECRET`).
 */

interface Bucket {
  tokens: number;
  last: number;
}

const buckets = new Map<string, Bucket>();
const CAPACITY = 10; // max burst
const REFILL_PER_SEC = 0.5; // 1 token per 2 seconds

export function rateLimitCheck(key: string, capacity = CAPACITY, refillPerSec = REFILL_PER_SEC): {
  ok: boolean;
  remaining: number;
  retryAfterMs: number;
} {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b) {
    buckets.set(key, { tokens: capacity - 1, last: now });
    return { ok: true, remaining: capacity - 1, retryAfterMs: 0 };
  }
  const elapsed = (now - b.last) / 1000;
  const refilled = Math.min(capacity, b.tokens + elapsed * refillPerSec);
  if (refilled < 1) {
    const need = 1 - refilled;
    const retryAfterMs = Math.ceil((need / refillPerSec) * 1000);
    b.last = now;
    b.tokens = refilled;
    return { ok: false, remaining: 0, retryAfterMs };
  }
  b.tokens = refilled - 1;
  b.last = now;
  return { ok: true, remaining: Math.floor(b.tokens), retryAfterMs: 0 };
}

/** Convenience: rate limit key for a request by IP + route. */
export function rateLimitKeyFor(ip: string | null, route: string): string {
  const safeIp = (ip || "anonymous").replace(/[^a-zA-Z0-9.:_-]/g, "").slice(0, 64);
  return `${route}:${safeIp}`;
}

/** Get the client IP from Next.js headers (Vercel-aware). */
export function getClientIp(headers: Headers): string | null {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    null
  );
}
