import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getTwilioClient, VERIFY_SID } from '@/lib/twilio'
import { issueProSession, setProCookie } from '@/lib/proSession'

function getDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase env missing')
  return createClient(url, key, { auth: { persistSession: false } })
}

const PHONE_RE = /^[1-9]\d{9}$/
const CODE_RE = /^\d{4,8}$/

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

async function twilioVerify(phone: string, code: string): Promise<boolean> {
  const client = getTwilioClient()
  const check = await client.verify.v2.services(VERIFY_SID).verificationChecks.create({
    to: `+91${phone}`, code,
  })
  return check.status === 'approved'
}

function sanitizeName(s: unknown): string | null {
  if (typeof s !== 'string') return null
  const t = s.trim()
  if (t.length < 2 || t.length > 60) return null
  return t
}

export async function POST(req: Request) {
  let phone = ''
  let code = ''
  let name: string | undefined
  let serviceType: string | undefined
  let gender: string | undefined
  try {
    const body = await req.json() as {
      phone?: string; code?: string; name?: string; service_type?: string; gender?: string
    }
    phone = String(body?.phone || '').replace(/\D/g, '').slice(-10)
    code = String(body?.code || '').trim()
    name = body?.name
    serviceType = body?.service_type
    gender = body?.gender
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (!PHONE_RE.test(phone) || !CODE_RE.test(code)) {
    return NextResponse.json({ error: 'Invalid phone or code' }, { status: 400 })
  }
  if (!rateLimit(`provotp:ip:${ip(req)}`, 15 * 60 * 1000, 30)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }
  if (!rateLimit(`provotp:phone:${phone}`, 15 * 60 * 1000, 8)) {
    return NextResponse.json({ error: 'Too many attempts. Wait a few minutes.' }, { status: 429 })
  }

  const supabase = getDb()
  const isSignup = !!(name && serviceType)

  try {
    if (isSignup) {
      const cleanName = sanitizeName(name)
      if (!cleanName) return NextResponse.json({ error: 'Invalid name' }, { status: 400 })
      const st = serviceType === 'home_help' || serviceType === 'home_cook' ? serviceType : null
      if (!st) return NextResponse.json({ error: 'Invalid service type' }, { status: 400 })
      const g = gender === 'male' || gender === 'female' || gender === 'other' ? gender : null

      if (!await twilioVerify(phone, code)) {
        return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
      }

      const { data: existing } = await supabase.from('professionals').select('*').eq('phone', phone).single()
      if (existing) {
        const res = NextResponse.json({ pro: existing, isNew: false })
        setProCookie(res, issueProSession(existing.id as string))
        return res
      }

      const { data: newPro, error: dbErr } = await supabase
        .from('professionals')
        .insert({ phone, name: cleanName, service_type: st, gender: g })
        .select().single()
      if (dbErr || !newPro) {
        console.error('[pro/verify-otp]', dbErr?.message)
        return NextResponse.json({ error: 'Could not create account' }, { status: 500 })
      }
      await supabase.from('pro_wallets').insert({ professional_id: newPro.id })
      const res = NextResponse.json({ pro: newPro, isNew: true })
      setProCookie(res, issueProSession(newPro.id as string))
      return res
    }

    const { data: existing } = await supabase.from('professionals').select('*').eq('phone', phone).single()
    if (!existing) return NextResponse.json({ error: 'NO_ACCOUNT' }, { status: 404 })
    if (!await twilioVerify(phone, code)) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
    }
    const res = NextResponse.json({ pro: existing, isNew: false })
    setProCookie(res, issueProSession(existing.id as string))
    return res
  } catch (err) {
    console.error('[pro/verify-otp]', err)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
