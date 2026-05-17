import { NextResponse } from 'next/server'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM = 'Zilpo <team@thezilpo.com>'

export async function POST(req: Request) {
  try {
    const { to, subject, html } = await req.json()
    if (!to || !subject || !html || !RESEND_API_KEY) return NextResponse.json({ ok: false })

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    })
    const data = await res.json()
    return NextResponse.json({ ok: res.ok, id: data.id })
  } catch {
    return NextResponse.json({ ok: false })
  }
}
