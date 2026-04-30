export const GMAPS_LIBRARIES: ('places' | 'geometry')[] = ['places']

// Remove comma-separated segments that contain Devanagari or Arabic/Urdu script
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
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`
    )
    const data = await res.json()
    if (data.status === 'OK' && data.results?.[0]) {
      return data.results[0].formatted_address
    }
  } catch {}
  // Fallback to Nominatim — strip Hindi/Urdu segments
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
    const d = await r.json()
    return cleanAddress(d.display_name || '')
  } catch {}
  return 'Selected location'
}
