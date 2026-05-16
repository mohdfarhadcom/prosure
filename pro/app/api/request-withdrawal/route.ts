import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function POST(req: Request) {
  try {
    const { professionalId, amount, upiId } = await req.json()
    if (!professionalId || !amount || !upiId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Release any transactions that are now past the 7-day hold
    const now = new Date().toISOString()
    const { data: ready } = await supabase
      .from('wallet_transactions')
      .select('amount')
      .eq('professional_id', professionalId)
      .eq('status', 'processing')
      .lte('available_at', now)

    if (ready && ready.length > 0) {
      const releaseAmount = ready.reduce((sum, t) => sum + (t.amount || 0), 0)
      await supabase.from('wallet_transactions')
        .update({ status: 'available' })
        .eq('professional_id', professionalId)
        .eq('status', 'processing')
        .lte('available_at', now)

      const { data: wallet } = await supabase.from('pro_wallets').select('balance').eq('professional_id', professionalId).single()
      await supabase.from('pro_wallets').update({
        balance: (wallet?.balance || 0) + releaseAmount,
        updated_at: now,
      }).eq('professional_id', professionalId)
    }

    // Re-fetch updated wallet balance
    const { data: wallet } = await supabase.from('pro_wallets').select('balance').eq('professional_id', professionalId).single()
    const available = wallet?.balance || 0
    if (amount > available) {
      return NextResponse.json({ error: `Only ₹${Math.round(available)} is available for withdrawal` }, { status: 400 })
    }

    // Deduct from balance and record request
    await supabase.from('pro_wallets').update({
      balance: available - amount,
      updated_at: now,
    }).eq('professional_id', professionalId)

    await supabase.from('withdrawal_requests').insert({
      professional_id: professionalId,
      amount,
      upi_id: upiId,
      status: 'pending',
    })

    await supabase.from('wallet_transactions').insert({
      professional_id: professionalId,
      amount,
      type: 'withdrawal',
      status: 'processing',
      available_at: now,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
