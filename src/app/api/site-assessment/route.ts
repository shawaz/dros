import { NextRequest, NextResponse } from "next/server"
import { getRainfall, getSoil, estimateHealthRisk, estimateSurfaceMetrics } from "@/lib/site-data"
import { reverseGeocode } from "@/lib/geocode"
import { getSatelliteAssessment } from "@/lib/sentinel-hub"
import { polygonCentroid } from "@/lib/aoi"
import type { LatLng } from "@/data/projects"

export const runtime = "nodejs"
export const maxDuration = 30

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { polygon?: LatLng[] } | null
  const polygon = Array.isArray(body?.polygon) ? body.polygon : []

  if (polygon.length < 3) {
    return NextResponse.json({ available: false, reason: "invalid_request" }, { status: 400 })
  }

  // Point-data sources (rainfall, soil, place) are sampled at the AOI centroid;
  // the satellite stats use the polygon's full bounding box.
  const { lat, lng } = polygonCentroid(polygon)

  const [rainfall, soil, place, satellite] = await Promise.all([
    getRainfall(lat, lng),
    getSoil(lat, lng),
    reverseGeocode(lat, lng),
    getSatelliteAssessment(polygon),
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
    sandPct: soil.sandPct,
    siltPct: soil.siltPct,
    clayPct: soil.clayPct,
    textureClass: soil.textureClass,
    cec: soil.cecCmolPerKg,
    bulkDensity: soil.bulkDensityGPerCm3,
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
