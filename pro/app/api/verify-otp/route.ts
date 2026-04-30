import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function POST(req: Request) {
  const { phone, code, name, service_type, gender } = await req.json()
  if (!phone || !code) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  const service = process.env.TWILIO_VERIFY_SERVICE_SID

  if (!sid || !token || !service) {
    return NextResponse.json({ error: 'OTP_NOT_CONFIGURED' }, { status: 503 })
  }

  // Verify with Twilio
  const res = await fetch(
    `https://verify.twilio.com/v2/Services/${service}/VerificationChecks`,
    {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ To: `+91${phone}`, Code: code }),
    }
  )
  const data = await res.json()
  if (data.status !== 'approved') {
    return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
  }

  // Check if professional exists
  const { data: existing } = await supabase
    .from('professionals')
    .select('*')
    .eq('phone', phone)
    .single()

  if (existing) {
    return NextResponse.json({ pro: existing, isNew: false })
  }

  // Create new professional
  if (!name || !service_type) {
    return NextResponse.json({ error: 'Name and service type required for signup' }, { status: 400 })
  }

  const { data: newPro, error } = await supabase
    .from('professionals')
    .insert({ phone, name, service_type, gender: gender || null, approved: false })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Create wallet
  await supabase.from('pro_wallets').insert({ professional_id: newPro.id })

  return NextResponse.json({ pro: newPro, isNew: true })
}
