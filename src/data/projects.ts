import type { RehabilitationReport } from './rehabilitation-report'

export interface Phase {
  name: string
  range: string
  amount: string
  col: string
}

export interface Recommendation {
  t: string
  d: string
}

export interface NPKLevels {
  nitrogen: number | null
  phosphorus: number | null
  potassium: number | null
}

export interface SoilComposition {
  npk: NPKLevels
  organicMatterPct: number | null
  salinityDS: number | null
  heavyMetalsDetected: boolean | null
  toxicityNotes: string | null
}

export interface Microbiome {
  fungalToBacterialRatio: number
  microbialBiomassCarbon: number
  mycorrhizalSporeDensity: number
}

export interface NdviYear {
  year: number
  ndvi: number
}

export interface SatelliteMetrics {
  ndviScore: number
  soilMoistureIndex: number
  surfaceTempC: number
  albedoEffect: number
  ndviHistory: NdviYear[]
}

export interface DroneFlightLog {
  date: string
  batteryHealthPct: number
  areaCoveredHa: number
  dataUrl: string
}

export type KanbanColumn = 'todo' | 'in-progress' | 'verified'

export interface KanbanTask {
  id: string
  title: string
  column: KanbanColumn
}

export interface ResourceInventory {
  seedSuppliesPct: number
  waterReservesPct: number
  machineryUptimePct: number
}

export interface BiomassPoint {
  month: number
  actual: number | null
  predicted: number
}

export type DMRVStepStatus = 'pending' | 'in-progress' | 'complete'

export interface DMRVStep {
  registry: string
  label: string
  status: DMRVStepStatus
}

export interface AOI {
  lat: number
  lng: number
  radiusM: number
}

export interface Project {
  id: string
  name: string
  region: string
  location: string
  status: 'planning' | 'active'
  risk: 'SEVERE' | 'LOW'
  health: number
  degrad: number
  diff: 'HIGH' | 'LOW'
  ndvi: number | null
  rainfall: number
  moisture: number | null
  ph: number | null
  carbon_soil: number | null
  aridity: number
  lstemp: number | null
  area: string
  cost: string
  timeline: string
  water: string
  carbon: string
  terrainBg: string
  terrainStroke: string
  terrainFill: string
  healthCol: string
  phases: Phase[]
  species: string[]
  treatments: string[]
  recs: Recommendation[]
  currentStep: number
  aoi: AOI
  satellite: SatelliteMetrics | null
  droneLogs: DroneFlightLog[]
  soil: SoilComposition | null
  microbiome: Microbiome | null
  rehabReport: RehabilitationReport | null
  kanban: KanbanTask[]
  resources: ResourceInventory | null
  biomass: BiomassPoint[]
  dmrv: DMRVStep[]
  carbonSequesteredTons: number
}

export interface ActivityItem {
  id: number
  projId: string
  text: string
  time: string
  type: 'success' | 'warn' | 'info' | 'danger'
}

