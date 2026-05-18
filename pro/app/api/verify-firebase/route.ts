import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { issueProSession, setProCookie } from '@/lib/proSession'

function getDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase env missing')
  return createClient(url, key, { auth: { persistSession: false } })
}

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
    const last = parseInt(u.lastLoginAt || '0', 10)
    if (!Number.isFinite(last) || Date.now() - last > 10 * 60 * 1000) return null
    return u.phoneNumber as string
  } catch {
    return null
  }
}

function sanitizeName(s: unknown): string | null {
  if (typeof s !== 'string') return null
  const trimmed = s.trim()
  if (trimmed.length < 2 || trimmed.length > 60) return null
  return trimmed
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null) as {
      idToken?: string; name?: string; service_type?: string; gender?: string
    } | null
    if (!body?.idToken || typeof body.idToken !== 'string' || body.idToken.length > 4000) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const fullPhone = await getPhoneFromToken(body.idToken)
    if (!fullPhone) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })

    const phone = fullPhone.replace(/^\+91/, '')
    const supabase = getDb()

    const isSignup = !!(body.name && body.service_type)

    if (isSignup) {
      const cleanName = sanitizeName(body.name)
      if (!cleanName) return NextResponse.json({ error: 'Invalid name' }, { status: 400 })
      const serviceType = body.service_type === 'home_help' || body.service_type === 'home_cook' ? body.service_type : null
      if (!serviceType) return NextResponse.json({ error: 'Invalid service type' }, { status: 400 })
      const gender = body.gender === 'male' || body.gender === 'female' || body.gender === 'other' ? body.gender : null

      const { data: existing } = await supabase.from('professionals').select('*').eq('phone', phone).single()
      if (existing) {
        const res = NextResponse.json({ pro: existing, isNew: false })
        setProCookie(res, issueProSession(existing.id as string))
        return res
      }

      const { data: newPro, error: dbErr } = await supabase
        .from('professionals')
        .insert({ phone, name: cleanName, service_type: serviceType, gender })
        .select().single()
      if (dbErr || !newPro) {
        console.error('[pro/verify-firebase] insert failed:', dbErr?.message)
        return NextResponse.json({ error: 'Could not create account' }, { status: 500 })
      }
      await supabase.from('pro_wallets').insert({ professional_id: newPro.id })

      const res = NextResponse.json({ pro: newPro, isNew: true })
      setProCookie(res, issueProSession(newPro.id as string))
      return res
    }

    const { data: existing } = await supabase.from('professionals').select('*').eq('phone', phone).single()
    if (!existing) return NextResponse.json({ error: 'NO_ACCOUNT' }, { status: 404 })
    const res = NextResponse.json({ pro: existing, isNew: false })
    setProCookie(res, issueProSession(existing.id as string))
    return res
  } catch (err) {
    console.error('[pro/verify-firebase]', err)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
