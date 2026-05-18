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

  const db = getDb()
  const now = new Date().toISOString()

  // Move ready rows to "available" first; the RETURNING set is the only source of truth.
  const { data: moved } = await db
    .from('wallet_transactions')
    .update({ status: 'available', show_received_at: now })
    .eq('professional_id', auth.proId)
    .eq('status', 'processing')
    .eq('type', 'credit')
    .lte('available_at', now)
    .select('id, amount')

  if (!moved || moved.length === 0) return NextResponse.json({ ok: true, released: 0 })

  const released = moved.reduce((s: number, t: { amount: number | null }) => s + (Number(t.amount) || 0), 0)
  const { data: wallet } = await db.from('pro_wallets').select('balance').eq('professional_id', auth.proId).single()
  await db.from('pro_wallets').update({
    balance: Math.round(((Number(wallet?.balance) || 0) + released) * 100) / 100,
    updated_at: now,
  }).eq('professional_id', auth.proId)

  return NextResponse.json({ ok: true, released })
}
