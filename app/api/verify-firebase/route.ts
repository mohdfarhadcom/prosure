import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseServer'

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
    return data.users?.[0]?.phoneNumber ?? null
  } catch {
    return null
  }
}

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json()
    if (!idToken) return NextResponse.json({ error: 'Missing token' }, { status: 400 })

    const fullPhone = await getPhoneFromToken(idToken)
    if (!fullPhone) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })

    const db = getSupabaseAdmin()
    const { data: existing } = await db.from('users').select('*').eq('phone', fullPhone).single()

    if (existing) return NextResponse.json({ success: true, user: existing })

    const { data: newUser, error } = await db
      .from('users')
      .insert({ phone: fullPhone })
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true, user: newUser })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
