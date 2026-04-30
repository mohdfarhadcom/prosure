'use client'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocation } from '@/context/LocationContext'
import { useCart } from '@/context/CartContext'
import { SERVICES } from '@/lib/services'
import ServiceCard from '@/components/ServiceCard'
import Link from 'next/link'

const MapComponent = dynamic(() => import('@/components/MapComponent'), { ssr: false })

const DEFAULT_CENTER = { lat: 28.6139, lng: 77.2090 }

export default function HomePage() {
  const { location, setLocation } = useLocation()
  const { count } = useCart()
  const router = useRouter()
  const [center, setCenter] = useState(DEFAULT_CENTER)
  const [addressText, setAddressText] = useState('Select location')
  const [searchQ, setSearchQ] = useState('')
  const [suggestions, setSuggestions] = useState<{ display_name: string; lat: string; lon: string }[]>([])

  useEffect(() => {
    if (location) {
      setCenter({ lat: location.lat, lng: location.lng })
      setAddressText(location.address.split(',').slice(0, 2).join(','))
    } else {
      navigator.geolocation?.getCurrentPosition(pos => {
        const { latitude: lat, longitude: lng } = pos.coords
        setCenter({ lat, lng })
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
          .then(r => r.json())
          .then(d => {
            const addr = d.display_name || 'Current location'
            setAddressText(addr.split(',').slice(0, 2).join(','))
            setLocation({ lat, lng, address: addr })
          })
          .catch(() => {})
      })
    }
  }, [])

  const searchAddress = async (q: string) => {
    if (q.length < 3) { setSuggestions([]); return }
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5`)
    const data = await res.json()
    setSuggestions(data)
  }

  const selectSuggestion = (s: { display_name: string; lat: string; lon: string }) => {
    const lat = parseFloat(s.lat)
    const lng = parseFloat(s.lon)
    setCenter({ lat, lng })
    setAddressText(s.display_name.split(',').slice(0, 2).join(','))
    setLocation({ lat, lng, address: s.display_name })
    setSuggestions([])
    setSearchQ('')
  }

  return (
    <main className="page">
      {/* Header */}
      <header className="sticky top-0 bg-white z-30 border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.push('/location')}
            className="flex items-center gap-1 text-sm font-medium text-gray-900 max-w-[60%] truncate"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span className="truncate">{addressText}</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div className="flex items-center gap-3">
            <Link href="/cart" className="relative text-sm font-semibold text-[#F5A623]">
              Cart
              {count > 0 && (
                <span className="absolute -top-2 -right-3 bg-[#F5A623] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
            <Link href="/profile" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700">
              P
            </Link>
          </div>
        </div>

        {/* Search bar */}
        <div className="px-4 pb-3 relative">
          <input
            value={searchQ}
            onChange={e => { setSearchQ(e.target.value); searchAddress(e.target.value) }}
            placeholder="Search location..."
            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#F5A623]"
          />
          {suggestions.length > 0 && (
            <div className="absolute left-4 right-4 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => selectSuggestion(s)}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 border-b border-gray-50 last:border-0 truncate"
                >
                  {s.display_name}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Map */}
      <div className="w-full">
        <MapComponent center={center} showWorkers height="220px" />
      </div>

      {/* Booking tabs */}
      <div className="px-4 mt-4">
        <p className="text-xs text-gray-500 mb-2">Schedule and book for later</p>
        <div className="flex gap-3">
          <Link href="/booking?type=schedule" className="flex-1 border-2 border-[#F5A623] rounded-xl p-3 flex flex-col gap-1">
            <span className="text-xs bg-[#F5A623] text-white px-1.5 py-0.5 rounded w-fit">Up to 50% off</span>
            <span className="font-semibold text-sm">Schedule Booking</span>
          </Link>
          <div className="flex-1 border border-gray-100 rounded-xl p-3 flex flex-col gap-1 bg-gray-50 opacity-60">
            <span className="text-xs text-gray-400">Unavailable</span>
            <span className="font-semibold text-sm text-gray-400">Recurring Booking</span>
          </div>
        </div>
      </div>

      {/* Hourly pricing */}
      <div className="px-4 mt-6">
        <h2 className="font-semibold text-base mb-3">Book by the hour</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
          {[{ h: 0.5, price: 49, orig: 125 }, { h: 1, price: 99, orig: 250 }, { h: 1.5, price: 149, orig: 375 }, { h: 2, price: 189, orig: 450 }].map(({ h, price, orig }) => (
            <Link
              key={h}
              href={`/booking?type=hourly&hours=${h}`}
              className="flex-shrink-0 w-28 border border-gray-100 rounded-xl p-3 text-center hover:border-[#F5A623] transition-colors"
            >
              <div className="font-bold text-sm">{h} hr</div>
              <div className="text-[#F5A623] font-bold text-base">Rs {price}</div>
              <div className="text-xs text-gray-400 line-through">Rs {orig}</div>
              <div className="mt-2 text-xs font-semibold text-[#F5A623] border border-[#F5A623] rounded-lg py-1">Schedule</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Services grid */}
      <div className="px-4 mt-6">
        <h2 className="font-semibold text-base mb-1">All house help services</h2>
        <p className="text-xs text-gray-500 mb-4">Schedule and book for later</p>
        <div className="grid grid-cols-3 gap-3">
          {SERVICES.map(s => (
            <ServiceCard key={s.slug} slug={s.slug} name={s.name} base={s.base} original={s.original} />
          ))}
        </div>
      </div>

      {/* Trustworthy section */}
      <div className="px-4 mt-8">
        <h2 className="font-semibold text-base">Reliable and trustworthy</h2>
        <p className="text-xs text-gray-500 mb-4">Verified through multiple checks</p>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { title: 'Verified', desc: 'Government ID checked' },
            { title: 'Trained', desc: 'Skills tested before hire' },
            { title: 'Safe', desc: 'Police verification done' },
          ].map(({ title, desc }) => (
            <div key={title} className="bg-gray-50 rounded-xl p-3">
              <div className="font-semibold text-sm">{title}</div>
              <div className="text-xs text-gray-500 mt-1">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="px-4 mt-10 pb-4 border-t border-gray-100 pt-6">
        <div className="text-2xl font-extrabold text-[#F5A623] mb-1">Zilpo</div>
        <p className="text-xs text-gray-500 mb-3">Trusted by thousands of families.</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          <Link href="/help" className="hover:text-[#F5A623]">Help</Link>
          <Link href="/terms" className="hover:text-[#F5A623]">Terms</Link>
          <Link href="/privacy" className="hover:text-[#F5A623]">Privacy</Link>
          <span>team@getzilpo.com</span>
        </div>
      </footer>
    </main>
  )
}
