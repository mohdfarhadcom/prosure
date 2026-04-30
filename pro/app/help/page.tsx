'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/context/I18nContext'
import Navbar from '@/components/Navbar'

const FAQ_KEYS = [
  { q: 'How do I receive orders?', a: 'Go online on the Home screen. Orders within 500 metres of your location will appear automatically. You have 90 seconds to accept.' },
  { q: 'When do I get paid?', a: '80% of the booking amount is added to your wallet. It releases 1 minute after the customer rates you 3 stars or more.' },
  { q: 'Why is my money on hold?', a: 'Funds are held briefly after job completion to protect against disputes. A customer rating of 3+ stars releases it automatically.' },
  { q: 'What if the customer cancels?', a: 'If the customer cancels after you have been assigned, you will receive a partial compensation based on notice period.' },
  { q: 'Home Help is female-only — why?', a: 'Home Help services (cleaning, housekeeping) require entering customers homes. For safety and trust, these slots are reserved for female professionals.' },
  { q: 'How do I get approved?', a: 'After signing up, our team reviews your profile within 24 hours. We may ask for ID proof. You will receive an SMS once approved.' },
  { q: 'How do I withdraw my earnings?', a: 'Go to Wallet, tap Withdraw. Minimum is Rs 100. Amount is credited to your registered bank account within 24 hours.' },
  { q: 'What equipment should I bring?', a: 'Customers provide cleaning supplies. For cooking jobs, the kitchen and utensils are available at the customer location.' },
]

export default function HelpPage() {
  const { t } = useI18n()
  const router = useRouter()
  const [open, setOpen] = useState<string | null>(null)

  return (
    <>
      <main className="page px-4 py-6">
        <header className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <h1 className="font-bold text-xl">{t.help}</h1>
        </header>

        {/* Contact */}
        <div className="bg-[#FFF3DC] rounded-2xl p-4 mb-6">
          <p className="font-semibold text-sm mb-2">{t.contactUs}</p>
          <p className="text-sm text-gray-700">team@getzilpo.com</p>
          <p className="text-sm text-gray-700">+91 98100 40589</p>
          <p className="text-xs text-gray-400 mt-2">Mon – Sat, 9 AM – 7 PM</p>
        </div>

        {/* FAQ */}
        <h2 className="font-semibold text-sm text-gray-400 uppercase tracking-wide mb-3">{t.faq}</h2>
        <div className="flex flex-col gap-2">
          {FAQ_KEYS.map(item => (
            <div key={item.q} className="border border-gray-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpen(open === item.q ? null : item.q)}
                className="w-full flex items-center justify-between px-4 py-4 text-left"
              >
                <span className="text-sm font-medium text-gray-900 pr-2">{item.q}</span>
                <span className={`text-gray-400 flex-shrink-0 text-lg leading-none transition-transform ${open === item.q ? 'rotate-45' : ''}`}>+</span>
              </button>
              {open === item.q && (
                <div className="px-4 pb-4 text-sm text-gray-500 border-t border-gray-50 pt-2">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </main>
      <Navbar />
    </>
  )
}
