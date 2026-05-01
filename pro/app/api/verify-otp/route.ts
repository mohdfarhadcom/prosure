import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getTwilioClient, VERIFY_SID } from '@/lib/twilio'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

async function twilioVerify(phone: string, code: string): Promise<boolean> {
  const formatted = phone.startsWith('+') ? phone : `+91${phone}`
  const client = getTwilioClient()
  const check = await client.verify.v2.services(VERIFY_SID).verificationChecks.create({
    to: formatted,
    code,
  })
  return check.status === 'approved'
}

export async function POST(req: Request) {
  try {
    const { phone, code, name, service_type, gender } = await req.json()
    if (!phone || !code) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const isSignup = !!(name && service_type)

    if (isSignup) {
      // SIGNUP: verify OTP first, then create account
      const approved = await twilioVerify(phone, code)
      if (!approved) return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })

      // Return existing account if phone already registered
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

    // LOGIN: check DB first so we don't consume the OTP for a non-existent account
    const { data: existing } = await supabase.from('professionals').select('*').eq('phone', phone).single()
    if (!existing) return NextResponse.json({ error: 'NO_ACCOUNT' }, { status: 404 })

    const approved = await twilioVerify(phone, code)
    if (!approved) return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })

    return NextResponse.json({ pro: existing, isNew: false })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Verification failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
