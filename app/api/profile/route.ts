import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseServer'
import { requireUser } from '@/lib/userSession'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function GET(req: Request) {
  const auth = requireUser(req)
  if (auth instanceof NextResponse) return auth
  const db = getSupabaseAdmin()
  const { data: user } = await db.from('users')
    .select('id, phone, name, email, created_at')
    .eq('id', auth.userId).single()
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ user })
}

export async function POST(req: Request) {
  const auth = requireUser(req)
  if (auth instanceof NextResponse) return auth
  const body = await req.json().catch(() => null) as { name?: string; email?: string } | null
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const patch: Record<string, unknown> = {}
  if (body.name !== undefined) {
    const n = String(body.name || '').trim()
    if (n.length > 60) return NextResponse.json({ error: 'Name is too long' }, { status: 400 })
    patch.name = n || null
  }
  if (body.email !== undefined) {
    const e = String(body.email || '').trim()
    if (e && (!EMAIL_RE.test(e) || e.length > 200)) {
      return NextResponse.json({ error: 'Enter a valid email' }, { status: 400 })
    }
    patch.email = e || null
  }
  if (Object.keys(patch).length === 0) return NextResponse.json({ ok: true })

  const db = getSupabaseAdmin()
  const { data, error } = await db.from('users').update(patch).eq('id', auth.userId).select('id, phone, name, email').single()
  if (error || !data) {
    console.error('[profile]', error?.message)
    return NextResponse.json({ error: 'Could not update profile' }, { status: 500 })
  }
  return NextResponse.json({ user: data })
}
