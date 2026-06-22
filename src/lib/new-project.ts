import type { Project, DMRVStep } from "@/data/projects"

export interface NewProjectInput {
  name: string
  region: string
  location: string
  lat: number
  lng: number
  radiusM: number
  rainfall: number
  ph: number | null
  carbon_soil: number | null
  nitrogen: number | null
  health: number
  risk: "SEVERE" | "LOW"
  aridity: number
}

const DEFAULT_DMRV: DMRVStep[] = [
  { registry: "Internal Baseline", label: "Baseline carbon stock established", status: "pending" },
  { registry: "Verra VCS", label: "Project design document (PDD) submitted", status: "pending" },
  { registry: "Verra VCS", label: "Validation by approved VVB", status: "pending" },
  { registry: "Gold Standard", label: "Registration", status: "pending" },
]

function healthTierColors(health: number) {
  if (health >= 80) {
    return {
      healthCol: "#2E8B57",
      terrainStroke: "#4CAF72",
      terrainFill: "#2E8B57",
      terrainBg: "linear-gradient(160deg,#0F2818,#1A4228)",
    }
  }
  if (health >= 40) {
    return {
      healthCol: "#C9841A",
      terrainStroke: "#D4941A",
      terrainFill: "#7A5018",
      terrainBg: "linear-gradient(160deg,#2A1E08,#3A2A10)",
    }
  }
  return {
    healthCol: "#C0392B",
    terrainStroke: "#E05C3A",
    terrainFill: "#6B3020",
    terrainBg: "linear-gradient(160deg,#2A1810,#3A2018)",
  }
}

function formatArea(radiusM: number): string {
  const hectares = Math.round((Math.PI * radiusM * radiusM) / 10000)
  return hectares.toLocaleString("en-US")
}

export function buildNewProject(id: string, input: NewProjectInput): Project {
  const colors = healthTierColors(input.health)
  // SoilGrids reports organic carbon in g/kg (same scale as the existing
  // `carbon_soil` field) — organic matter % is conventionally ~1/10th of that.
  const organicMatterPct = input.carbon_soil !== null ? Math.round((input.carbon_soil / 10) * 10) / 10 : null
  const hasSoilData = input.ph !== null || input.carbon_soil !== null || input.nitrogen !== null

  return {
    id,
    name: input.name,
    region: input.region,
    location: input.location,
    status: "planning",
    risk: input.risk,
    health: input.health,
    degrad: 100 - input.health,
    diff: input.risk === "SEVERE" ? "HIGH" : "LOW",
    ndvi: null,
    rainfall: input.rainfall,
    moisture: null,
    ph: input.ph,
    carbon_soil: input.carbon_soil,
    aridity: input.aridity,
    lstemp: null,
    area: formatArea(input.radiusM),
    cost: "Not yet budgeted",
    timeline: "TBD",
    water: "Not yet assessed",
    carbon: "Not yet projected",
    terrainBg: colors.terrainBg,
    terrainStroke: colors.terrainStroke,
    terrainFill: colors.terrainFill,
    healthCol: colors.healthCol,
    phases: [],
    species: [],
    treatments: [],
    recs: [],
    currentStep: 1,
    aoi: { lat: input.lat, lng: input.lng, radiusM: input.radiusM },
    satellite: null,
    droneLogs: [],
    soil: hasSoilData
      ? {
          npk: { nitrogen: input.nitrogen, phosphorus: null, potassium: null },
          organicMatterPct,
          salinityDS: null,
          heavyMetalsDetected: null,
          toxicityNotes: null,
        }
      : null,
    microbiome: null,
    prescription: null,
    kanban: [],
    resources: null,
    biomass: [],
    dmrv: DEFAULT_DMRV.map((step) => ({ ...step })),
    carbonSequesteredTons: 0,
  }
}
