import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function POST(req: Request) {
  try {
    const { bookingId, professionalId } = await req.json()
    if (!bookingId || !professionalId) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    // Get booking
    const { data: booking } = await supabase.from('bookings').select('*, users(email, name)').eq('id', bookingId).single()
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })

    const proEarning = Math.round((booking.amount || 0) * 0.8)

    // Mark completed
    await supabase.from('bookings').update({ status: 'completed' }).eq('id', bookingId)

    // Credit wallet
    const { data: wallet } = await supabase.from('pro_wallets').select('*').eq('professional_id', professionalId).single()
    if (wallet) {
      await supabase.from('pro_wallets').update({
        balance: (wallet.balance || 0) + proEarning,
        total_earned: (wallet.total_earned || 0) + proEarning,
        updated_at: new Date().toISOString(),
      }).eq('professional_id', professionalId)
    }

    // Create wallet transaction
    await supabase.from('wallet_transactions').insert({
      professional_id: professionalId,
      booking_id: bookingId,
      amount: proEarning,
      type: 'credit',
      status: 'completed',
    })

    // Send rating email to customer
    const userEmail = (booking as { users?: { email?: string } }).users?.email
    const userName = (booking as { users?: { name?: string } }).users?.name || 'there'
    if (userEmail) {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://thezilpo.com'}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: userEmail,
          subject: 'How was your Zilpo experience?',
          html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
            <h2 style="color:#F5A623">Hi ${userName}! 🌟</h2>
            <p>Your booking was completed. We hope you had a great experience!</p>
            <p style="margin:24px 0">
              <a href="https://thezilpo.com/booking/${bookingId}" style="background:#F5A623;color:white;padding:12px 24px;border-radius:12px;text-decoration:none;font-weight:bold">Rate your experience</a>
            </p>
            <p style="color:#999;font-size:12px">Thank you for choosing Zilpo · team@thezilpo.com</p>
          </div>`,
        }),
      }).catch(() => {})
    }

    return NextResponse.json({ ok: true, proEarning })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
