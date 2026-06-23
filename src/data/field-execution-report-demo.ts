import type { FieldExecutionReport } from "@/data/field-execution-report"

export const DEMO_FIELD_EXECUTION_REPORT: Omit<FieldExecutionReport, "generatedAt"> = {
  docId: "DROS-FEX-2026-001",
  projectName: "New Land 1 Restoration",
  parcel: "Block A — Northern Sector",
  areaHa: 100,
  linkedPlan: "DROS-RX-2026-001",
  fieldLead: "Eng. Khalid Al-Rashidi",
  teamSize: 12,
  startDate: "2026-03-15",
  currentPhase: "Phase 1 — Soil Preparation & Amendment",

  preMobGroups: [
    {
      title: "Site Access & Safety",
      badge: "CRITICAL",
      items: [
        { id: "sa-01", title: "Gate & perimeter fence inspected", detail: "All 4,500 m confirmed intact, padlocks replaced", priority: "critical" },
        { id: "sa-02", title: "Site induction completed for all 12 crew", detail: "Signed HSE briefing sheets on file", priority: "critical" },
        { id: "sa-03", title: "Emergency evacuation route marked", detail: "GPS waypoints uploaded to site phones", priority: "critical" },
        { id: "sa-04", title: "First-aid kit & AED confirmed at site office", priority: "required" },
        { id: "sa-05", title: "Heat-stress protocol printed and posted", detail: "Mandatory 15 min shade break every 90 min above 40°C", priority: "critical" },
      ],
    },
    {
      title: "Equipment & Materials",
      badge: "REQUIRED",
      items: [
        { id: "eq-01", title: "Excavator (CAT 320) pre-start check passed", priority: "required" },
        { id: "eq-02", title: "Drip irrigation reel & fittings inventory confirmed", detail: "48 km main + 210 km laterals on-site", priority: "required" },
        { id: "eq-03", title: "Gypsum (8 t/ha) delivery receipt verified — 800 t on-site", priority: "critical" },
        { id: "eq-04", title: "Biochar (3 t/ha) cold-chain temperature log reviewed", detail: "Maintain 4–20°C; reject if >25°C for >4 hr", priority: "critical" },
        { id: "eq-05", title: "Solar pump (SQFlex) commissioning test passed", detail: "Confirm 5 kW output and battery backup 12 hr", priority: "required" },
        { id: "eq-06", title: "GPS rover calibrated and base-station set", priority: "confirm" },
      ],
    },
    {
      title: "Lab Coordination",
      badge: "CONFIRM",
      items: [
        { id: "lab-01", title: "Baseline soil samples sent to KACST lab", detail: "12 composite samples at 0–30 cm, 30–60 cm", priority: "required" },
        { id: "lab-02", title: "CoC (Chain of Custody) forms signed and copies kept on site", priority: "required" },
        { id: "lab-03", title: "Water source EC test completed — result < 6 dS/m", detail: "Reject if EC > 8 dS/m; use tanker instead", priority: "critical" },
        { id: "lab-04", title: "Amendment application rates confirmed with Site Manager", priority: "confirm" },
      ],
    },
  ],

  materialsManifest: [
    { material: "Agricultural Gypsum", orderedQty: "800 t", storage: "Covered pallet, dry area" },
    { material: "Composted Date-Palm Biochar", orderedQty: "300 t", storage: "4–20°C cold store — COLD CHAIN" },
    { material: "Mycorrhizal Inoculant (Glomus spp.)", orderedQty: "200 kg", storage: "Refrigerated 4–8°C" },
    { material: "Azospirillum Biostimulant", orderedQty: "500 L", storage: "Cool, dark store <15°C" },
    { material: "Acacia tortilis seedlings (2 yr)", orderedQty: "4,200 plants", storage: "Shade nursery, irrigate daily" },
    { material: "Haloxylon ammodendron seedlings (1 yr)", orderedQty: "6,000 plants", storage: "Shade nursery" },
    { material: "Atriplex halimus cuttings", orderedQty: "8,500 cuttings", storage: "Moist hessian wrap, plant within 72 hr" },
    { material: "Drip Irrigation Main Lines (PN6 HDPE)", orderedQty: "48 km", storage: "On-site reels, shade" },
    { material: "Drip Laterals (16 mm pressure-compensating)", orderedQty: "210 km", storage: "On-site reels" },
    { material: "Slow-Release N-P-K 15-15-15", orderedQty: "50 t", storage: "Dry warehouse, off ground" },
  ],

  amendmentLog: [
    { amendment: "Gypsum (CaSO₄·2H₂O)", rate: "8 t/ha", area: "100 ha", method: "Broadcast + rip to 60 cm", depthCm: "60" },
    { amendment: "Compost-Biochar Blend (3:1)", rate: "3 t/ha", area: "100 ha", method: "Surface broadcast + disc harrow", depthCm: "20" },
    { amendment: "Sulfur Powder", rate: "1.2 t/ha", area: "60 ha (high-pH zones)", method: "Broadcast pre-incorporation", depthCm: "30" },
    { amendment: "Mycorrhizal Inoculant", rate: "2 kg/ha", area: "100 ha", method: "Root-dip at planting + drip injection", depthCm: "0 (root zone)" },
    { amendment: "Azospirillum Biostimulant", rate: "5 L/ha", area: "100 ha", method: "Drip system injection", depthCm: "0 (via irrigation)" },
    { amendment: "N-P-K Slow-Release (basal)", rate: "0.5 t/ha", area: "100 ha", method: "Hand broadcast at planting pit", depthCm: "40" },
  ],

  plantingLog: [
    { species: "Acacia tortilis", count: 4200, spacing: "5 × 5 m", areaHa: 10.5 },
    { species: "Haloxylon ammodendron", count: 6000, spacing: "4 × 4 m", areaHa: 9.6 },
    { species: "Atriplex halimus", count: 8500, spacing: "2 × 3 m", areaHa: 5.1 },
    { species: "Prosopis cineraria", count: 2100, spacing: "7 × 7 m", areaHa: 10.3 },
    { species: "Rhanterium epapposum", count: 15000, spacing: "1.5 × 1.5 m (seeded)", areaHa: 33.8 },
    { species: "Tamarix aphylla", count: 3000, spacing: "4 × 4 m (windbreak)", areaHa: 4.8 },
  ],

  qaGates: [
    { gate: "Gate 1 — Amendment Incorporation", condition: "Post-gypsum + ripping", target: "EC < 3.0 dS/m at 30 cm", rowColor: "#fff3cd" },
    { gate: "Gate 2 — Irrigation Commission", condition: "Before planting begins", target: "All emitters flowing ±10% uniformity", rowColor: "#d1ecf1" },
    { gate: "Gate 3 — 30-Day Survival Check", condition: "30 days post-planting", target: "≥ 85% establishment rate", rowColor: "#d4edda" },
    { gate: "Gate 4 — 6-Month NDVI Baseline", condition: "Month 6", target: "NDVI ≥ 0.15 across planted zones", rowColor: "#d4edda" },
    { gate: "Gate 5 — Year 1 Carbon Audit", condition: "Month 12", target: "Biomass ≥ 1.2 t/ha aboveground", rowColor: "#f8d7da" },
  ],

  hseProtocol: [
    "Daily toolbox talk at 06:00 before work commences. Attendance mandatory.",
    "Heat-stress management: mandatory 15-minute rest in shade every 90 minutes when temperature exceeds 40°C.",
    "PPE: hard hats, steel-toe boots, hi-vis vests, gloves required at all times in active zones.",
    "Chemical handling: gypsum and sulfur dust — N95 mask + goggles mandatory during spreading.",
    "Incident reporting: any near-miss or injury logged within 1 hour in the incident register.",
    "Wildlife protocol: cease operations and contact site manager if Arabian sand gazelle or protected species observed.",
    "Fire prevention: no open flames within 200 m of plant nursery or fuel storage. Extinguisher every 50 m.",
    "Hydration: minimum 500 mL water per hour per worker during summer operations.",
  ],

  weeklyKpis: [
    { label: "Area Amended (ha)", value: "24 / 100 ha" },
    { label: "Plants Installed", value: "3,150 / 23,800" },
    { label: "Drip Line Installed (km)", value: "18 / 258 km" },
    { label: "Survival Rate (30d)", value: "91%" },
    { label: "Irrigation Events This Week", value: "5 × 4 hr cycles" },
    { label: "Soil Samples Dispatched", value: "4 composite" },
  ],

  coldChainNote:
    "Biochar and microbial inoculants require cold-chain management. Maintain 4–20°C from point of manufacture to site. Each delivery must include a temperature log. Reject any batch that has exceeded 25°C for more than 4 continuous hours — viability loss is irreversible.",

  heatStressNote:
    "Summer operations (June–September) require adjusted working hours: 05:30–10:30 and 17:00–20:00. Crew health monitoring mandatory. Stop all heavy earthworks above 45°C ambient.",

  assumptions: [
    "All amendment quantities are calibrated to 100 ha effective planting area.",
    "Planting density and spacing follow DROS-RX-2026-001 rehabilitation prescription.",
    "Water quality: brackish groundwater at EC ≤ 6 dS/m, supplemented by tanker during shortage periods.",
    "Seedling provenance: local KSA nurseries within 200 km of project site, certified disease-free.",
    "Weather: planting scheduled outside peak summer (October–April primary window).",
    "This template is pre-filled by AI from project data and requires review by the site manager before use.",
  ],
}
