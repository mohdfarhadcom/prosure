'use client'
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api'
import { useEffect, useState, useCallback } from 'react'
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

export default function MapComponent({ center, draggable, onDrag, showWorkers, height = '300px' }: Props) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    mapIds: ['DEMO_MAP_ID'],
  })
  const [workers, setWorkers] = useState<Worker[]>([])
  const [pin, setPin] = useState(center)

  useEffect(() => { setPin(center) }, [center.lat, center.lng])

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

  const onMarkerDrag = useCallback((e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return
    const lat = e.latLng.lat()
    const lng = e.latLng.lng()
    setPin({ lat, lng })
    onDrag?.(lat, lng)
  }, [onDrag])

  if (!isLoaded) return <div style={{ height }} className="bg-gray-100 flex items-center justify-center text-sm text-gray-500">Loading map...</div>

  return (
    <div style={{ height }}>
      <GoogleMap
        mapContainerStyle={MAP_STYLES}
        center={pin}
        zoom={15}
        options={{
          mapId: 'DEMO_MAP_ID',
          tilt: 45,
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        <Marker position={pin} draggable={draggable} onDragEnd={onMarkerDrag} />
        {showWorkers && workers.filter(w => w.status === 'available').map(w => (
          <Marker
            key={w.id}
            position={{ lat: w.lat, lng: w.lng }}
            title={w.name}
            icon={{ url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%2322C55E" stroke="white" stroke-width="2"/></svg>', scaledSize: typeof google !== 'undefined' ? new google.maps.Size(24, 24) : undefined }}
          />
        ))}
      </GoogleMap>
    </div>
  )
}
