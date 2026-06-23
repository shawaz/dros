import { Satellite, Drone, FlaskConical, BrainCircuit, Shovel, BadgeCheck, Receipt, ClipboardList, LucideIcon } from "lucide-react"

export interface RestorationStep {
  step: number
  title: string
  description: string
  icon: LucideIcon
}

export const restorationProcessSteps: RestorationStep[] = [
  {
    step: 1,
    title: "Satellite Assessment",
    icon: Satellite,
    description: "Multispectral imagery establishes baseline NDVI, land cover, and degradation extent across the site.",
  },
  {
    step: 2,
    title: "Drone Survey & 3D Mapping",
    icon: Drone,
    description: "High-resolution aerial mapping captures terrain, drainage lines, and micro-topography for earthworks planning.",
  },
  {
    step: 3,
    title: "Chemical & Biological Analysis",
    icon: FlaskConical,
    description: "Soil sampling measures pH, carbon, and moisture to identify amendments needed before planting.",
  },
  {
    step: 4,
    title: "AI Rehabilitation Prescription",
    icon: BrainCircuit,
    description: "Site data feeds a model that recommends species, treatments, and phased budget allocation.",
  },
  {
    step: 5,
    title: "Field Execution",
    icon: Shovel,
    description: "Crews apply soil treatments, install irrigation, and carry out native planting per the prescription.",
  },
  {
    step: 6,
    title: "Monitoring & Carbon Verification",
    icon: BadgeCheck,
    description: "Recurring NDVI and soil surveys verify survival rates and quantify carbon sequestration over time.",
  },
  {
    step: 7,
    title: "Budget Estimation",
    icon: Receipt,
    description: "AI-generated cost model with phase breakdown, cash flow, carbon ROI, and sensitivity analysis.",
  },
  {
    step: 8,
    title: "Field Execution Plan",
    icon: ClipboardList,
    description: "Pre-filled operational template for field crews — checklists, logs, amendment records, and QA gates.",
  },
]
