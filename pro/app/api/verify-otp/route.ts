import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

async function twilioVerify(phone: string, code: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  const service = process.env.TWILIO_VERIFY_SERVICE_SID
  if (!sid || !token || !service) return { ok: false, error: 'OTP_NOT_CONFIGURED' }
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
  return { ok: data.status === 'approved', error: data.status }
}

export async function POST(req: Request) {
  const { phone, code, name, service_type, gender } = await req.json()
  if (!phone || !code) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const isSignup = !!(name && service_type)

  if (isSignup) {
    // SIGNUP: verify OTP first, then create account
    const { ok, error } = await twilioVerify(phone, code)
    if (!ok) return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })

    // Check if already exists (duplicate signup)
    const { data: existing } = await supabase.from('professionals').select('*').eq('phone', phone).single()
    if (existing) return NextResponse.json({ pro: existing, isNew: false })

    const { data: newPro, error: dbErr } = await supabase
      .from('professionals')
      .insert({ phone, name, service_type, gender: gender || null, approved: false })
      .select().single()
    if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 })

    await supabase.from('pro_wallets').insert({ professional_id: newPro.id })
    return NextResponse.json({ pro: newPro, isNew: true })
  }

  // LOGIN: check DB first so we don't waste the OTP if account doesn't exist
  const { data: existing } = await supabase.from('professionals').select('*').eq('phone', phone).single()
  if (!existing) {
    return NextResponse.json({ error: 'NO_ACCOUNT' }, { status: 404 })
  }

  // Account exists — now verify OTP
  const { ok } = await twilioVerify(phone, code)
  if (!ok) return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })

  return NextResponse.json({ pro: existing, isNew: false })
}
