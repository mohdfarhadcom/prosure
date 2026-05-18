import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseServer'
import { issueUserSession, setUserCookie } from '@/lib/userSession'

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
    if (!res.ok) return null
    const data = await res.json()
    const u = data.users?.[0]
    if (!u?.phoneNumber) return null
    // Sanity-check the token isn't ancient. lastLoginAt is in ms string.
    const last = parseInt(u.lastLoginAt || '0', 10)
    if (!Number.isFinite(last) || Date.now() - last > 10 * 60 * 1000) return null
    return u.phoneNumber as string
  } catch {
    return null
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null) as { idToken?: string } | null
    if (!body?.idToken || typeof body.idToken !== 'string' || body.idToken.length > 4000) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const fullPhone = await getPhoneFromToken(body.idToken)
    if (!fullPhone) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })

    const db = getSupabaseAdmin()
    const { data: existing } = await db.from('users').select('*').eq('phone', fullPhone).single()

    let user = existing
    if (!user) {
      const { data: newUser, error } = await db
        .from('users')
        .insert({ phone: fullPhone })
        .select()
        .single()
      if (error) {
        console.error('[verify-firebase] insert failed:', error.message)
        return NextResponse.json({ error: 'Could not create account' }, { status: 500 })
      }
      user = newUser
    }

    const res = NextResponse.json({ success: true, user })
    setUserCookie(res, issueUserSession(user.id as string))
    return res
  } catch (err) {
    console.error('[verify-firebase]', err)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
