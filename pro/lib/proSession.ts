import { NextResponse } from 'next/server'
import crypto from 'crypto'

const COOKIE_NAME = 'zilpo_pro_session'
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000 // 30 days

function secret(): string {
  const s = process.env.SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!s) throw new Error('SESSION_SECRET (or SUPABASE_SERVICE_ROLE_KEY) required')
  return s
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', secret()).update(payload).digest('hex')
}

function safeEq(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  return crypto.timingSafeEqual(ab, bb)
}

export function issueProSession(proId: string): string {
  const exp = Date.now() + SESSION_TTL_MS
  const payload = `p.${proId}.${exp}`
  return `${payload}.${sign(payload)}`
}

export function verifyProToken(token: string | undefined | null): { proId: string } | null {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 4) return null
  const [role, proId, expStr, sig] = parts
  if (role !== 'p') return null
  const exp = parseInt(expStr, 10)
  if (!Number.isFinite(exp) || Date.now() > exp) return null
  const expected = sign(`${role}.${proId}.${expStr}`)
  if (!safeEq(sig, expected)) return null
  return { proId }
}

export function getProSession(req: Request): { proId: string } | null {
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]+)`))
  if (!match) return null
  return verifyProToken(decodeURIComponent(match[1]))
}

export function requirePro(req: Request): { proId: string } | NextResponse {
  const s = getProSession(req)
  if (!s) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return s
}

export function setProCookie(res: NextResponse, token: string) {
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  })
}

export function clearProCookie(res: NextResponse) {
  res.cookies.set(COOKIE_NAME, '', { httpOnly: true, path: '/', maxAge: 0 })
}
