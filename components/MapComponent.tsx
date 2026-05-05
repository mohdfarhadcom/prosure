'use client'
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api'
import { useEffect, useState, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'

const MAP_STYLES = { width: '100%', height: '100%' }
const MIN_ZOOM_FOR_WORKERS = 14

type Worker = { id: string; lat: number; lng: number; name: string; status: string }

type Props = {
  center: { lat: number; lng: number }
  draggable?: boolean
  onDrag?: (lat: number, lng: number) => void
  showWorkers?: boolean
  height?: string
  defaultZoom?: number
}

const WORKER_ICON = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="34" height="42"><circle cx="17" cy="9" r="7" fill="%23F5A623" stroke="white" stroke-width="2"/><path d="M3 20 L10 14 L13 18 L17 16 L21 18 L24 14 L31 20 L29 22 L29 40 L5 40 L5 22 Z" fill="%23F5A623" stroke="white" stroke-width="1.5" stroke-linejoin="round"/></svg>`

const YellowPin = () => (
  <svg width="36" height="44" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <filter id="shadow" x="-30%" y="-10%" width="160%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000040" />
    </filter>
    <g filter="url(#shadow)">
      <path d="M18 2C10.268 2 4 8.268 4 16c0 10 14 26 14 26s14-16 14-26c0-7.732-6.268-14-14-14z" fill="#F5A623"/>
      <circle cx="18" cy="16" r="5.5" fill="white" />
    </g>
  </svg>
)

export default function MapComponent({ center, draggable, onDrag, showWorkers, height = '300px', defaultZoom = 15 }: Props) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    mapIds: ['DEMO_MAP_ID'],
  })
  const [workers, setWorkers] = useState<Worker[]>([])
  const [mapCenter, setMapCenter] = useState(center)
  const [zoom, setZoom] = useState(defaultZoom)
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

  const onZoomChanged = useCallback(() => {
    if (mapRef.current) setZoom(mapRef.current.getZoom() ?? defaultZoom)
  }, [defaultZoom])

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

  const showWorkersOnMap = showWorkers && zoom >= MIN_ZOOM_FOR_WORKERS

  return (
    <div style={{ height }} className="relative">
      <GoogleMap
        mapContainerStyle={MAP_STYLES}
        center={mapCenter}
        zoom={defaultZoom}
        onLoad={onLoad}
        onDragEnd={draggable ? onDragEnd : undefined}
        onZoomChanged={onZoomChanged}
        options={{
          mapId: 'DEMO_MAP_ID',
          tilt: 45,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: 'greedy',
        }}
      >
        {showWorkersOnMap && workers.map(w => (
          <Marker
            key={w.id}
            position={{ lat: w.lat, lng: w.lng }}
            title={w.name}
            icon={{
              url: WORKER_ICON,
              scaledSize: new google.maps.Size(34, 42),
              anchor: new google.maps.Point(17, 42),
            }}
          />
        ))}
      </GoogleMap>

      {draggable && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div style={{ marginBottom: 44 }}>
            <YellowPin />
          </div>
        </div>
      )}

      {showWorkers && zoom < MIN_ZOOM_FOR_WORKERS && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 text-xs text-gray-500 font-medium shadow">
          Zoom in to see nearby professionals
        </div>
      )}
    </div>
  )
}
