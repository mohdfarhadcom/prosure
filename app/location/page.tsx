'use client'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocation } from '@/context/LocationContext'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'
import { reverseGeocode, cleanAddress } from '@/lib/googleMaps'

const MapComponent = dynamic(() => import('@/components/MapComponent'), { ssr: false })
const DEFAULT = { lat: 28.6139, lng: 77.2090 }

type Suggestion = { display_name: string; lat: string; lon: string }

export default function LocationPage() {
  const router = useRouter()
  const { location, setLocation } = useLocation()
  const { user } = useAuth()
  const [center, setCenter] = useState(location ? { lat: location.lat, lng: location.lng } : DEFAULT)
  const [address, setAddress] = useState(location?.address || '')
  const [searchQ, setSearchQ] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [label, setLabel] = useState('Home')
  const [saving, setSaving] = useState(false)
  const [detecting, setDetecting] = useState(false)

  useEffect(() => {
    if (!location) autoDetect()
  }, [])

  const autoDetect = () => {
    if (!navigator.geolocation) return
    setDetecting(true)
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        setCenter({ lat, lng })
        const addr = await reverseGeocode(lat, lng)
        setAddress(addr)
        setDetecting(false)
      },
      () => setDetecting(false),
    )
  }

  const search = async (q: string) => {
    if (q.length < 3) { setSuggestions([]); return }
    // Google Maps Geocoding first
    try {
      const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(q)}&key=${key}`)
      const data = await res.json()
      if (data.status === 'OK' && data.results?.length) {
        setSuggestions(data.results.slice(0, 5).map((r: { formatted_address: string; geometry: { location: { lat: number; lng: number } } }) => ({
          display_name: r.formatted_address,
          lat: String(r.geometry.location.lat),
          lon: String(r.geometry.location.lng),
        })))
        return
      }
    } catch {}
    // Fallback Nominatim — clean Hindi/Urdu from display names
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5`)
      const raw = await res.json()
      setSuggestions(raw.map((r: Suggestion) => ({ ...r, display_name: cleanAddress(r.display_name) })))
    } catch {}
  }

  const pick = (s: Suggestion) => {
    const lat = parseFloat(s.lat)
    const lng = parseFloat(s.lon)
    setCenter({ lat, lng })
    setAddress(s.display_name)
    setSuggestions([])
    setSearchQ('')
  }

  const handleDrag = async (lat: number, lng: number) => {
    setCenter({ lat, lng })
    const addr = await reverseGeocode(lat, lng)
    setAddress(addr)
  }

  const save = async () => {
    setSaving(true)
    setLocation({ lat: center.lat, lng: center.lng, address })
    if (user) {
      await supabase.from('addresses').insert({
        user_id: user.id, label, lat: center.lat, lng: center.lng, full_address: address,
      })
    }
    setSaving(false)
    router.back()
  }

  return (
    <main className="page">
      <header className="sticky top-0 bg-white z-30 border-b border-gray-100 px-4 py-4 flex items-center gap-3">
        <button onClick={() => router.back()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="font-semibold text-base">Set your location</h1>
        <button onClick={autoDetect} disabled={detecting} className="ml-auto text-xs text-[#F5A623] font-semibold flex items-center gap-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>
          {detecting ? 'Detecting...' : 'Auto-detect'}
        </button>
      </header>

      {/* Search */}
      <div className="px-4 py-3 relative z-20">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-[#F5A623] transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            value={searchQ}
            onChange={e => { setSearchQ(e.target.value); search(e.target.value) }}
            placeholder="Search for area, street, or landmark..."
            className="flex-1 bg-transparent text-sm outline-none"
          />
          {searchQ && (
            <button onClick={() => { setSearchQ(''); setSuggestions([]) }} className="text-gray-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          )}
        </div>
        {suggestions.length > 0 && (
          <div className="absolute left-4 right-4 bg-white border border-gray-100 rounded-2xl shadow-xl mt-1 overflow-hidden z-50">
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => pick(s)} className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 border-b border-gray-50 last:border-0 flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2.5" className="flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/></svg>
                <span className="truncate">{s.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div className="relative">
        <MapComponent center={center} draggable onDrag={handleDrag} height="340px" />
        {/* Center pin hint */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
          <div className="bg-white/90 backdrop-blur rounded-xl px-3 py-1.5 text-xs text-gray-600 shadow">
            Drag the pin to adjust
          </div>
        </div>
      </div>

      {/* Address + save */}
      <div className="px-4 py-4">
        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#FFF3DC] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Selected address</p>
              <p className="text-sm font-medium text-gray-900 leading-snug">{address || 'Move the pin to select a location'}</p>
            </div>
          </div>
        </div>

        {user && (
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-2 font-medium">Save as</p>
            <div className="flex gap-2">
              {['Home', 'Work', 'Other'].map(l => (
                <button
                  key={l}
                  onClick={() => setLabel(l)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                    label === l ? 'bg-[#F5A623] text-white border-[#F5A623]' : 'border-gray-200 text-gray-700 hover:border-[#F5A623]'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={save}
          disabled={!address || saving}
          className="w-full bg-[#F5A623] text-white font-bold py-4 rounded-2xl text-base disabled:opacity-50 shadow-[0_4px_20px_rgba(245,166,35,0.35)]"
        >
          {saving ? 'Saving...' : 'Confirm this location'}
        </button>
      </div>
    </main>
  )
}
