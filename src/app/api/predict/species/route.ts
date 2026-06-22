import { NextResponse } from "next/server"
import { rankSpecies, type SoilType } from "@/lib/predict/species"

export const runtime = "nodejs"

const REQUIRED_FIELDS = [
  "ndvi",
  "aridityIndex",
  "soilPh",
  "soilOrganicCarbon",
  "soilSandPct",
  "salinityProxy",
  "rainfallMmYr",
] as const

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 })
  }
  const b = body as Record<string, unknown>

  for (const field of REQUIRED_FIELDS) {
    if (typeof b[field] !== "number" || Number.isNaN(b[field])) {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 })
    }
  }

  const ranked = rankSpecies({
    ndvi: b.ndvi as number,
    aridityIndex: b.aridityIndex as number,
    soilPh: b.soilPh as number,
    soilOrganicCarbon: b.soilOrganicCarbon as number,
    soilSandPct: b.soilSandPct as number,
    salinityProxy: b.salinityProxy as number,
    rainfallMmYr: b.rainfallMmYr as number,
    region: typeof b.region === "string" ? b.region : null,
    waterBudget: typeof b.waterBudget === "number" ? b.waterBudget : undefined,
    soilType: typeof b.soilType === "string" ? (b.soilType as SoilType) : undefined,
    topK: typeof b.topK === "number" ? b.topK : undefined,
  })

  return NextResponse.json(ranked)
}
