import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

const COOKIE_NAME = 'zilpo_admin'
const SESSION_TTL_MS = 8 * 60 * 60 * 1000 // 8 hours

// Default admin password — used only on the server, never shipped to clients.
// Override by setting ADMIN_KEY in the deployment environment.
const DEFAULT_ADMIN_PASSWORD = '9058172570@JhojhaFarhad'

function getAdminSecret(): string {
  // Cookie signing key — should be set per-deployment and rotated separately
  // from the admin password.
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_KEY || DEFAULT_ADMIN_PASSWORD
  return secret
}

function getAdminPassword(): string {
  return process.env.ADMIN_KEY || DEFAULT_ADMIN_PASSWORD
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
  const expected = getAdminPassword()
  if (!expected) return false
  return timingSafeEqStr(password, expected)
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
