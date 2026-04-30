'use client'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocation } from '@/context/LocationContext'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabaseClient'

const MapComponent = dynamic(() => import('@/components/MapComponent'), { ssr: false })
const DEFAULT = { lat: 28.6139, lng: 77.2090 }

export default function LocationPage() {
  const router = useRouter()
  const { location, setLocation } = useLocation()
  const { user } = useAuth()
  const [center, setCenter] = useState(location ? { lat: location.lat, lng: location.lng } : DEFAULT)
  const [address, setAddress] = useState(location?.address || '')
  const [searchQ, setSearchQ] = useState('')
  const [suggestions, setSuggestions] = useState<{ display_name: string; lat: string; lon: string }[]>([])
  const [label, setLabel] = useState('Home')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!location) {
      navigator.geolocation?.getCurrentPosition(pos => {
        const { latitude: lat, longitude: lng } = pos.coords
        setCenter({ lat, lng })
        reverseGeocode(lat, lng)
      })
    }
  }, [])

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
      const d = await r.json()
      setAddress(d.display_name || '')
    } catch {}
  }

  const search = async (q: string) => {
    if (q.length < 3) { setSuggestions([]); return }
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5`)
    setSuggestions(await res.json())
  }

  const pick = (s: { display_name: string; lat: string; lon: string }) => {
    const lat = parseFloat(s.lat)
    const lng = parseFloat(s.lon)
    setCenter({ lat, lng })
    setAddress(s.display_name)
    setSuggestions([])
    setSearchQ('')
  }

  const handleDrag = (lat: number, lng: number) => {
    setCenter({ lat, lng })
    reverseGeocode(lat, lng)
  }

  const save = async () => {
    setSaving(true)
    setLocation({ lat: center.lat, lng: center.lng, address })
    if (user) {
      await supabase.from('addresses').insert({
        user_id: user.id,
        label,
        lat: center.lat,
        lng: center.lng,
        full_address: address,
      })
    }
    setSaving(false)
    router.back()
  }

  return (
    <main className="page">
      <header className="sticky top-0 bg-white z-30 border-b border-gray-100 px-4 py-4 flex items-center gap-3">
        <button onClick={() => router.back()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 className="font-semibold text-base">Set location</h1>
      </header>

      {/* Search */}
      <div className="px-4 py-3 relative z-20">
        <input
          value={searchQ}
          onChange={e => { setSearchQ(e.target.value); search(e.target.value) }}
          placeholder="Search for area or landmark..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#F5A623]"
        />
        {suggestions.length > 0 && (
          <div className="absolute left-4 right-4 bg-white border border-gray-100 rounded-xl shadow-xl mt-1 overflow-hidden">
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => pick(s)} className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 border-b border-gray-50 last:border-0 truncate">
                {s.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <MapComponent center={center} draggable onDrag={handleDrag} height="350px" />

      {/* Address display */}
      <div className="px-4 py-4">
        <p className="text-xs text-gray-400 mb-1">Selected address</p>
        <p className="text-sm text-gray-900 font-medium">{address || 'Drag pin to adjust'}</p>

        {user && (
          <div className="mt-4">
            <p className="text-xs text-gray-400 mb-2">Save as</p>
            <div className="flex gap-2">
              {['Home', 'Work', 'Other'].map(l => (
                <button
                  key={l}
                  onClick={() => setLabel(l)}
                  className={`px-4 py-2 rounded-xl text-sm border transition-colors ${
                    label === l ? 'bg-[#F5A623] text-white border-[#F5A623]' : 'border-gray-200 text-gray-700'
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
          className="w-full mt-6 bg-[#F5A623] text-white font-semibold py-4 rounded-2xl disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Confirm location'}
        </button>
      </div>
    </main>
  )
}
