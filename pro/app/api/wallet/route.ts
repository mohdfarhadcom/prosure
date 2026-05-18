import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requirePro } from '@/lib/proSession'

function getDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase env missing')
  return createClient(url, key, { auth: { persistSession: false } })
}

export async function GET(req: Request) {
  const auth = requirePro(req)
  if (auth instanceof NextResponse) return auth

  const db = getDb()
  const now = new Date().toISOString()

  // Auto-release any held earnings that have matured
  const { data: matured } = await db.from('wallet_transactions')
    .update({ status: 'available', show_received_at: now })
    .eq('professional_id', auth.proId)
    .eq('status', 'processing')
    .eq('type', 'credit')
    .lte('available_at', now)
    .select('amount')
  if (matured && matured.length > 0) {
    const releaseAmount = matured.reduce((s: number, t: { amount: number | null }) => s + (Number(t.amount) || 0), 0)
    const { data: wallet } = await db.from('pro_wallets').select('balance').eq('professional_id', auth.proId).single()
    await db.from('pro_wallets').update({
      balance: Math.round(((Number(wallet?.balance) || 0) + releaseAmount) * 100) / 100,
      updated_at: now,
    }).eq('professional_id', auth.proId)
  }

  const [walletRes, txRes] = await Promise.all([
    db.from('pro_wallets').select('*').eq('professional_id', auth.proId).single(),
    db.from('wallet_transactions').select('*').eq('professional_id', auth.proId).order('created_at', { ascending: false }).limit(30),
  ])

  return NextResponse.json({
    wallet: walletRes.data || { balance: 0, total_earned: 0 },
    transactions: txRes.data || [],
  })
}
