import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function POST(req: Request) {
  try {
    const { professionalId } = await req.json()
    if (!professionalId) return NextResponse.json({ error: 'Missing professionalId' }, { status: 400 })

    const now = new Date().toISOString()
    const { data: ready } = await supabase
      .from('wallet_transactions')
      .select('amount')
      .eq('professional_id', professionalId)
      .eq('status', 'processing')
      .eq('type', 'credit')
      .lte('available_at', now)

    if (!ready || ready.length === 0) return NextResponse.json({ ok: true, released: 0 })

    const releaseAmount = ready.reduce((sum, t) => sum + (t.amount || 0), 0)

    await supabase.from('wallet_transactions')
      .update({ status: 'available' })
      .eq('professional_id', professionalId)
      .eq('status', 'processing')
      .eq('type', 'credit')
      .lte('available_at', now)

    const { data: wallet } = await supabase.from('pro_wallets').select('balance').eq('professional_id', professionalId).single()
    await supabase.from('pro_wallets').update({
      balance: (wallet?.balance || 0) + releaseAmount,
      updated_at: now,
    }).eq('professional_id', professionalId)

    return NextResponse.json({ ok: true, released: releaseAmount })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
