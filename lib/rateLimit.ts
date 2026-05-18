// Lightweight in-memory rate limiter. Best-effort per Vercel instance — cold
// starts and multi-region deployments will reset state, but it raises the cost
// of automated abuse from a single attacker IP/phone, which is the threat model
// for SMS/OTP endpoints.

type Bucket = { tokens: number; resetAt: number }

const buckets = new Map<string, Bucket>()

export function rateLimit({
  key,
  windowMs,
  max,
}: { key: string; windowMs: number; max: number }): { ok: boolean; retryAfterMs?: number; remaining?: number } {
  const now = Date.now()
  const b = buckets.get(key)
  if (!b || b.resetAt <= now) {
    buckets.set(key, { tokens: max - 1, resetAt: now + windowMs })
    return { ok: true, remaining: max - 1 }
  }
  if (b.tokens <= 0) {
    return { ok: false, retryAfterMs: b.resetAt - now }
  }
  b.tokens -= 1
  return { ok: true, remaining: b.tokens }
}

export function getClientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim()
    || req.headers.get('x-real-ip')
    || 'unknown'
}
