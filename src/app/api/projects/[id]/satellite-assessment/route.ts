import { NextResponse } from "next/server"
import { getProject } from "@/db/queries"
import { getSatelliteAssessment } from "@/lib/sentinel-hub"
import { estimateSurfaceMetrics } from "@/lib/site-data"
import type { SatelliteMetrics } from "@/data/projects"

export const runtime = "nodejs"
export const maxDuration = 30

// Not persisted — the deployed SQLite file is read-only at runtime (same
// constraint as the rehab-report "Regenerate" action). Always recomputes
// from live Sentinel Hub data and returns it; the client holds it in local
// state only.
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const project = getProject(id)
  if (!project) {
    return NextResponse.json({ available: false, reason: "project_not_found" }, { status: 404 })
  }

  const result = await getSatelliteAssessment(project.aoi.lat, project.aoi.lng, project.aoi.radiusM)
  if (!result.available || result.ndviScore === null) {
    return NextResponse.json(
      { available: false, reason: result.reason ?? "sentinel_hub_unavailable" },
      { status: 502 }
    )
  }

  const surfaceMetrics = estimateSurfaceMetrics({ aridity: project.aridity, ndviScore: result.ndviScore })
  const satellite: SatelliteMetrics = {
    ndviScore: result.ndviScore,
    soilMoistureIndex: result.soilMoistureIndex ?? 0,
    surfaceTempC: surfaceMetrics.surfaceTempC,
    albedoEffect: surfaceMetrics.albedoEffect,
    ndviHistory: result.ndviHistory,
  }

  return NextResponse.json({
    available: true,
    project: { ...project, satellite, ndvi: satellite.ndviScore },
  })
}
