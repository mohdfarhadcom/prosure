'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/context/I18nContext'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'

const FAQS = [
  { q: 'How do I get orders?', a: 'Tap "Go online" on the home screen. Bookings within 1 km of your location will pop up automatically. You have 90 seconds to accept each one.' },
  { q: 'When do I get paid?', a: 'You earn 80% of every booking. The amount goes into a 7-day hold and then moves to your wallet balance — ready to withdraw.' },
  { q: 'Why is my money on hold?', a: 'A 7-day hold protects against customer disputes and refunds. After 7 days, the amount moves to your withdrawable balance automatically.' },
  { q: 'How do I withdraw earnings?', a: 'Open Wallet, tap Withdraw, enter your UPI ID. Minimum is ₹100. Money is sent within 24 hours of approval.' },
  { q: 'What if a customer cancels?', a: 'If they cancel before you accept, no impact. If they cancel after, support will review the situation and credit you fairly.' },
  { q: 'Why is Home Help female-only?', a: 'Home help work involves entering customer homes. For safety on both sides, those bookings only go to female professionals.' },
  { q: 'How long does approval take?', a: 'After signup, our team reviews your ID within 24 hours on weekdays. You can use the app as soon as we approve.' },
  { q: 'What equipment should I bring?', a: 'Customers keep their own cleaning supplies. For cooking, the kitchen is theirs. Bring your phone, well-charged.' },
]

const CATEGORIES = [
  { value: 'payment_issue', label: 'Money / wallet issue' },
  { value: 'booking_issue', label: 'Booking problem' },
  { value: 'account', label: 'Approval / account' },
  { value: 'app_bug', label: 'App not working' },
  { value: 'other', label: 'Something else' },
]

export default function HelpPage() {
  const { t } = useI18n()
  const { pro } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [category, setCategory] = useState('payment_issue')
  const [bookingId, setBookingId] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    setError('')
    if (message.trim().length < 5) { setError('Tell us a bit more about the issue.'); return }
    setSubmitting(true)
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          message: message.trim(),
          bookingId: bookingId.trim() || null,
          phone: pro?.phone || '',
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || 'Could not send. Try again.')
      } else {
        setSubmitted(true)
        setMessage(''); setBookingId('')
      }
    } catch {
      setError('Network error')
    }
    setSubmitting(false)
  }

  return (
    <>
      <main className="page px-4 py-6 pb-24">
        <header className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} aria-label="Back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h1 className="font-bold text-xl">{t.help}</h1>
        </header>

        <div className="bg-[#FFF3DC] rounded-2xl p-4 mb-6">
          <p className="font-semibold text-sm mb-2">Talk to us directly</p>
          <a href="tel:+919058172570" className="block text-sm text-gray-800 mb-1">📞 +91 90581 72570</a>
          <a href="mailto:team@thezilpo.com" className="block text-sm text-gray-800">✉ team@thezilpo.com</a>
          <p className="text-xs text-gray-500 mt-2">Mon–Sun, 8 AM – 10 PM IST</p>
        </div>

        <button
          onClick={() => { setShowForm(s => !s); setSubmitted(false) }}
          className="w-full mb-6 bg-[#F5A623] text-white font-semibold py-3.5 rounded-2xl"
        >
          {showForm ? 'Hide report form' : 'Report an issue'}
        </button>

        {showForm && (
          <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-8 shadow-sm">
            {submitted ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <p className="font-semibold text-sm text-gray-900 mb-1">Got it.</p>
                <p className="text-xs text-gray-500">Our team will reach out within a few hours.</p>
                <button onClick={() => setSubmitted(false)} className="mt-4 text-xs text-[#F5A623] font-semibold">Send another</button>
              </div>
            ) : (
              <>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">What is this about?</label>
                <select
                  value={category} onChange={e => setCategory(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-[#F5A623] mb-3 bg-white"
                >
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>

                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Order ID (optional)</label>
                <input
                  value={bookingId} onChange={e => setBookingId(e.target.value)}
                  placeholder="Copy from Orders"
                  className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-[#F5A623] mb-3"
                />

                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Describe the issue</label>
                <textarea
                  value={message} onChange={e => setMessage(e.target.value)}
                  rows={4} maxLength={2000}
                  placeholder="Tell us what happened."
                  className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-[#F5A623] mb-3 resize-none"
                />

                {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

                <button
                  onClick={submit} disabled={submitting || !message.trim()}
                  className="w-full bg-[#F5A623] text-white font-semibold py-3 rounded-xl disabled:opacity-50"
                >
                  {submitting ? 'Sending…' : 'Send to support'}
                </button>
              </>
            )}
          </div>
        )}

        <h2 className="font-semibold text-xs text-gray-400 uppercase tracking-wide mb-3">{t.faq}</h2>
        <div className="flex flex-col gap-2">
          {FAQS.map(item => (
            <div key={item.q} className="border border-gray-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpen(open === item.q ? null : item.q)}
                className="w-full flex items-center justify-between px-4 py-4 text-left"
              >
                <span className="text-sm font-medium text-gray-900 pr-2">{item.q}</span>
                <span className={`text-gray-400 flex-shrink-0 text-lg leading-none transition-transform ${open === item.q ? 'rotate-45' : ''}`}>+</span>
              </button>
              {open === item.q && (
                <div className="px-4 pb-4 text-sm text-gray-500 border-t border-gray-50 pt-2 leading-relaxed">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </main>
      <Navbar />
    </>
  )
}
