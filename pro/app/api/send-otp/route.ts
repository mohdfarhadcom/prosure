import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { phone } = await req.json()
  if (!phone || !/^\d{10}$/.test(phone)) {
    return NextResponse.json({ error: 'Invalid phone' }, { status: 400 })
  }

  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  const service = process.env.TWILIO_VERIFY_SERVICE_SID

  if (!sid || !token || !service) {
    return NextResponse.json({ error: 'OTP_NOT_CONFIGURED' }, { status: 503 })
  }

  try {
    const res = await fetch(
      `https://verify.twilio.com/v2/Services/${service}/Verifications`,
      {
        method: 'POST',
        headers: {
          Authorization: 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ To: `+91${phone}`, Channel: 'sms' }),
      }
    )
    if (!res.ok) throw new Error('Twilio error')
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}
