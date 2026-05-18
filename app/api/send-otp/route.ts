import { NextResponse } from 'next/server'
import { getTwilioClient, VERIFY_SID } from '@/lib/twilio'
import { rateLimit, getClientIp } from '@/lib/rateLimit'

const PHONE_RE = /^[1-9]\d{9}$/

export async function POST(req: Request) {
  let phone: string
  try {
    const body = await req.json() as { phone?: string }
    phone = String(body?.phone || '').replace(/\D/g, '').slice(-10)
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
  if (!PHONE_RE.test(phone)) {
    return NextResponse.json({ error: 'Enter a valid 10-digit Indian mobile number' }, { status: 400 })
  }

  // Per-phone limit (defense in depth with Twilio Verify's own limit)
  const phoneLimit = rateLimit({ key: `otp:phone:${phone}`, windowMs: 60 * 1000, max: 1 })
  if (!phoneLimit.ok) {
    return NextResponse.json({ error: 'Please wait a moment before resending' }, { status: 429 })
  }
  const phoneHourly = rateLimit({ key: `otp:phoneh:${phone}`, windowMs: 60 * 60 * 1000, max: 5 })
  if (!phoneHourly.ok) {
    return NextResponse.json({ error: 'Too many OTPs sent to this number. Try again later.' }, { status: 429 })
  }
  // Per-IP limit
  const ip = getClientIp(req)
  const ipLimit = rateLimit({ key: `otp:ip:${ip}`, windowMs: 60 * 60 * 1000, max: 30 })
  if (!ipLimit.ok) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const client = getTwilioClient()
    await client.verify.v2.services(VERIFY_SID).verifications.create({
      to: `+91${phone}`,
      channel: 'sms',
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[send-otp]', err)
    return NextResponse.json({ error: 'Could not send OTP. Try again in a moment.' }, { status: 500 })
  }
}
