export const GMAPS_LIBRARIES: ('places' | 'geometry')[] = ['places']

export function cleanAddress(raw: string): string {
  return raw
    .split(',')
    .map(s => s.trim())
    .filter(s => !/[؀-ۿऀ-ॿ]/.test(s))
    .join(', ')
    .trim()
}

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  try {
    const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`)
    const data = await res.json()
    if (data.status === 'OK' && data.results?.[0]) return data.results[0].formatted_address
  } catch {}
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
    const d = await r.json()
    return cleanAddress(d.display_name || '')
  } catch {}
  return 'Selected location'
}

// Haversine distance in metres
export function distanceMetres(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
