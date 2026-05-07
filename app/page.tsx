'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useLocation } from '@/context/LocationContext'
import { useCart } from '@/context/CartContext'
import { SERVICES } from '@/lib/services'
import ServiceCard from '@/components/ServiceCard'
import LocationPrompt from '@/components/LocationPrompt'

const BANNERS = [
  { img: 'https://lh3.googleusercontent.com/d/1YwzOPCvhXzRaYahOBkxhmZjIpVdX2Bql', title: 'Pro at your door in 10 min', sub: 'Book in under 2 minutes' },
  { img: 'https://lh3.googleusercontent.com/d/1LQL6P-QAXrm7xRuRLB5raN3aMmAEREJ8', title: 'Professionals at your door', sub: 'Verified, trained, reliable' },
  { img: 'https://lh3.googleusercontent.com/d/1TMcK1JPJMvHs6E1ErC_ovW2BEaUBUjya', title: 'Every corner, spotless', sub: 'Kitchen to bathroom' },
  { img: 'https://lh3.googleusercontent.com/d/1s6mUyGyoutLE6JGCazbdR48CSq8fwOg9', title: 'Connect in 10–15 minutes', sub: 'Pick a time that works for you' },
]


const FAQS = [
  { q: 'How do I book?', a: 'Add a service, pick a date and time, pay online. Done.' },
  { q: 'Are professionals verified?', a: 'Yes. Government ID check, police verification, and skills test before hiring.' },
  { q: 'What if I cancel?', a: 'Full refund if you cancel 3+ hours before. No refund within 3 hours.' },
  { q: 'Do I need to provide equipment?', a: 'Yes. Keep basic cleaning supplies at home. Your professional will use them.' },
  { q: 'Is there a damage policy?', a: 'Yes. Up to Rs 6,000 cover per booking. Not on promo bookings.' },
  { q: 'How are prices set?', a: 'Base prices shown. A ₹20 service fee is added at checkout. No GST charged — we are below the GST threshold.' },
]

