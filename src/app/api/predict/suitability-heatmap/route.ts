import { NextResponse } from "next/server"
import { generateHeatmap } from "@/lib/predict/suitability-heatmap"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const resolutionParam = parseFloat(searchParams.get("resolution") ?? "0.5")
  // Clamp to avoid an excessively fine grid (this route is reachable from the
  // client, unlike the source Python service which only takes server-side calls).
  const resolution = Number.isNaN(resolutionParam) ? 0.5 : Math.max(0.1, resolutionParam)
  const region = searchParams.get("region") ?? "all"
  const regionFilter = region === "all" ? null : region

  return NextResponse.json(generateHeatmap(resolution, regionFilter))
}
