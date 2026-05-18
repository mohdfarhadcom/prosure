import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requirePro } from '@/lib/proSession'

function getDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase env missing')
  return createClient(url, key, { auth: { persistSession: false } })
}

const MIN_WITHDRAWAL = 100
const MAX_WITHDRAWAL = 100000
const UPI_RE = /^[\w.\-]{2,40}@[a-z]{2,30}$/i

async function releaseHeldEarnings(db: ReturnType<typeof getDb>, proId: string): Promise<number> {
  const now = new Date().toISOString()
  const { data: ready } = await db
    .from('wallet_transactions')
    .select('amount')
    .eq('professional_id', proId)
    .eq('status', 'processing')
    .eq('type', 'credit')
    .lte('available_at', now)
  if (!ready || ready.length === 0) return 0

  const releaseAmount = ready.reduce((s: number, t: { amount: number | null }) => s + (Number(t.amount) || 0), 0)

  // Move all matching rows to "available"; report how many actually transitioned
  const { data: moved } = await db
    .from('wallet_transactions')
    .update({ status: 'available', show_received_at: now })
    .eq('professional_id', proId)
    .eq('status', 'processing')
    .eq('type', 'credit')
    .lte('available_at', now)
    .select('id, amount')

  if (!moved || moved.length === 0) return 0
  const actualReleased = moved.reduce((s: number, t: { amount: number | null }) => s + (Number(t.amount) || 0), 0)

  const { data: wallet } = await db.from('pro_wallets').select('balance').eq('professional_id', proId).single()
  await db.from('pro_wallets').update({
    balance: Math.round(((Number(wallet?.balance) || 0) + actualReleased) * 100) / 100,
    updated_at: now,
  }).eq('professional_id', proId)

  return actualReleased
}

export async function POST(req: Request) {
  const auth = requirePro(req)
  if (auth instanceof NextResponse) return auth

  const body = await req.json().catch(() => null) as { amount?: number; upiId?: string } | null
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const amount = Math.floor(Number(body.amount))
  if (!Number.isFinite(amount) || amount < MIN_WITHDRAWAL) {
    return NextResponse.json({ error: `Minimum withdrawal is &#8377;${MIN_WITHDRAWAL}` }, { status: 400 })
  }
  if (amount > MAX_WITHDRAWAL) {
    return NextResponse.json({ error: 'Amount too high — contact support' }, { status: 400 })
  }
  const upiId = typeof body.upiId === 'string' ? body.upiId.trim() : ''
  if (!UPI_RE.test(upiId)) {
    return NextResponse.json({ error: 'Enter a valid UPI ID (e.g. name@upi)' }, { status: 400 })
  }

  const db = getDb()

  // Block when there is already a pending request — prevents double-spend race
  const { data: pending } = await db.from('withdrawal_requests')
    .select('id').eq('professional_id', auth.proId).eq('status', 'pending').limit(1).maybeSingle()
  if (pending) {
    return NextResponse.json({ error: 'You already have a pending withdrawal. Please wait.' }, { status: 409 })
  }

  await releaseHeldEarnings(db, auth.proId)

  // Conditional decrement — only succeeds if balance is sufficient.
  const { data: wallet } = await db.from('pro_wallets')
    .select('balance').eq('professional_id', auth.proId).single()
  const available = Number(wallet?.balance) || 0
  if (amount > available) {
    return NextResponse.json({ error: `Only &#8377;${Math.floor(available)} is available` }, { status: 400 })
  }
  const { data: deducted } = await db.from('pro_wallets')
    .update({ balance: available - amount, updated_at: new Date().toISOString() })
    .eq('professional_id', auth.proId)
    .gte('balance', amount)
    .select('balance')
  if (!deducted || deducted.length === 0) {
    return NextResponse.json({ error: 'Withdrawal failed — please try again' }, { status: 409 })
  }

  const { error: reqErr } = await db.from('withdrawal_requests').insert({
    professional_id: auth.proId,
    amount,
    upi_id: upiId,
    status: 'pending',
  })
  if (reqErr) {
    // Refund the wallet on insert failure
    await db.from('pro_wallets').update({ balance: available, updated_at: new Date().toISOString() })
      .eq('professional_id', auth.proId)
    return NextResponse.json({ error: 'Could not create request' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
