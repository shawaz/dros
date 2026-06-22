import { NextRequest, NextResponse } from "next/server"
import { getRainfall, getSoil, estimateHealthRisk } from "@/lib/site-data"
import { reverseGeocode } from "@/lib/geocode"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const lat = parseFloat(searchParams.get("lat") ?? "")
  const lng = parseFloat(searchParams.get("lng") ?? "")

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return NextResponse.json({ available: false, reason: "invalid_request" }, { status: 400 })
  }

  const [rainfall, soil, place] = await Promise.all([
    getRainfall(lat, lng),
    getSoil(lat, lng),
    reverseGeocode(lat, lng),
  ])

  if (rainfall.rainfallMmPerYear === null) {
    return NextResponse.json({ available: false, reason: "rainfall_unavailable" }, { status: 502 })
  }

  const estimate = estimateHealthRisk({
    rainfallMm: rainfall.rainfallMmPerYear,
    ph: soil.ph,
    organicCarbonGPerKg: soil.organicCarbonGPerKg,
  })

  return NextResponse.json({
    available: true,
    region: place.region,
    location: place.location,
    rainfall: rainfall.rainfallMmPerYear,
    ph: soil.ph,
    organicCarbon: soil.organicCarbonGPerKg,
    nitrogen: soil.nitrogenGPerKg,
    health: estimate.health,
    risk: estimate.risk,
    aridity: estimate.aridity,
  })
}
