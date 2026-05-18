import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requirePro } from '@/lib/proSession'

function getDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase env missing')
  return createClient(url, key, { auth: { persistSession: false } })
}

export async function POST(req: Request) {
  const auth = requirePro(req)
  if (auth instanceof NextResponse) return auth

  const body = await req.json().catch(() => null) as { reason?: string } | null
  const reason = typeof body?.reason === 'string' ? body.reason.slice(0, 500) : 'No reason provided'

  const db = getDb()
  const { data: existing } = await db.from('deletion_requests')
    .select('id').eq('professional_id', auth.proId).eq('status', 'pending').limit(1).maybeSingle()
  if (existing) {
    return NextResponse.json({ ok: true, alreadyPending: true })
  }

  const { error } = await db.from('deletion_requests').insert({
    professional_id: auth.proId,
    reason,
    status: 'pending',
  })
  if (error) {
    console.error('[request-deletion]', error.message)
    return NextResponse.json({ error: 'Could not submit request' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
