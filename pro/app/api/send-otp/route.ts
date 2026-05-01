import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getTwilioClient, VERIFY_SID } from '@/lib/twilio'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function POST(req: Request) {
  try {
    const { phone, loginOnly } = await req.json()
    if (!phone) return NextResponse.json({ error: 'Phone required' }, { status: 400 })

    // For login: check account exists BEFORE spending an OTP
    if (loginOnly) {
      const { data } = await supabase
        .from('professionals')
        .select('id')
        .eq('phone', phone)
        .single()
      if (!data) return NextResponse.json({ error: 'NO_ACCOUNT' }, { status: 404 })
    }

    const formatted = phone.startsWith('+') ? phone : `+91${phone}`
    const client = getTwilioClient()
    await client.verify.v2.services(VERIFY_SID).verifications.create({
      to: formatted,
      channel: 'sms',
    })
    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to send OTP'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
