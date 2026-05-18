import { NextResponse } from 'next/server'
import { validateAdminPassword, issueAdminSession, setAdminCookie, clearAdminCookie } from '@/lib/adminAuth'

// Simple in-memory throttle (per server instance). Vercel cold-starts will reset
// this, but it raises the cost of online brute-force from a single attacker IP.
const ATTEMPTS = new Map<string, { count: number; lockUntil: number }>()
const MAX_ATTEMPTS = 5
const LOCK_MS = 10 * 60 * 1000

function getIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim()
    || req.headers.get('x-real-ip')
    || 'unknown'
}

export async function POST(req: Request) {
  const ip = getIp(req)
  const now = Date.now()
  const rec = ATTEMPTS.get(ip)
  if (rec && rec.lockUntil > now) {
    return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 })
  }

  let password = ''
  try {
    const body = await req.json()
    password = typeof body?.password === 'string' ? body.password : ''
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (!password || password.length > 200) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (!validateAdminPassword(password)) {
    const next = { count: (rec?.count || 0) + 1, lockUntil: 0 }
    if (next.count >= MAX_ATTEMPTS) next.lockUntil = now + LOCK_MS
    ATTEMPTS.set(ip, next)
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
  }

  ATTEMPTS.delete(ip)
  const token = issueAdminSession()
  const res = NextResponse.json({ ok: true })
  setAdminCookie(res, token)
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  clearAdminCookie(res)
  return res
}

export async function GET(req: Request) {
  const { isAdminRequest } = await import('@/lib/adminAuth')
  return NextResponse.json({ authed: isAdminRequest(req) })
}
