import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requirePro } from '@/lib/proSession'
import crypto from 'crypto'

function getDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase env missing')
  return createClient(url, key, { auth: { persistSession: false } })
}

// Per-booking attempt counter, in-memory. Resets on cold start, fine for short windows.
const ATTEMPTS = new Map<string, { count: number; lockUntil: number }>()
const MAX_ATTEMPTS = 5
const LOCK_MS = 15 * 60 * 1000

function safeEq(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  return crypto.timingSafeEqual(ab, bb)
}

export async function POST(req: Request) {
  const auth = requirePro(req)
  if (auth instanceof NextResponse) return auth

  const body = await req.json().catch(() => null) as { bookingId?: string; code?: string } | null
  if (!body?.bookingId || typeof body.code !== 'string') {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
  const code = body.code.trim()
  if (!/^\d{4}$/.test(code)) {
    return NextResponse.json({ error: 'Code must be 4 digits' }, { status: 400 })
  }

  const key = `${auth.proId}:${body.bookingId}`
  const rec = ATTEMPTS.get(key)
  const now = Date.now()
  if (rec && rec.lockUntil > now) {
    return NextResponse.json({ error: 'Too many wrong attempts. Try again in a few minutes.' }, { status: 429 })
  }

  const db = getDb()
  const { data: booking } = await db.from('bookings')
    .select('id, status, professional_id, otp')
    .eq('id', body.bookingId).single()

  if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  if (booking.professional_id !== auth.proId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  if (booking.status !== 'accepted' && booking.status !== 'en route') {
    return NextResponse.json({ error: `Cannot start a ${booking.status} booking` }, { status: 409 })
  }
  if (!booking.otp) {
    return NextResponse.json({ error: 'Start code missing — please contact support' }, { status: 500 })
  }

  if (!safeEq(code, String(booking.otp))) {
    const next = { count: (rec?.count || 0) + 1, lockUntil: 0 }
    if (next.count >= MAX_ATTEMPTS) next.lockUntil = now + LOCK_MS
    ATTEMPTS.set(key, next)
    return NextResponse.json({ error: 'Wrong code. Ask the customer to check their app.' }, { status: 401 })
  }

  ATTEMPTS.delete(key)
  const { data: updated, error } = await db.from('bookings')
    .update({ status: 'in progress', service_started_at: new Date().toISOString(), otp_verified_at: new Date().toISOString() })
    .eq('id', booking.id)
    .eq('professional_id', auth.proId)
    .in('status', ['accepted', 'en route'])
    .select('id')
  if (error || !updated || updated.length === 0) {
    return NextResponse.json({ error: 'Could not start booking' }, { status: 409 })
  }

  return NextResponse.json({ ok: true })
}
