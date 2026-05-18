import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getTwilioClient, VERIFY_SID } from '@/lib/twilio'

function getDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase env missing')
  return createClient(url, key, { auth: { persistSession: false } })
}

const PHONE_RE = /^[1-9]\d{9}$/

// In-memory rate limit (per Vercel instance)
type Bucket = { tokens: number; resetAt: number }
const buckets = new Map<string, Bucket>()
function rateLimit(key: string, windowMs: number, max: number): boolean {
  const now = Date.now()
  const b = buckets.get(key)
  if (!b || b.resetAt <= now) {
    buckets.set(key, { tokens: max - 1, resetAt: now + windowMs })
    return true
  }
  if (b.tokens <= 0) return false
  b.tokens -= 1
  return true
}
function ip(req: Request) {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
}

export async function POST(req: Request) {
  let phone = ''
  let loginOnly = false
  try {
    const body = await req.json() as { phone?: string; loginOnly?: boolean }
    phone = String(body?.phone || '').replace(/\D/g, '').slice(-10)
    loginOnly = !!body?.loginOnly
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
  if (!PHONE_RE.test(phone)) {
    return NextResponse.json({ error: 'Enter a valid 10-digit mobile number' }, { status: 400 })
  }

  if (!rateLimit(`prootp:phone:${phone}`, 60 * 1000, 1)) {
    return NextResponse.json({ error: 'Please wait before resending' }, { status: 429 })
  }
  if (!rateLimit(`prootp:phoneh:${phone}`, 60 * 60 * 1000, 5)) {
    return NextResponse.json({ error: 'Too many OTPs to this number' }, { status: 429 })
  }
  if (!rateLimit(`prootp:ip:${ip(req)}`, 60 * 60 * 1000, 30)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  if (loginOnly) {
    const supabase = getDb()
    const { data } = await supabase.from('professionals').select('id').eq('phone', phone).maybeSingle()
    if (!data) return NextResponse.json({ error: 'NO_ACCOUNT' }, { status: 404 })
  }

  try {
    const client = getTwilioClient()
    await client.verify.v2.services(VERIFY_SID).verifications.create({
      to: `+91${phone}`, channel: 'sms',
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[pro/send-otp]', err)
    return NextResponse.json({ error: 'Could not send OTP' }, { status: 500 })
  }
}
