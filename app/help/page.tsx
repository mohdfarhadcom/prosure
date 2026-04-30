'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const FAQS = [
  {
    category: 'Booking',
    items: [
      { q: 'Can I book a recurring service?', a: 'Recurring bookings are coming soon. For now, book each session individually.' },
      { q: 'How do I cancel or reschedule?', a: 'Go to Bookings, tap the booking, and select Cancel or Reschedule.' },
      { q: 'How far in advance can I book?', a: 'Up to 14 days ahead. Minimum 1 hour before the slot.' },
    ],
  },
  {
    category: 'Account',
    items: [
      { q: 'How do I log in?', a: 'Enter your mobile number. We send a 6-digit OTP to verify.' },
      { q: 'Can I change my phone number?', a: 'Contact us at team@getzilpo.com with your request.' },
    ],
  },
  {
    category: 'Payments',
    items: [
      { q: 'How are prices calculated?', a: 'Base price is shown. GST at 18% and a service fee of Rs 20 are added at checkout.' },
      { q: 'Will I get a refund if I cancel?', a: 'Full refund if cancelled 3 or more hours before. No refund within 3 hours. Full refund if worker cancels.' },
      { q: 'What payment methods are accepted?', a: 'UPI, debit card, credit card, and net banking via Razorpay.' },
    ],
  },
  {
    category: 'Service quality',
    items: [
      { q: 'Do I need to provide cleaning equipment?', a: 'No. Professionals bring all necessary tools and supplies.' },
      { q: 'What if there is a service issue?', a: 'Contact us immediately at team@getzilpo.com or call +91 98100 40589. We will resolve it.' },
      { q: 'Is there a damage policy?', a: 'Damage cover is capped at Rs 6,000 per booking. Not applicable on promo bookings.' },
    ],
  },
  {
    category: 'Safety',
    items: [
      { q: 'How can I trust your service?', a: 'Every professional undergoes government ID check, police verification, and a skills test.' },
      { q: 'Will the professional have my phone number?', a: 'No. All calls are masked. Your number is never shared.' },
    ],
  },
]

export default function HelpPage() {
  const router = useRouter()
  const [open, setOpen] = useState<string | null>(null)

  return (
    <main className="page px-4 py-6">
      <header className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="font-bold text-xl">Help</h1>
      </header>

      {/* Contact */}
      <div className="bg-[#FFF3DC] rounded-xl p-4 mb-8">
        <p className="font-semibold text-sm mb-1">Contact us</p>
        <p className="text-sm text-gray-700">team@getzilpo.com</p>
        <p className="text-sm text-gray-700">+91 98100 40589</p>
      </div>

      {/* FAQs */}
      {FAQS.map(section => (
        <div key={section.category} className="mb-6">
          <h2 className="font-semibold text-sm text-gray-400 uppercase tracking-wide mb-3">{section.category}</h2>
          <div className="flex flex-col gap-2">
            {section.items.map(item => (
              <div key={item.q} className="border border-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpen(open === item.q ? null : item.q)}
                  className="w-full flex items-center justify-between px-4 py-4 text-left text-sm font-medium"
                >
                  <span>{item.q}</span>
                  <span className="text-gray-400 ml-3 flex-shrink-0">{open === item.q ? '-' : '+'}</span>
                </button>
                {open === item.q && (
                  <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-50">{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </main>
  )
}
