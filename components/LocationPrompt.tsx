'use client'
import { useRouter } from 'next/navigation'
import { useLocation } from '@/context/LocationContext'
import { reverseGeocode } from '@/lib/googleMaps'
import { useState } from 'react'

export default function LocationPrompt() {
  const { setLocation } = useLocation()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const autoDetect = () => {
    if (!navigator.geolocation) { setError('Location not supported on this browser.'); return }
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        const address = await reverseGeocode(lat, lng)
        setLocation({ lat, lng, address })
        setLoading(false)
      },
      () => { setError('Location access denied. Search manually.'); setLoading(false) },
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* City skyline illustration */}
      <div className="relative flex-1 bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f3460] overflow-hidden flex flex-col justify-end">
        {/* Stars */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{ top: `${Math.random() * 50}%`, left: `${Math.random() * 100}%`, transform: 'none' }}
          />
        ))}
        {/* Moon */}
        <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-yellow-100 opacity-80 shadow-[0_0_30px_10px_rgba(245,166,35,0.3)]" />

        {/* 3D Buildings SVG */}
        <svg viewBox="0 0 480 280" className="w-full" preserveAspectRatio="xMidYMax meet">
          {/* Background buildings */}
          <rect x="10" y="120" width="50" height="160" fill="#1e3a5f" rx="2" />
          <rect x="12" y="125" width="8" height="10" fill="#3b82f6" opacity="0.4" />
          <rect x="12" y="142" width="8" height="10" fill="#3b82f6" opacity="0.6" />
          <rect x="25" y="125" width="8" height="10" fill="#3b82f6" opacity="0.3" />
          <rect x="25" y="142" width="8" height="10" fill="#f5a623" opacity="0.7" />

          <rect x="55" y="80" width="40" height="200" fill="#162d4a" rx="2" />
          <rect x="58" y="88" width="7" height="9" fill="#f5a623" opacity="0.8" />
          <rect x="70" y="88" width="7" height="9" fill="#3b82f6" opacity="0.4" />
          <rect x="58" y="105" width="7" height="9" fill="#3b82f6" opacity="0.5" />
          <rect x="70" y="105" width="7" height="9" fill="#f5a623" opacity="0.6" />
          <rect x="58" y="122" width="7" height="9" fill="#3b82f6" opacity="0.3" />
          <rect x="58" y="139" width="7" height="9" fill="#f5a623" opacity="0.9" />

          {/* Antenna on tall building */}
          <line x1="75" y1="80" x2="75" y2="60" stroke="#f5a623" strokeWidth="1.5" />
          <circle cx="75" cy="59" r="2" fill="#f5a623" opacity="0.8" />

          <rect x="100" y="140" width="35" height="140" fill="#1e3a5f" rx="2" />
          <rect x="103" y="148" width="6" height="8" fill="#3b82f6" opacity="0.5" />
          <rect x="113" y="148" width="6" height="8" fill="#f5a623" opacity="0.7" />

          <rect x="140" y="60" width="55" height="220" fill="#0f2540" rx="2" />
          <rect x="145" y="70" width="8" height="10" fill="#f5a623" opacity="0.9" />
          <rect x="158" y="70" width="8" height="10" fill="#3b82f6" opacity="0.5" />
          <rect x="170" y="70" width="8" height="10" fill="#3b82f6" opacity="0.4" />
          <rect x="145" y="88" width="8" height="10" fill="#3b82f6" opacity="0.3" />
          <rect x="158" y="88" width="8" height="10" fill="#f5a623" opacity="0.8" />
          <rect x="145" y="106" width="8" height="10" fill="#f5a623" opacity="0.6" />
          <rect x="170" y="88" width="8" height="10" fill="#3b82f6" opacity="0.6" />
          <rect x="145" y="124" width="8" height="10" fill="#3b82f6" opacity="0.5" />
          <rect x="158" y="124" width="8" height="10" fill="#f5a623" opacity="0.7" />

          <rect x="200" y="100" width="45" height="180" fill="#162d4a" rx="2" />
          <rect x="205" y="110" width="7" height="9" fill="#f5a623" opacity="0.8" />
          <rect x="216" y="110" width="7" height="9" fill="#3b82f6" opacity="0.5" />
          <rect x="205" y="127" width="7" height="9" fill="#3b82f6" opacity="0.4" />
          <rect x="216" y="127" width="7" height="9" fill="#f5a623" opacity="0.6" />

          <rect x="250" y="50" width="60" height="230" fill="#0d2035" rx="2" />
          <rect x="255" y="60" width="9" height="11" fill="#f5a623" opacity="0.9" />
          <rect x="268" y="60" width="9" height="11" fill="#3b82f6" opacity="0.6" />
          <rect x="281" y="60" width="9" height="11" fill="#3b82f6" opacity="0.4" />
          <rect x="255" y="79" width="9" height="11" fill="#3b82f6" opacity="0.5" />
          <rect x="268" y="79" width="9" height="11" fill="#f5a623" opacity="0.7" />
          <rect x="281" y="79" width="9" height="11" fill="#f5a623" opacity="0.5" />
          <rect x="255" y="98" width="9" height="11" fill="#f5a623" opacity="0.8" />
          <rect x="268" y="98" width="9" height="11" fill="#3b82f6" opacity="0.4" />
          <line x1="280" y1="50" x2="280" y2="28" stroke="#3b82f6" strokeWidth="1.5" />
          <circle cx="280" cy="27" r="2.5" fill="#3b82f6" />

          <rect x="315" y="90" width="40" height="190" fill="#1a3050" rx="2" />
          <rect x="320" y="100" width="7" height="9" fill="#f5a623" opacity="0.7" />
          <rect x="331" y="100" width="7" height="9" fill="#3b82f6" opacity="0.5" />
          <rect x="320" y="117" width="7" height="9" fill="#3b82f6" opacity="0.6" />
          <rect x="331" y="117" width="7" height="9" fill="#f5a623" opacity="0.8" />

          <rect x="360" y="110" width="50" height="170" fill="#162d4a" rx="2" />
          <rect x="365" y="120" width="8" height="10" fill="#f5a623" opacity="0.9" />
          <rect x="377" y="120" width="8" height="10" fill="#3b82f6" opacity="0.4" />
          <rect x="365" y="138" width="8" height="10" fill="#3b82f6" opacity="0.5" />
          <rect x="377" y="138" width="8" height="10" fill="#f5a623" opacity="0.6" />

          <rect x="415" y="70" width="65" height="210" fill="#0f2540" rx="2" />
          <rect x="420" y="80" width="9" height="11" fill="#f5a623" opacity="0.8" />
          <rect x="433" y="80" width="9" height="11" fill="#3b82f6" opacity="0.5" />
          <rect x="446" y="80" width="9" height="11" fill="#3b82f6" opacity="0.4" />
          <rect x="420" y="99" width="9" height="11" fill="#3b82f6" opacity="0.6" />
          <rect x="433" y="99" width="9" height="11" fill="#f5a623" opacity="0.7" />

          {/* Ground */}
          <rect x="0" y="275" width="480" height="10" fill="#0a1628" />
          {/* Reflection glow on ground */}
          <rect x="0" y="270" width="480" height="8" fill="url(#glow)" opacity="0.3" />
          <defs>
            <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f5a623" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>

        {/* Overlay text */}
        <div className="absolute bottom-6 left-0 right-0 text-center px-6">
          <p className="text-white font-extrabold text-2xl tracking-tight">Where are you?</p>
          <p className="text-white/60 text-sm mt-1">Set your location to find nearby professionals</p>
        </div>
      </div>

      {/* Bottom panel */}
      <div className="bg-white px-6 py-8 flex flex-col gap-4 rounded-t-3xl -mt-4 relative z-10 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
        <button
          onClick={autoDetect}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-[#F5A623] text-white font-bold py-4 rounded-2xl text-base disabled:opacity-60 shadow-[0_4px_20px_rgba(245,166,35,0.35)]"
        >
          {loading ? (
            <span>Detecting...</span>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>
              Use my current location
            </>
          )}
        </button>

        <button
          onClick={() => router.push('/location')}
          className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 text-gray-700 font-semibold py-4 rounded-2xl text-base hover:border-[#F5A623] transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          Search for location
        </button>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <p className="text-xs text-gray-400 text-center">Your location is only used to find nearby help</p>
      </div>
    </div>
  )
}
