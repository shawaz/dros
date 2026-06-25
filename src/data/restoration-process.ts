import { Satellite, Layers, BrainCircuit, Shovel, BadgeCheck, Receipt, ClipboardList, LucideIcon, Sprout, WavesVertical, LandPlot, Lightbulb } from "lucide-react"

export interface RestorationStep {
  step: number
  title: string
  description: string
  icon: LucideIcon
}

export const restorationProcessSteps: RestorationStep[] = [
  {
    step: 1,
    title: "Execution",
    icon: ClipboardList,
    description: "Crews log lab results, apply soil treatments, install irrigation, and carry out native planting per the prescription.",
  },
  {
    step: 2,
    title: "Plan",
    icon: Lightbulb,
    description: "Pre-filled operational template for field crews — checklists, logs, amendment records, and QA gates.",
  },
  {
    step: 3,
    title: "Satellite",
    icon: Satellite,
    description: "Multispectral imagery establishes baseline NDVI, land cover, and degradation extent across the site.",
  },
  {
    step: 4,
    title: "Soil & Bio",
    icon: LandPlot,
    description: "Laboratory and biological assessment of soil structure, chemistry, microbial activity, carbon stock, and water availability.",
  },
  {
    step: 5,
    title: "Rehabilitation",
    icon: Sprout,
    description: "Site data feeds a model that recommends species, treatments, and phased budget allocation.",
  },
  {
    step: 7,
    title: "Budget",
    icon: Receipt,
    description: "AI-generated cost model with phase breakdown, cash flow, carbon ROI, and sensitivity analysis.",
  },
  {
    step: 6,
    title: "Carbon",
    icon: WavesVertical,
    description: "Recurring NDVI and soil surveys verify survival rates and quantify carbon sequestration over time.",
  },

]
