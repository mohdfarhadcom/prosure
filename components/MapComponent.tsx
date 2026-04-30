'use client'
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api'
import { useEffect, useState, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'

const MAP_STYLES = { width: '100%', height: '100%' }

type Worker = { id: string; lat: number; lng: number; name: string; status: string }

type Props = {
  center: { lat: number; lng: number }
  draggable?: boolean
  onDrag?: (lat: number, lng: number) => void
  showWorkers?: boolean
  height?: string
}

const YellowPin = () => (
  <svg width="36" height="44" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <filter id="shadow" x="-30%" y="-10%" width="160%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000040" />
    </filter>
    <g filter="url(#shadow)">
      <path
        d="M18 2C10.268 2 4 8.268 4 16c0 10 14 26 14 26s14-16 14-26c0-7.732-6.268-14-14-14z"
        fill="#F5A623"
      />
      <circle cx="18" cy="16" r="5.5" fill="white" />
    </g>
  </svg>
)

export default function MapComponent({ center, draggable, onDrag, showWorkers, height = '300px' }: Props) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    mapIds: ['DEMO_MAP_ID'],
  })
  const [workers, setWorkers] = useState<Worker[]>([])
  const [mapCenter, setMapCenter] = useState(center)
  const mapRef = useRef<google.maps.Map | null>(null)

  useEffect(() => { setMapCenter(center) }, [center.lat, center.lng])

  useEffect(() => {
    if (!showWorkers) return
    supabase.from('workers').select('*').then(({ data }) => {
      if (data) setWorkers(data as Worker[])
    })
    const ch = supabase
      .channel('workers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'workers' }, p => {
        setWorkers(prev => {
          const w = p.new as Worker
          const idx = prev.findIndex(x => x.id === w.id)
          return idx >= 0 ? prev.map((x, i) => (i === idx ? w : x)) : [...prev, w]
        })
      })
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [showWorkers])

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
  }, [])

  const onDragEnd = useCallback(() => {
    if (!mapRef.current || !onDrag) return
    const c = mapRef.current.getCenter()
    if (c) onDrag(c.lat(), c.lng())
  }, [onDrag])

  if (!isLoaded) {
    return (
      <div style={{ height }} className="bg-gray-100 flex items-center justify-center text-sm text-gray-400">
        Loading map...
      </div>
    )
  }

  return (
    <div style={{ height }} className="relative">
      <GoogleMap
        mapContainerStyle={MAP_STYLES}
        center={mapCenter}
        zoom={15}
        onLoad={onLoad}
        onDragEnd={draggable ? onDragEnd : undefined}
        options={{
          mapId: 'DEMO_MAP_ID',
          tilt: 45,
          disableDefaultUI: true,
          zoomControl: true,
          // Single-finger pan — no "use two fingers" nag
          gestureHandling: 'greedy',
        }}
      >
        {/* Worker markers (green dots) */}
        {showWorkers && workers.filter(w => w.status === 'available').map(w => (
          <Marker
            key={w.id}
            position={{ lat: w.lat, lng: w.lng }}
            title={w.name}
            icon={{
              url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="10" fill="%2322C55E" stroke="white" stroke-width="2"/></svg>',
              scaledSize: new google.maps.Size(24, 24),
            }}
          />
        ))}
      </GoogleMap>

      {/* Fixed yellow pin — always centred, map moves beneath it */}
      {draggable && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Offset upward by half pin height so the tip sits on the centre point */}
          <div style={{ marginBottom: 44 }}>
            <YellowPin />
          </div>
        </div>
      )}
    </div>
  )
}
