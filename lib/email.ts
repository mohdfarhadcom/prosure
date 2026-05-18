const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM = 'Zilpo <team@thezilpo.com>'

export function escapeHtml(s: string | null | undefined): string {
  if (s == null) return ''
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!RESEND_API_KEY) return { ok: false, skipped: true }
  if (!to || !subject || !html) return { ok: false, error: 'missing' }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    })
    const data = await res.json().catch(() => ({}))
    return { ok: res.ok, id: data?.id }
  } catch {
    return { ok: false }
  }
}