export default function HomePage() {
  const { location, setLocation } = useLocation()
  const { count } = useCart()
  const router = useRouter()
  const [addressText, setAddressText] = useState('Set location')
  const [serviceQ, setServiceQ] = useState('')
  const [openFaq, setOpenFaq] = useState<string | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    if (!location) {
      const timer = setTimeout(() => setShowPrompt(true), 2300)
      return () => clearTimeout(timer)
    } else {
      setAddressText(location.address.split(',').slice(0, 2).join(',').trim())
    }
  }, [location])

  useEffect(() => {
    if (location && showPrompt) setShowPrompt(false)
  }, [location])

  const filteredServices = serviceQ.trim().length > 0
    ? SERVICES.filter(s => s.name.toLowerCase().includes(serviceQ.toLowerCase()) || s.category.toLowerCase().includes(serviceQ.toLowerCase()))
    : SERVICES

  return (
    <>
      {showPrompt && <LocationPrompt />}

      <main className="page">
        {/* ── Header ── */}
        <header className="sticky top-0 bg-white/95 backdrop-blur z-30 border-b border-gray-100">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Address */}
            <button
              onClick={() => router.push('/location')}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-900 max-w-[55%]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span className="truncate text-sm">{addressText}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </button>

            {/* Right: cart + avatar */}
            <div className="flex items-center gap-3">
              <Link href="/cart" className="relative p-2 bg-gray-50 rounded-xl hover:bg-[#FFF3DC] transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6"/>
                </svg>
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#F5A623] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none">
                    {count}
                  </span>
                )}
              </Link>
              <Link href="/profile" className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F5A623] to-[#FF6B35] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                Z
              </Link>
            </div>
          </div>

          {/* Service search */}
          <div className="px-4 pb-3 relative">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 focus-within:border-[#F5A623] transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                value={serviceQ}
                onChange={e => setServiceQ(e.target.value)}
                placeholder="Search services (e.g. bathroom, laundry...)"
                className="flex-1 bg-transparent text-sm outline-none"
              />
              {serviceQ && (
                <button onClick={() => setServiceQ('')} className="text-gray-400">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>
            {serviceQ.trim().length > 0 && filteredServices.length > 0 && (
              <div className="absolute left-4 right-4 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden mt-1">
                {filteredServices.slice(0, 6).map(s => (
                  <Link key={s.slug} href={`/services/${s.slug}`} onClick={() => setServiceQ('')} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2.5" className="flex-shrink-0"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{s.name}</p>
                      <p className="text-xs text-gray-400">Rs {s.base} · {s.duration} min</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* ── Hero Carousel ── */}
        <div className="flex gap-3 overflow-x-auto snap-scroll pb-1 px-4 pt-4 no-scrollbar">
          {BANNERS.map((b, i) => (
            <div key={i} className="flex-shrink-0 w-[85vw] max-w-[380px] relative rounded-2xl overflow-hidden snap-start shadow-md" style={{ height: 180 }}>
              <Image src={b.img} alt={b.title} fill className="object-cover" unoptimized />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="font-bold text-base leading-tight">{b.title}</p>
                <p className="text-xs text-white/80 mt-0.5">{b.sub}</p>
              </div>
            </div>
          ))}
        </div>


        {/* ── Book by hour ── */}
        <div className="px-4 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-base">Book by the hour</h2>
            <span className="text-xs text-[#F5A623] font-semibold bg-[#FFF3DC] px-2 py-0.5 rounded-lg">Up to 50% off</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
            {[{ h: 0.5, price: 49, orig: 125, save: 76 }, { h: 1, price: 99, orig: 250, save: 151 }, { h: 1.5, price: 149, orig: 325, save: 176 }, { h: 2, price: 189, orig: 450, save: 261 }].map(({ h, price, orig, save }) => (
              <Link
                key={h}
                href={`/booking?type=hourly&hours=${h}`}
                className="flex-shrink-0 w-32 bg-white border border-gray-100 rounded-2xl p-3 shadow-sm hover:border-[#F5A623] hover:shadow-md transition-all"
              >
                <div className="font-bold text-sm text-gray-900">{h} hr</div>
                <div className="text-[#F5A623] font-extrabold text-lg mt-0.5">Rs {price}</div>
                <div className="text-xs text-gray-400 line-through">Rs {orig}</div>
                <div className="mt-2 text-[10px] font-bold text-green-600">Save Rs {save}</div>
                <div className="mt-2 w-full py-1.5 text-xs font-bold text-[#F5A623] border border-[#F5A623] rounded-xl text-center">Schedule</div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Schedule CTA ── */}
        <div className="px-4 mt-5">
          <div className="bg-gradient-to-r from-[#F5A623] to-[#FF6B35] rounded-2xl p-4 flex items-center justify-between shadow-md">
            <div className="text-white">
              <p className="font-bold text-base">Schedule a booking</p>
              <p className="text-xs text-white/80 mt-0.5">Pick your slot. We will be there.</p>
            </div>
            <Link href="/booking" className="bg-white text-[#F5A623] font-bold text-sm px-4 py-2 rounded-xl flex-shrink-0">
              Book now
            </Link>
          </div>
        </div>

        {/* ── Services grid ── */}
        <div className="px-4 mt-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-bold text-base">All services</h2>
            <span className="text-xs text-gray-400">{filteredServices.length} services</span>
          </div>
          <p className="text-xs text-gray-400 mb-4">Schedule and book for later</p>
          {filteredServices.length === 0 && (
            <p className="text-sm text-gray-400 py-6 text-center">No services match &ldquo;{serviceQ}&rdquo;</p>
          )}
          <div className="grid grid-cols-3 gap-3">
            {filteredServices.map(s => (
              <ServiceCard key={s.slug} slug={s.slug} name={s.name} base={s.base} original={s.original} img={s.img} isNew={s.isNew} />
            ))}
          </div>
        </div>

        {/* ── Trust section ── */}
        <div className="px-4 mt-8">
          <h2 className="font-bold text-base mb-1">Reliable and trustworthy</h2>
          <p className="text-xs text-gray-400 mb-4">Verified through multiple checks</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { title: 'Verified ID', desc: 'Government document check for every professional.' },
              { title: 'Skills tested', desc: 'Practical test before first booking.' },
              { title: 'Police check', desc: 'Background verification done.' },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-gradient-to-b from-gray-50 to-white rounded-2xl p-3 border border-gray-100 text-center">
                <div className="w-8 h-8 bg-[#FFF3DC] rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-[#F5A623] font-bold text-sm">✓</span>
                </div>
                <div className="font-semibold text-xs">{title}</div>
                <div className="text-[10px] text-gray-400 mt-1 leading-tight">{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="px-4 mt-8">
          <h2 className="font-bold text-base mb-4">Common questions</h2>
          <div className="flex flex-col gap-2">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="border border-gray-100 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === q ? null : q)}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-left"
                >
                  <span className="text-sm font-medium text-gray-900">{q}</span>
                  <span className={`text-gray-400 ml-3 flex-shrink-0 transition-transform text-lg leading-none ${openFaq === q ? 'rotate-45' : ''}`}>+</span>
                </button>
                {openFaq === q && (
                  <div className="px-4 pb-4 text-sm text-gray-500 border-t border-gray-50 pt-2">{a}</div>
                )}
              </div>
            ))}
          </div>
          <Link href="/help" className="block text-center text-[#F5A623] font-semibold text-sm mt-4">
            See all questions
          </Link>
        </div>

        {/* ── Footer ── */}
        <footer className="px-4 mt-10 pb-4 border-t border-gray-100 pt-6">
          <span className="gradient-text font-black text-3xl tracking-tighter">zilpo</span>
          <p className="text-xs text-gray-400 mt-1 mb-4">Trusted by thousands of families across India.</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
            <Link href="/help" className="hover:text-[#F5A623]">Help</Link>
            <Link href="/terms" className="hover:text-[#F5A623]">Terms</Link>
            <Link href="/privacy" className="hover:text-[#F5A623]">Privacy</Link>
            <span>team@getzilpo.com</span>
          </div>
        </footer>
      </main>
    </>
  )
}
