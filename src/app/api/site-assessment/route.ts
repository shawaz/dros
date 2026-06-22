import { NextRequest, NextResponse } from "next/server"
import { getRainfall, getSoil, estimateHealthRisk, estimateSurfaceMetrics } from "@/lib/site-data"
import { reverseGeocode } from "@/lib/geocode"
import { getSatelliteAssessment } from "@/lib/sentinel-hub"

export const runtime = "nodejs"
export const maxDuration = 30

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const lat = parseFloat(searchParams.get("lat") ?? "")
  const lng = parseFloat(searchParams.get("lng") ?? "")
  const radiusMParam = parseFloat(searchParams.get("radiusM") ?? "")
  const radiusM = Number.isNaN(radiusMParam) ? 500 : radiusMParam

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return NextResponse.json({ available: false, reason: "invalid_request" }, { status: 400 })
  }

  const [rainfall, soil, place, satellite] = await Promise.all([
    getRainfall(lat, lng),
    getSoil(lat, lng),
    reverseGeocode(lat, lng),
    getSatelliteAssessment(lat, lng, radiusM),
  ])

  if (rainfall.rainfallMmPerYear === null) {
    return NextResponse.json({ available: false, reason: "rainfall_unavailable" }, { status: 502 })
  }

  const estimate = estimateHealthRisk({
    rainfallMm: rainfall.rainfallMmPerYear,
    ph: soil.ph,
    organicCarbonGPerKg: soil.organicCarbonGPerKg,
  })

  const surfaceMetrics = estimateSurfaceMetrics({
    aridity: estimate.aridity,
    ndviScore: satellite.available ? satellite.ndviScore : null,
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
    satelliteAvailable: satellite.available,
    ndvi: satellite.available ? satellite.ndviScore : null,
    ndviHistory: satellite.available ? satellite.ndviHistory : [],
    soilMoistureIndex: satellite.available ? satellite.soilMoistureIndex : null,
    surfaceTempC: surfaceMetrics.surfaceTempC,
    albedoEffect: surfaceMetrics.albedoEffect,
  })
}