export const projectsData: Project[] = [
  {
    id: 'DROS-01',
    name: 'New Land 1 Restoration',
    region: 'Riyadh Region',
    location: '24.7568, 46.9362',
    status: 'planning',
    risk: 'SEVERE',
    health: 31,
    degrad: 69,
    diff: 'HIGH',
    ndvi: 0.075,
    rainfall: 114,
    moisture: 0.046,
    ph: 7.9,
    carbon_soil: 4.1,
    aridity: 0.05,
    lstemp: 32.4,
    area: '1,109',
    cost: '16,966,935',
    timeline: '18 months',
    water: '1,940,662 m³/yr',
    carbon: '3,548 tCO₂/yr',
    terrainBg: 'linear-gradient(160deg,#2A1810,#3A2018)',
    terrainStroke: '#E05C3A',
    terrainFill: '#6B3020',
    healthCol: '#C0392B',
    phases: [
      { name: 'Soil stabilization', range: 'Months 1–4', amount: '4,200,000', col: '#0F6E56' },
      { name: 'Water infrastructure', range: 'Months 2–6', amount: '6,800,000', col: '#185FA5' },
      { name: 'Planting operations', range: 'Months 4–10', amount: '3,900,000', col: '#639922' },
      { name: 'Monitoring & management', range: 'Months 6–18', amount: '1,566,935', col: '#BA7517' },
      { name: 'Contingency (3%)', range: '—', amount: '500,000', col: '#888780' },
    ],
    species: ['Acacia tortilis', 'Ghaf (Prosopis cineraria)', 'Rhanterium epapposum'],
    treatments: ['Cyanobacteria crust', 'WaterLock polymer', 'Biofertilizer', 'Native planting'],
    recs: [
      { t: 'Secure water source first', d: 'At aridity 0.05, every other phase depends on resolving water supply. Begin groundwater survey immediately.' },
      { t: 'Cyanobacteria crust before planting', d: 'Apply biological soil crusts across all bare ground to halt wind erosion — foundational step.' },
      { t: 'Micro-catchment earthworks', d: 'Negarim basins to capture every rain event. Routes water to planting pits rather than surface runoff.' },
      { t: 'Biofertilizer inoculation', d: 'Mycorrhizal fungi + nitrogen-fixing bacteria to begin rebuilding soil food web from 4.1 g/kg carbon.' },
    ],
    currentStep: 2,
    aoi: { lat: 24.7568, lng: 46.9362, radiusM: 1880 },
    satellite: {
      ndviScore: 0.075,
      soilMoistureIndex: 0.046,
      surfaceTempC: 32.4,
      albedoEffect: 0.38,
      ndviHistory: [
        { year: 2015, ndvi: 0.19 }, { year: 2016, ndvi: 0.17 }, { year: 2017, ndvi: 0.16 },
        { year: 2018, ndvi: 0.15 }, { year: 2019, ndvi: 0.13 }, { year: 2020, ndvi: 0.12 },
        { year: 2021, ndvi: 0.11 }, { year: 2022, ndvi: 0.10 }, { year: 2023, ndvi: 0.085 },
        { year: 2024, ndvi: 0.075 },
      ],
    },
    droneLogs: [
      { date: '2025-02-08', batteryHealthPct: 94, areaCoveredHa: 410, dataUrl: 'dros01_flight_2025-02-08.zip' },
      { date: '2025-02-22', batteryHealthPct: 89, areaCoveredHa: 455, dataUrl: 'dros01_flight_2025-02-22.zip' },
    ],
    soil: {
      npk: { nitrogen: 11, phosphorus: 5, potassium: 102 },
      organicMatterPct: 0.8,
      salinityDS: 2.1,
      heavyMetalsDetected: false,
      toxicityNotes: 'Salinity (2.1 dS/m) and pH are within tolerable range for native species — no amendment required before planting.',
    },
    microbiome: {
      fungalToBacterialRatio: 0.4,
      microbialBiomassCarbon: 110,
      mycorrhizalSporeDensity: 18,
    },
    rehabReport: null,
    kanban: [
      { id: 'd01-1', title: 'Groundwater survey', column: 'in-progress' },
      { id: 'd01-2', title: 'Cyanobacteria crust application — Block A', column: 'todo' },
      { id: 'd01-3', title: 'Negarim micro-catchment earthworks', column: 'todo' },
      { id: 'd01-4', title: 'Drone Seed Bombing Run #1', column: 'todo' },
    ],
    resources: { seedSuppliesPct: 55, waterReservesPct: 18, machineryUptimePct: 70 },
    biomass: [
      { month: 1, actual: null, predicted: 3 },
      { month: 3, actual: null, predicted: 8 },
      { month: 6, actual: null, predicted: 17 },
      { month: 12, actual: null, predicted: 33 },
      { month: 18, actual: null, predicted: 50 },
      { month: 24, actual: null, predicted: 68 },
    ],
    dmrv: [
      { registry: 'Internal Baseline', label: 'Baseline carbon stock established', status: 'in-progress' },
      { registry: 'Verra VCS', label: 'Project design document (PDD) submitted', status: 'pending' },
      { registry: 'Verra VCS', label: 'Validation by approved VVB', status: 'pending' },
      { registry: 'Gold Standard', label: 'Registration', status: 'pending' },
    ],
    carbonSequesteredTons: 0,
  },
  {
    id: 'DROS-02',
    name: 'Al Kharj Farmland Buffer Restoration',
    region: 'Al Kharj',
    location: 'Al Kharj Farmland Buffer',
    status: 'planning',
    risk: 'SEVERE',
    health: 24,
    degrad: 76,
    diff: 'HIGH',
    ndvi: 0.07,
    rainfall: 24,
    moisture: 0.030,
    ph: 8.1,
    carbon_soil: 4.7,
    aridity: 0.01,
    lstemp: 38.2,
    area: '1,109',
    cost: '26,400,000',
    timeline: '24 months (extended)',
    water: '3,280,000 m³/yr',
    carbon: '3,548 tCO₂/yr',
    terrainBg: 'linear-gradient(160deg,#2A1E08,#3A2A10)',
    terrainStroke: '#D4941A',
    terrainFill: '#7A5018',
    healthCol: '#C0392B',
    phases: [
      { name: 'Water sourcing & survey', range: 'Months 1–2', amount: '3,200,000', col: '#C0392B' },
      { name: 'Irrigation infrastructure', range: 'Months 2–6', amount: '7,400,000', col: '#185FA5' },
      { name: 'Soil treatment', range: 'Months 3–6', amount: '6,100,000', col: '#0F6E56' },
      { name: 'Planting operations', range: 'Months 5–12', amount: '4,700,000', col: '#639922' },
      { name: 'Monitoring & management', range: 'Months 6–24', amount: '2,900,000', col: '#BA7517' },
      { name: 'Contingency (8%)', range: '—', amount: '2,100,000', col: '#888780' },
    ],
    species: ['Ghaf (Prosopis cineraria)', 'Acacia tortilis', 'Haloxylon ammodendron', 'Atriplex halimus'],
    treatments: ['Groundwater survey', 'Subsurface drip irrigation', 'Gypsum pH amendment', 'Biochar application'],
    recs: [
      { t: 'Groundwater survey is mandatory first step', d: 'At 24 mm/yr rainfall, 100% irrigation-dependent establishment. No water source = project cannot proceed.' },
      { t: 'pH amendment before any planting', d: 'Gypsum/sulfur to bring pH from 8.1 to 7.5. High pH locks out iron, zinc, and manganese.' },
      { t: 'Subsurface drip at 30–40 cm depth', d: 'Surface drip loses too much to evaporation at this aridity. Must install below ground.' },
      { t: 'Raise soil moisture to 0.08 before planting', d: 'Currently 0.030 — critically low. Pre-irrigate and condition soil for 4–6 weeks minimum.' },
    ],
    currentStep: 3,
    // Al Kharj Farmland Buffer has no surveyed coordinates yet — approximate town centroid used as AOI stand-in
    aoi: { lat: 24.15, lng: 47.30, radiusM: 1880 },
    satellite: {
      ndviScore: 0.07,
      soilMoistureIndex: 0.030,
      surfaceTempC: 38.2,
      albedoEffect: 0.46,
      ndviHistory: [
        { year: 2015, ndvi: 0.17 }, { year: 2016, ndvi: 0.155 }, { year: 2017, ndvi: 0.14 },
        { year: 2018, ndvi: 0.125 }, { year: 2019, ndvi: 0.115 }, { year: 2020, ndvi: 0.105 },
        { year: 2021, ndvi: 0.095 }, { year: 2022, ndvi: 0.085 }, { year: 2023, ndvi: 0.075 },
        { year: 2024, ndvi: 0.07 },
      ],
    },
    droneLogs: [
      { date: '2025-01-14', batteryHealthPct: 96, areaCoveredHa: 280, dataUrl: 'dros02_flight_2025-01-14.zip' },
      { date: '2025-02-02', batteryHealthPct: 88, areaCoveredHa: 310, dataUrl: 'dros02_flight_2025-02-02.zip' },
      { date: '2025-02-19', batteryHealthPct: 81, areaCoveredHa: 295, dataUrl: 'dros02_flight_2025-02-19.zip' },
    ],
    soil: {
      npk: { nitrogen: 8, phosphorus: 4, potassium: 96 },
      organicMatterPct: 0.6,
      salinityDS: 4.8,
      heavyMetalsDetected: false,
      toxicityNotes: 'Elevated salinity (4.8 dS/m) combined with pH 8.1 will inhibit root uptake — gypsum/sulfur amendment required before any planting.',
    },
    microbiome: {
      fungalToBacterialRatio: 0.3,
      microbialBiomassCarbon: 95,
      mycorrhizalSporeDensity: 12,
    },
    rehabReport: null,
    kanban: [
      { id: 'd02-1', title: 'Groundwater survey & well siting', column: 'verified' },
      { id: 'd02-2', title: 'Gypsum/sulfur soil amendment — Block A', column: 'in-progress' },
      { id: 'd02-3', title: 'Subsurface drip line installation', column: 'todo' },
      { id: 'd02-4', title: 'Deploying Hydropolymeric gel — Block A', column: 'todo' },
    ],
    resources: { seedSuppliesPct: 40, waterReservesPct: 22, machineryUptimePct: 65 },
    biomass: [
      { month: 1, actual: null, predicted: 2 },
      { month: 3, actual: null, predicted: 6 },
      { month: 6, actual: null, predicted: 14 },
      { month: 12, actual: null, predicted: 28 },
      { month: 18, actual: null, predicted: 45 },
      { month: 24, actual: null, predicted: 62 },
    ],
    dmrv: [
      { registry: 'Internal Baseline', label: 'Baseline carbon stock established', status: 'in-progress' },
      { registry: 'Verra VCS', label: 'Project design document (PDD) submitted', status: 'pending' },
      { registry: 'Verra VCS', label: 'Validation by approved VVB', status: 'pending' },
      { registry: 'Gold Standard', label: 'Registration', status: 'pending' },
    ],
    carbonSequesteredTons: 0,
  },
  {
    id: 'DROS-03',
    name: 'Riyadh North Greening Programme',
    region: 'North Riyadh',
    location: '54.659, 36.365',
    status: 'active',
    risk: 'LOW',
    health: 91,
    degrad: 9,
    diff: 'LOW',
    ndvi: 0.47,
    rainfall: 359,
    moisture: 0.496,
    ph: 7.3,
    carbon_soil: 27.3,
    aridity: 0.23,
    lstemp: 28.1,
    area: '65,568',
    cost: '786,000,000',
    timeline: '12 months',
    water: 'Rain-fed + supplemental yr 1',
    carbon: '~196,704 tCO₂/yr',
    terrainBg: 'linear-gradient(160deg,#0F2818,#1A4228)',
    terrainStroke: '#4CAF72',
    terrainFill: '#2E8B57',
    healthCol: '#2E8B57',
    phases: [
      { name: 'Site prep & fencing', range: 'Months 1–2', amount: '118,000,000', col: '#0F6E56' },
      { name: 'Light irrigation (yr 1)', range: 'Months 2–4', amount: '157,000,000', col: '#185FA5' },
      { name: 'Planting operations', range: 'Months 2–8', amount: '393,000,000', col: '#639922' },
      { name: 'Monitoring & management', range: 'Months 6–24', amount: '79,000,000', col: '#BA7517' },
      { name: 'Contingency (5%)', range: '—', amount: '39,000,000', col: '#888780' },
    ],
    species: ['Juniperus phoenicea', 'Pistacia atlantica', 'Acacia gerrardii', 'Ziziphus spina-christi', 'Rhazya stricta'],
    treatments: ['Light scarification', 'Seasonal drip (yr 1 only)', 'Biofertilizer inoculation', 'Perimeter fencing'],
    recs: [
      { t: 'No soil remediation needed', d: 'Soil carbon 27.3 g/kg and pH 7.3 are near-ideal. Do not disturb existing soil structure.' },
      { t: 'Rain-fed planting with yr-1 supplemental drip only', d: '359 mm/yr is sufficient for establishment. Infrastructure can be minimal and temporary.' },
      { t: 'Target 200–250 trees/ha', d: 'Healthy conditions allow natural canopy expansion. Wider spacing reduces cost and inter-tree competition.' },
      { t: 'Plant at rainy season onset', d: 'Maximise natural rainfall for establishment, reducing supplemental water demand by ~40%.' },
    ],
    currentStep: 6,
    // existing `location` field above is bad legacy data (falls in Eastern Europe) — using an approximate North Riyadh point for AOI purposes instead
    aoi: { lat: 24.85, lng: 46.70, radiusM: 14450 },
    satellite: {
      ndviScore: 0.47,
      soilMoistureIndex: 0.496,
      surfaceTempC: 28.1,
      albedoEffect: 0.21,
      ndviHistory: [
        { year: 2015, ndvi: 0.34 }, { year: 2016, ndvi: 0.31 }, { year: 2017, ndvi: 0.28 },
        { year: 2018, ndvi: 0.25 }, { year: 2019, ndvi: 0.22 }, { year: 2020, ndvi: 0.19 },
        { year: 2021, ndvi: 0.17 }, { year: 2022, ndvi: 0.15 }, { year: 2023, ndvi: 0.14 },
        { year: 2024, ndvi: 0.47 },
      ],
    },
    droneLogs: [
      { date: '2025-03-01', batteryHealthPct: 97, areaCoveredHa: 3800, dataUrl: 'dros03_flight_2025-03-01.zip' },
      { date: '2025-04-10', batteryHealthPct: 92, areaCoveredHa: 4100, dataUrl: 'dros03_flight_2025-04-10.zip' },
      { date: '2025-05-18', batteryHealthPct: 90, areaCoveredHa: 3950, dataUrl: 'dros03_flight_2025-05-18.zip' },
    ],
    soil: {
      npk: { nitrogen: 42, phosphorus: 18, potassium: 140 },
      organicMatterPct: 3.4,
      salinityDS: 0.8,
      heavyMetalsDetected: false,
      toxicityNotes: 'No salinity or heavy-metal concerns — soil chemistry supports natural canopy expansion without amendment.',
    },
    microbiome: {
      fungalToBacterialRatio: 1.1,
      microbialBiomassCarbon: 410,
      mycorrhizalSporeDensity: 86,
    },
    rehabReport: null,
    kanban: [
      { id: 'd03-1', title: 'Site prep & perimeter fencing', column: 'verified' },
      { id: 'd03-2', title: 'Seasonal drip install — yr 1', column: 'verified' },
      { id: 'd03-3', title: 'Drone Seed Bombing Run #4', column: 'verified' },
      { id: 'd03-4', title: 'Monitoring drone pass #6', column: 'in-progress' },
    ],
    resources: { seedSuppliesPct: 78, waterReservesPct: 85, machineryUptimePct: 91 },
    biomass: [
      { month: 1, actual: 1, predicted: 1 },
      { month: 3, actual: 5, predicted: 4 },
      { month: 6, actual: 13, predicted: 11 },
      { month: 12, actual: 29, predicted: 26 },
      { month: 18, actual: null, predicted: 42 },
      { month: 24, actual: null, predicted: 58 },
    ],
    dmrv: [
      { registry: 'Internal Baseline', label: 'Baseline carbon stock established', status: 'complete' },
      { registry: 'Verra VCS', label: 'Project design document (PDD) submitted', status: 'complete' },
      { registry: 'Verra VCS', label: 'Validation by approved VVB', status: 'complete' },
      { registry: 'Gold Standard', label: 'Registration', status: 'in-progress' },
    ],
    carbonSequesteredTons: 4820,
  }
]

export const activityFeedData: ActivityItem[] = [
  {
    id: 1,
    projId: 'DROS-03',
    text: 'NDVI assessment completed — score 0.47',
    time: '2 hours ago',
    type: 'success'
  },
  {
    id: 2,
    projId: 'DROS-01',
    text: 'soil treatment budget not yet assigned',
    time: '5 hours ago',
    type: 'warn'
  },
  {
    id: 3,
    projId: 'DROS-02',
    text: 'Al Kharj Farmland Buffer added to portfolio',
    time: 'Yesterday',
    type: 'info'
  },
  {
    id: 4,
    projId: 'DROS-01',
    text: 'Water infrastructure plan submitted for DROS-01',
    time: '2 days ago',
    type: 'success'
  },
  {
    id: 5,
    projId: 'DROS-02',
    text: 'Aridity index 0.01 flagged as critical on DROS-02',
    time: '3 days ago',
    type: 'danger'
  }
]
