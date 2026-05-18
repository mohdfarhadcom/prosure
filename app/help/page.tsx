'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const FAQS = [
  {
    category: 'Bookings',
    items: [
      { q: 'How do I cancel or reschedule?', a: 'Open the booking from "My bookings" and tap Cancel. Reschedule is not yet available — cancel and book the new slot instead.' },
      { q: 'How far in advance can I book?', a: 'Up to 14 days ahead. For instant bookings, we connect you to a professional in 10–15 minutes.' },
      { q: 'What if no professional accepts my instant booking?', a: 'After 10 minutes you can wait 5 more or cancel for a full refund — you choose from the screen itself.' },
    ],
  },
  {
    category: 'Payments and refunds',
    items: [
      { q: 'How are prices calculated?', a: 'Base price is shown on each service. A ₹20 platform fee is added at checkout. No GST is charged (we are under the GST threshold).' },
      { q: 'Will I get a refund if I cancel?', a: 'Full refund if cancelled before a professional starts. If cancelled mid-service, you may be charged for the time used. Refunds reach your account in 5–7 business days.' },
      { q: 'What payment methods are accepted?', a: 'UPI, debit/credit card, net banking — handled by Razorpay.' },
    ],
  },
  {
    category: 'Service quality',
    items: [
      { q: 'Do I need to provide cleaning equipment?', a: 'Yes — please keep mops, brooms, and basic supplies ready. Your professional uses what you have at home.' },
      { q: 'What if the work is not done well?', a: 'Rate the service 1–3 stars and our support team will reach out within a few hours. Or call +91 90581 72570 directly.' },
      { q: 'Is there a damage policy?', a: 'Up to ₹6,000 per booking is covered. Not applicable on promo bookings.' },
    ],
  },
  {
    category: 'Safety and privacy',
    items: [
      { q: 'Are professionals verified?', a: 'Each professional uploads a government ID (Aadhaar / PAN / Voter / Ration) which our team reviews before they can take bookings.' },
      { q: 'Will the professional get my phone number?', a: 'No. Calls are routed through masked numbers.' },
    ],
  },
  {
    category: 'Account',
    items: [
      { q: 'How do I log in?', a: 'Enter your mobile number and verify the 6-digit OTP. No password needed.' },
      { q: 'Can I delete my account?', a: 'Yes — Profile → Delete account. Past bookings stay on record for receipts and disputes.' },
    ],
  },
]

const CATEGORIES = [
  { value: 'booking_issue', label: 'Booking issue' },
  { value: 'payment_issue', label: 'Payment issue' },
  { value: 'refund_issue', label: 'Refund issue' },
  { value: 'pro_behavior', label: 'Issue with the professional' },
  { value: 'app_bug', label: 'App not working' },
  { value: 'account', label: 'Account / profile' },
  { value: 'other', label: 'Something else' },
]

export default function HelpPage() {
  const router = useRouter()
  const [open, setOpen] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [category, setCategory] = useState('booking_issue')
  const [bookingId, setBookingId] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    setError('')
    if (message.trim().length < 5) { setError('Please describe the issue in a few words.'); return }
    setSubmitting(true)
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category, message: message.trim(),
          bookingId: bookingId.trim() || null,
          phone: phone.replace(/\D/g, '').slice(-10),
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
    <main className="page px-4 py-6 pb-20">
      <header className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} aria-label="Back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="font-bold text-xl">Help and support</h1>
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
              <p className="text-xs text-gray-500">We will reach out within a few hours.</p>
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

              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Booking ID (optional)</label>
              <input
                value={bookingId} onChange={e => setBookingId(e.target.value)}
                placeholder="Paste from My bookings"
                className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-[#F5A623] mb-3"
              />

              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Phone (so we can call back)</label>
              <input
                value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="10-digit mobile"
                maxLength={10} inputMode="numeric"
                className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm outline-none focus:border-[#F5A623] mb-3"
              />

              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Describe the issue</label>
              <textarea
                value={message} onChange={e => setMessage(e.target.value)}
                rows={4} maxLength={2000}
                placeholder="What happened? Be specific so we can help fast."
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

      {FAQS.map(section => (
        <div key={section.category} className="mb-6">
          <h2 className="font-semibold text-xs text-gray-400 uppercase tracking-wide mb-3">{section.category}</h2>
          <div className="flex flex-col gap-2">
            {section.items.map(item => (
              <div key={item.q} className="border border-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpen(open === item.q ? null : item.q)}
                  className="w-full flex items-center justify-between px-4 py-4 text-left text-sm font-medium"
                >
                  <span>{item.q}</span>
                  <span className="text-gray-400 ml-3 flex-shrink-0">{open === item.q ? '−' : '+'}</span>
                </button>
                {open === item.q && (
                  <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-50 leading-relaxed">{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </main>
  )
}
