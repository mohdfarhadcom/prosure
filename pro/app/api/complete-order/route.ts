import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requirePro } from '@/lib/proSession'

function getDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase env missing')
  return createClient(url, key, { auth: { persistSession: false } })
}

function escapeHtml(s: string | null | undefined): string {
  if (s == null) return ''
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

async function sendEmail(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY
  if (!key || !to) return
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: 'Zilpo <team@thezilpo.com>', to, subject, html }),
    })
  } catch {}
}

export async function POST(req: Request) {
  const auth = requirePro(req)
  if (auth instanceof NextResponse) return auth

  const body = await req.json().catch(() => null) as { bookingId?: string } | null
  if (!body?.bookingId) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const db = getDb()
  const { data: booking } = await db.from('bookings')
    .select('id, status, amount, professional_id, users(email, name)')
    .eq('id', body.bookingId).single()
  if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  if (booking.professional_id !== auth.proId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  if (booking.status === 'completed') {
    return NextResponse.json({ ok: true, alreadyCompleted: true })
  }
  if (booking.status !== 'in progress') {
    return NextResponse.json({ error: `Cannot complete a ${booking.status} booking` }, { status: 409 })
  }

  // Atomic status flip — only completes if still in progress.
  const { data: updated } = await db.from('bookings')
    .update({ status: 'completed', service_completed_at: new Date().toISOString() })
    .eq('id', booking.id)
    .eq('status', 'in progress')
    .eq('professional_id', auth.proId)
    .select('id')
  if (!updated || updated.length === 0) {
    return NextResponse.json({ error: 'Could not complete booking' }, { status: 409 })
  }

  const proEarning = Math.round((Number(booking.amount) || 0) * 0.8)

  if (proEarning > 0) {
    const availableAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

    // wallet_transactions.booking_id is UNIQUE, so this insert is idempotent.
    const { error: insErr } = await db.from('wallet_transactions').insert({
      professional_id: auth.proId,
      booking_id: booking.id,
      amount: proEarning,
      type: 'credit',
      status: 'processing',
      available_at: availableAt,
    })
    if (insErr && !String(insErr.message).includes('duplicate')) {
      console.error('[complete-order] wallet insert failed:', insErr.message)
    } else if (!insErr) {
      // First-time credit — update total_earned. balance unchanged until 7-day release.
      const { data: wallet } = await db.from('pro_wallets').select('total_earned').eq('professional_id', auth.proId).single()
      await db.from('pro_wallets').update({
        total_earned: (Number(wallet?.total_earned) || 0) + proEarning,
        updated_at: new Date().toISOString(),
      }).eq('professional_id', auth.proId)
    }
  }

  const userInfo = (booking as { users?: { email?: string; name?: string } }).users
  if (userInfo?.email) {
    const name = escapeHtml(userInfo.name || 'there')
    await sendEmail(
      userInfo.email,
      'How was your Zilpo service?',
      `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="color:#F5A623;margin:0 0 8px">Hi ${name}, your service is done.</h2>
        <p style="color:#374151">Thanks for choosing Zilpo. Could you take a moment to rate your professional?</p>
        <p style="margin:24px 0">
          <a href="https://thezilpo.com/booking/${escapeHtml(booking.id)}" style="background:#F5A623;color:white;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:600">Rate your service</a>
        </p>
        <p style="color:#9CA3AF;font-size:12px;margin-top:32px">Zilpo &middot; team@thezilpo.com &middot; +91 9058172570</p>
      </div>`
    )
  }

  return NextResponse.json({ ok: true, proEarning })
}
