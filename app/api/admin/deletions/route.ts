import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseServer'

const KEY = process.env.ADMIN_KEY || 'zilpo@admin2024'

export async function GET(req: Request) {
  if (req.headers.get('x-admin-key') !== KEY) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getSupabaseAdmin()
  const { data } = await db.from('deletion_requests')
    .select('*, professionals(name, phone, service_type)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
  return NextResponse.json({ requests: data || [] })
}

export async function POST(req: Request) {
  if (req.headers.get('x-admin-key') !== KEY) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, professionalId, action } = await req.json()
  const db = getSupabaseAdmin()
  if (action === 'approve') {
    await db.from('pro_wallets').delete().eq('professional_id', professionalId)
    await db.from('professionals').delete().eq('id', professionalId)
    await db.from('deletion_requests').update({ status: 'approved' }).eq('id', id)
  } else {
    await db.from('deletion_requests').update({ status: 'rejected' }).eq('id', id)
  }
  return NextResponse.json({ ok: true })
}
