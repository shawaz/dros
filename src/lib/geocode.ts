export interface ReverseGeocodeResult {
  region: string
  location: string
}

// OpenStreetMap Nominatim usage policy requires a descriptive User-Agent and
// caps free usage at ~1 request/second — fine for one lookup per wizard step.
export async function reverseGeocode(lat: number, lng: number): Promise<ReverseGeocodeResult> {
  const fallback: ReverseGeocodeResult = {
    region: "Saudi Arabia",
    location: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=10&accept-language=en`
    const res = await fetch(url, {
      headers: { "User-Agent": "DROS-dashboard/1.0 (restoration site picker)" },
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) return fallback

    const json = await res.json()
    const address = json?.address ?? {}
    const location: string =
      address.city ?? address.town ?? address.village ?? address.county ?? fallback.location
    const region: string = address.state ?? address.province ?? fallback.region

    return { region, location }
  } catch {
    return fallback
  }
}
