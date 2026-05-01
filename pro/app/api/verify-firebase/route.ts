import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

// Verify the Firebase ID token using Firebase's own REST API.
// This only needs the public Web API key — no Admin SDK or service account needed.
async function getPhoneFromToken(idToken: string): Promise<string | null> {
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  if (!key) return null
  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      }
    )
    const data = await res.json()
    return data.users?.[0]?.phoneNumber ?? null  // e.g. "+919876543210"
  } catch {
    return null
  }
}

export async function POST(req: Request) {
  try {
    const { idToken, name, service_type, gender } = await req.json()
    if (!idToken) return NextResponse.json({ error: 'Missing token' }, { status: 400 })

    const fullPhone = await getPhoneFromToken(idToken)
    if (!fullPhone) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })

    // Strip the +91 prefix — phone stored as 10-digit string throughout the app
    const phone = fullPhone.replace(/^\+91/, '')

    const isSignup = !!(name && service_type)

    if (isSignup) {
      const { data: existing } = await supabase.from('professionals').select('*').eq('phone', phone).single()
      if (existing) return NextResponse.json({ pro: existing, isNew: false })

      const { data: newPro, error: dbErr } = await supabase
        .from('professionals')
        .insert({ phone, name, service_type, gender: gender || null })
        .select().single()
      if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 })

      await supabase.from('pro_wallets').insert({ professional_id: newPro.id })
      return NextResponse.json({ pro: newPro, isNew: true })
    }

    // Login — account must already exist
    const { data: existing } = await supabase.from('professionals').select('*').eq('phone', phone).single()
    if (!existing) return NextResponse.json({ error: 'NO_ACCOUNT' }, { status: 404 })
    return NextResponse.json({ pro: existing, isNew: false })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
