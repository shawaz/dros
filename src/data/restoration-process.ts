import { LayoutDashboard, Satellite, Drone, FlaskConical, Sprout, Receipt, ClipboardList, Leaf, LucideIcon } from "lucide-react"

export interface RestorationStep {
  step: number
  title: string
  description: string
  icon: LucideIcon
}

export const restorationProcessSteps: RestorationStep[] = [
  {
    step: 1,
    title: "Overview",
    icon: LayoutDashboard,
    description: "Project status at a glance — biomass growth, carbon sequestration, and dMRV verification progress.",
  },
  {
    step: 2,
    title: "Satellite",
    icon: Satellite,
    description: "Multispectral imagery establishes baseline NDVI, land cover, and degradation extent across the site.",
  },
  {
    step: 3,
    title: "Drone & Field",
    icon: Drone,
    description: "High-resolution drone mapping divides the site into a treatment grid with cell-level soil and biology profiles.",
  },
  {
    step: 4,
    title: "Bio & Chemical",
    icon: FlaskConical,
    description: "Laboratory and biological assessment of soil structure, chemistry, microbial activity, carbon stock, and water availability.",
  },
  {
    step: 5,
    title: "Rehabilitation",
    icon: Sprout,
    description: "Site data feeds a model that recommends species, treatments, and phased budget allocation.",
  },
  {
    step: 6,
    title: "Budget",
    icon: Receipt,
    description: "AI-generated cost model with phase breakdown, cash flow, carbon ROI, and sensitivity analysis.",
  },
  {
    step: 7,
    title: "Execution",
    icon: ClipboardList,
    description: "Operational field execution plan — crews, machinery, SOPs, zone work plans, and contingency procedures.",
  },
  {
    step: 8,
    title: "Carbon",
    icon: Leaf,
    description: "Recurring NDVI and soil surveys verify survival rates and quantify carbon sequestration over time.",
  },
]
