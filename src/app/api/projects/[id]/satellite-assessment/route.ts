import { NextResponse } from "next/server"
import { getProject, updateProjectSatellite } from "@/db/queries"
import { getCurrentSatelliteMetrics } from "@/lib/sentinel-hub"
import { estimateSurfaceMetrics } from "@/lib/site-data"
import type { SatelliteMetrics } from "@/data/projects"

export const runtime = "nodejs"
export const maxDuration = 25

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const project = await getProject(id)
  if (!project) {
    return NextResponse.json({ available: false, reason: "project_not_found" }, { status: 404 })
  }

  const result = await getCurrentSatelliteMetrics(project.aoi.lat, project.aoi.lng, project.aoi.radiusM)
  if (!result.available || result.ndviScore === null) {
    return NextResponse.json(
      { available: false, reason: result.reason ?? "sentinel_hub_unavailable" },
      { status: 200 }
    )
  }

  const surfaceMetrics = estimateSurfaceMetrics({ aridity: project.aridity, ndviScore: result.ndviScore })
  const satellite: SatelliteMetrics = {
    ndviScore: result.ndviScore,
    soilMoistureIndex: result.soilMoistureIndex ?? 0,
    surfaceTempC: surfaceMetrics.surfaceTempC,
    albedoEffect: surfaceMetrics.albedoEffect,
    // Preserve any existing history already cached in DB
    ndviHistory: project.satellite?.ndviHistory ?? [],
  }

  await updateProjectSatellite(id, satellite)

  return NextResponse.json({
    available: true,
    satellite,
  })
}
