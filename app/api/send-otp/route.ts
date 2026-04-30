import { NextResponse } from 'next/server'
import { getTwilioClient, VERIFY_SID } from '@/lib/twilio'

export async function POST(req: Request) {
  try {
    const { phone } = await req.json()
    if (!phone) return NextResponse.json({ error: 'Phone required' }, { status: 400 })

    const formatted = phone.startsWith('+') ? phone : `+91${phone}`
    const client = getTwilioClient()
    await client.verify.v2.services(VERIFY_SID).verifications.create({
      to: formatted,
      channel: 'sms',
    })
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to send OTP'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
