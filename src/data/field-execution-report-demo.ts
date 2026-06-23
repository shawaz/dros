import type { FieldExecutionReport } from "@/data/field-execution-report"

// Canonical DROS-FEX-2026-001 content, transcribed from
// ~/Downloads/DROS Field Execution Template.html. Cover fields are overlaid
// with the live project; the rest is fixed DROS field protocol.
export const DEMO_FIELD_EXECUTION_REPORT: Omit<FieldExecutionReport, "generatedAt"> = {
  docId: "DROS-FEX-2026-001",

  projectName: "—",
  subtitle:
    "Operational field document for rehabilitation crews — checklists, daily logs, amendment records, planting sheets, QA checkpoints, and HSE protocols. Print and carry to site.",
  parcel: "Northern Parcel",
  areaHa: 100,
  linkedPlan: "DROS-RPL-2026-001",
  fieldLead: "—",
  teamSize: "—",
  startDate: "—",
  currentPhase: "Phase 1 — Site prep",

  preMobGroups: [
    {
      title: "Site access & safety",
      badge: "CRITICAL",
      badgeStatus: "crit",
      items: [
        { title: "Land access permit secured from landowner / MEWA", detail: "Written authorization with parcel ID, date range, and permitted activities" },
        { title: "HSE risk assessment completed and signed", detail: "Heat stress protocol, first aid location, emergency contacts, nearest hospital identified" },
        { title: "Vehicle access route confirmed — 4WD clearance verified", detail: "GPS coordinates of access point. Alternative route identified for wet conditions." },
        { title: "Communications verified — mobile signal or satellite phone available", detail: "Test at site. If no signal, deploy satellite communicator (Garmin InReach or equivalent)." },
      ],
    },
    {
      title: "Equipment & materials on site",
      badge: "REQUIRED",
      badgeStatus: "warn",
      items: [
        { title: "GPS unit charged and calibrated (Trimble R2 or equivalent · ±3 m)" },
        { title: "pH/EC field meter calibrated (Hanna HI98195 or equiv.) — calibration date: ___/___/______" },
        { title: "Soil auger (stainless steel, not galvanized) + depth ruler + sampling bags", detail: "15–20 × sterile 250 ml zip-locks per depth per point · Pre-printed labels · Permanent marker" },
        { title: "Cooler box + ice packs for microbial samples (maintain 4°C)", detail: "Sterile 50 ml Falcon tubes × 20 · Nitrile gloves (change between points)" },
        { title: "Camera (or phone) for photo documentation — GPS-tagged photos" },
        { title: "Munsell soil colour chart" },
        { title: "Printed field maps with sample point GPS coordinates marked" },
        { title: "Amendment materials confirmed delivered and stored on site", detail: "Gypsum · Sulfur · Biochar · Compost · AMF inoculant (cold storage!) · WaterLock · NPK" },
      ],
    },
    {
      title: "Lab coordination",
      badge: "CONFIRM",
      badgeStatus: "info",
      items: [
        { title: "Chemical lab courier booked — delivery within 7 days", detail: "Lab: _______________ · Contact: _______________ · Booking ref: _______________" },
        { title: "Microbial lab courier booked — delivery within 24–48 hours", detail: "Lab: _______________ · Contact: _______________ · Cold chain confirmed" },
        { title: "Chain of custody forms printed (CoC-SBA-___-A through ___)" },
      ],
    },
  ],
  preMobTotal: 15,

  materials: [
    { material: "Gypsum (ag-grade)", ordered: "550 t" },
    { material: "Elemental sulfur", ordered: "250 t" },
    { material: "Biochar (IBI-cert)", ordered: "1,500 t" },
    { material: "Compost (date palm)", ordered: "2,000 t" },
    { material: "AMF inoculant", ordered: "700 kg", storage: "4–15°C" },
    { material: "WaterLock KPA", ordered: "5,000 kg" },
    { material: "Rhizobium inoculant", ordered: "50 kg", storage: "4–8°C" },
    { material: "Cyanobacteria (Nostoc)", ordered: "300 kg" },
    { material: "Humic acid (K-humate)", ordered: "2,500 kg" },
    { material: "NPK + micronutrients", ordered: "Various" },
  ],
  coldChainNote:
    "Cold chain critical: AMF inoculant must be stored at 4–15°C. Rhizobium at 4–8°C. Verify cold storage on arrival. Record temperature at delivery. If above 20°C for >4 hours, reject the batch.",

  amendmentGateNote:
    "After gypsum + flush: Retest EC at 5 points. All results must show EC <3.0 dS/m and SAR <13. Record results below. If ANY point fails, repeat flush on that zone before proceeding.",

  plantingQaNote:
    "Planting QA checklist per tree: (1) Pit 50×50×50 cm ✓ (2) Amended backfill ✓ (3) AMF 10–15 g at 5–10 cm ✓ (4) WaterLock 5–10 g at 20–30 cm ✓ (5) Shade shelter installed ✓ (6) Drip emitter connected ✓ (7) GPS coordinate logged ✓",

  irrigationChecklist: [
    { title: "72-hour pump test completed — yield: _______ m³/hr", detail: "Must exceed 5 m³/hr. If below, identify backup water source before proceeding." },
    { title: "Water quality tested — EC: _______ dS/m · pH: _______", detail: "If EC >3.0 dS/m, blending with rainwater is mandatory. Record values." },
    { title: "Storage tanks installed and tested — capacity: _______ m³" },
    { title: "Subsurface drip network pressure test — all zones ≥1.0 bar" },
    { title: "Emitter uniformity test — coefficient of uniformity >85%" },
    { title: "Filtration system installed — disc/mesh filter rated for sandy water" },
    { title: "Timer/controller programmed — daily schedule for establishment phase" },
  ],

  samplingNote:
    "Microbial samples are time-critical. Pull the 100 g sub-sample BEFORE mixing the composite. Place in sterile Falcon tube. On ice within 2 hours. Deliver to lab within 24–48 hours. Do NOT freeze unless lab requests it.",

  qaGates: [
    { gate: "G1", condition: "EC after gypsum flush", target: "<3.0 dS/m", targetColor: "crit" },
    { gate: "G1", condition: "SAR after gypsum flush", target: "<13", targetColor: "crit" },
    { gate: "G2", condition: "pH after sulfur treatment", target: "<7.8", targetColor: "warn" },
    { gate: "G3", condition: "Soil moisture pre-planting", target: ">0.08 at 20 cm", targetColor: "info" },
    { gate: "G4", condition: "Seedling survival (month 6)", target: ">70%", targetColor: "ok" },
    { gate: "G5", condition: "NDVI trend (month 12)", target: "Upward", targetColor: "ok" },
  ],

  hseHeatNote:
    "Heat stress protocol: Field work suspended when ambient temperature exceeds 45°C. Mandatory 15-minute hydration break every 60 minutes when temperature exceeds 38°C. All crew must carry minimum 3L water per person.",
  hseBriefing: [
    { title: "All crew briefed on today's tasks and hazards" },
    { title: "PPE verified: hard hat, steel-toe boots, gloves, sun protection, hi-vis vest" },
    { title: "First aid kit checked and complete — location: _______________" },
    { title: "Emergency contact numbers confirmed — nearest hospital: _______________" },
    { title: "Dust masks available for sulfur / biochar spreading operations" },
    { title: "Vehicle inspection completed — fuel, tires, coolant, recovery equipment" },
  ],

  disclaimerBody:
    "This field execution template is part of the DROS rehabilitation management system. All data recorded in this document forms part of the project's chain of custody for carbon credit verification (Verra VCS / SAVCM). Falsification of field records invalidates carbon credit claims for the entire crediting period. Store completed forms securely and upload digital copies to the DROS platform within 48 hours of field activity.",
  disclaimerFooter:
    "Template: DROS-FEX-2026-001 · Version: 1.0 · Linked plan: RPL-2026-001 · Print for field use",
}
