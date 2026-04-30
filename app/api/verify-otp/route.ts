import { NextResponse } from 'next/server'
import { getTwilioClient, VERIFY_SID } from '@/lib/twilio'
import { getSupabaseAdmin } from '@/lib/supabaseServer'

export async function POST(req: Request) {
  try {
    const { phone, code } = await req.json()
    if (!phone || !code) return NextResponse.json({ error: 'Phone and code required' }, { status: 400 })

    const formatted = phone.startsWith('+') ? phone : `+91${phone}`
    const client = getTwilioClient()
    const check = await client.verify.v2.services(VERIFY_SID).verificationChecks.create({
      to: formatted,
      code,
    })

    if (check.status !== 'approved') {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
    }

    const db = getSupabaseAdmin()
    const { data: existing } = await db.from('users').select('*').eq('phone', formatted).single()

    let user = existing
    if (!user) {
      const { data: newUser, error } = await db
        .from('users')
        .insert({ phone: formatted })
        .select()
        .single()
      if (error) throw error
      user = newUser
    }

    return NextResponse.json({ success: true, user })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Verification failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
