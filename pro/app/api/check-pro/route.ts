import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const PHONE_RE = /^[1-9]\d{9}$/

function getDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase env missing')
  return createClient(url, key, { auth: { persistSession: false } })
}

// Lightweight check — does a professional account exist for this phone?
// Called before sending OTP so a login attempt for an unknown number
// returns an error immediately without spending any OTP credits.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null) as { phone?: string } | null
  const phone = String(body?.phone || '').replace(/\D/g, '').slice(-10)
  if (!PHONE_RE.test(phone)) {
    return NextResponse.json({ error: 'Invalid phone' }, { status: 400 })
  }
  const supabase = getDb()
  const { data } = await supabase
    .from('professionals')
    .select('id')
    .eq('phone', phone)
    .maybeSingle()
  if (!data) return NextResponse.json({ error: 'NO_ACCOUNT' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
