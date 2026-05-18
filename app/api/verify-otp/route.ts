import { NextResponse } from 'next/server'
import { getTwilioClient, VERIFY_SID } from '@/lib/twilio'
import { getSupabaseAdmin } from '@/lib/supabaseServer'
import { issueUserSession, setUserCookie } from '@/lib/userSession'
import { rateLimit, getClientIp } from '@/lib/rateLimit'

const PHONE_RE = /^[1-9]\d{9}$/
const CODE_RE = /^\d{4,8}$/

export async function POST(req: Request) {
  let phone = ''
  let code = ''
  try {
    const body = await req.json() as { phone?: string; code?: string }
    phone = String(body?.phone || '').replace(/\D/g, '').slice(-10)
    code = String(body?.code || '').trim()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
  if (!PHONE_RE.test(phone) || !CODE_RE.test(code)) {
    return NextResponse.json({ error: 'Invalid phone or code' }, { status: 400 })
  }

  const ip = getClientIp(req)
  const ipLimit = rateLimit({ key: `otpv:ip:${ip}`, windowMs: 15 * 60 * 1000, max: 30 })
  if (!ipLimit.ok) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  const phoneLimit = rateLimit({ key: `otpv:phone:${phone}`, windowMs: 15 * 60 * 1000, max: 8 })
  if (!phoneLimit.ok) return NextResponse.json({ error: 'Too many attempts. Wait a few minutes.' }, { status: 429 })

  const formatted = `+91${phone}`

  try {
    const client = getTwilioClient()
    const check = await client.verify.v2.services(VERIFY_SID).verificationChecks.create({
      to: formatted, code,
    })
    if (check.status !== 'approved') {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
    }
  } catch (err) {
    console.error('[verify-otp]', err)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }

  const db = getSupabaseAdmin()
  const { data: existing } = await db.from('users').select('*').eq('phone', formatted).single()
  let user = existing
  if (!user) {
    const { data: newUser, error } = await db.from('users').insert({ phone: formatted }).select().single()
    if (error || !newUser) {
      console.error('[verify-otp] insert user failed:', error?.message)
      return NextResponse.json({ error: 'Could not create account' }, { status: 500 })
    }
    user = newUser
  }

  const res = NextResponse.json({ success: true, user })
  setUserCookie(res, issueUserSession(user.id as string))
  return res
}
