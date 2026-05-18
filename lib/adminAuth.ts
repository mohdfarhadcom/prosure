import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

const COOKIE_NAME = 'zilpo_admin'
const SESSION_TTL_MS = 8 * 60 * 60 * 1000 // 8 hours

// Salted scrypt hash of the admin password. Hash and salt are safe in source
// because scrypt is computationally expensive to reverse — a determined
// attacker would need years of GPU time to brute-force a non-trivial password.
// To rotate: set ADMIN_KEY in the deployment env to a fresh plaintext password
// (env var takes precedence over this hash).
const PASSWORD_SALT_HEX = '8ca8bb449b95fe57146244a2b1c21d7c'
const PASSWORD_HASH_HEX = '5af9f6b4f24ea7696087f935a42e8ae66203a54b364a1764de22a6dd06616db8826b1bd0804f47bb4878e5a5c014936b7e911afb4145b2a908f7f2e77734dca5'

function getAdminSecret(): string {
  // Cookie-signing key. Should be set per-deployment; falls back to the
  // password hash so the app still works without extra env vars.
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_KEY || PASSWORD_HASH_HEX
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', getAdminSecret()).update(payload).digest('hex')
}

function timingSafeEqStr(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  return crypto.timingSafeEqual(ab, bb)
}

export function issueAdminSession(): string {
  const expiresAt = Date.now() + SESSION_TTL_MS
  const payload = `admin.${expiresAt}`
  const sig = sign(payload)
  return `${payload}.${sig}`
}

export function verifyAdminToken(token: string | undefined | null): boolean {
  if (!token) return false
  const parts = token.split('.')
  if (parts.length !== 3) return false
  const [role, expStr, sig] = parts
  if (role !== 'admin') return false
  const exp = parseInt(expStr, 10)
  if (!Number.isFinite(exp) || Date.now() > exp) return false
  const expected = sign(`${role}.${expStr}`)
  return timingSafeEqStr(sig, expected)
}

export function isAdminRequest(req: Request): boolean {
  const cookieHeader = req.headers.get('cookie') || ''
  const match = cookieHeader.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]+)`))
  if (!match) return false
  return verifyAdminToken(decodeURIComponent(match[1]))
}

export function adminAuthFail(): NextResponse {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export function validateAdminPassword(password: string): boolean {
  if (typeof password !== 'string' || password.length === 0 || password.length > 200) return false

  // Env var override: lets the password be rotated without code changes.
  const override = process.env.ADMIN_KEY
  if (override) return timingSafeEqStr(password, override)

  // Default: compare scrypt(password) to the stored hash.
  const salt = Buffer.from(PASSWORD_SALT_HEX, 'hex')
  const stored = Buffer.from(PASSWORD_HASH_HEX, 'hex')
  const computed = crypto.scryptSync(password, salt, stored.length)
  if (computed.length !== stored.length) return false
  return crypto.timingSafeEqual(computed, stored)
}

export function setAdminCookie(res: NextResponse, token: string) {
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  })
}

export function clearAdminCookie(res: NextResponse) {
  res.cookies.set(COOKIE_NAME, '', { httpOnly: true, path: '/', maxAge: 0 })
}

// Server component helper (uses next/headers cookies())
export function isAdminFromCookies(): boolean {
  const c = cookies().get(COOKIE_NAME)
  return verifyAdminToken(c?.value)
}
