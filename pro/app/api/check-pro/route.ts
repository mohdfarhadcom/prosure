import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

// Lightweight check — does a professional account exist for this phone?
// Called before sending OTP so a login attempt for an unknown number
// returns an error immediately without spending any OTP credits.
export async function POST(req: Request) {
  const { phone } = await req.json()
  if (!phone) return NextResponse.json({ error: 'Phone required' }, { status: 400 })
  const { data } = await supabase
    .from('professionals')
    .select('id')
    .eq('phone', phone)
    .single()
  if (!data) return NextResponse.json({ error: 'NO_ACCOUNT' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
