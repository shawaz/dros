// Rule-based species recommendation engine for KSA desert restoration.
// Data sourced from NCWCD species reports, IUCN assessments, FAO arid-land
// afforestation guides, and published KSA field trials.

export type SpeciesType = "tree" | "shrub" | "grass" | "crop" | "mangrove"
export type SalinityTolerance = "low" | "medium" | "high"

export interface Species {
  id: string
  nameEn: string
  nameAr: string
  nameScientific: string
  type: SpeciesType
  rainfallMinMm: number
  rainfallMaxMm: number
  phMin: number
  phMax: number
  aridityMax: number
  salinityTolerance: SalinityTolerance
  waterReqM3PerTreeYr: number   // 0 = tidal/rain-fed; crops = per plant
  carbonTco2HaYr: number
  survivalBase: number
  sgiCompliant: boolean
  suitabilityNote: string
}

export interface SpeciesRecommendation {
  species: Species
  suitabilityScore: number
  survivalProbability: number
  matchReasons: string[]
  warnings: string[]
}

export interface ProjectStrategy {
  projectType: string
  sgiProgramme: string
  rationale: string
}

// ═══════════════════════════════════════════════════════════════════════════
// SPECIES DATABASE
// ═══════════════════════════════════════════════════════════════════════════

const SPECIES_DB: Species[] = [

  // ── NATIVE TREES ─────────────────────────────────────────────────────────

  {
    id: "acacia-tortilis",
    nameEn: "Umbrella Thorn Acacia", nameAr: "سَمُر", nameScientific: "Acacia tortilis",
    type: "tree", rainfallMinMm: 20, rainfallMaxMm: 600,
    phMin: 6.0, phMax: 8.5, aridityMax: 0.97, salinityTolerance: "medium",
    waterReqM3PerTreeYr: 25, carbonTco2HaYr: 3.2, survivalBase: 0.88, sgiCompliant: true,
    suitabilityNote: "Deep taproot stabilises dunes and reaches groundwater. Nitrogen-fixing. Primary SGI target species.",
  },
  {
    id: "acacia-ehrenbergiana",
    nameEn: "Salam Acacia", nameAr: "سَلَم", nameScientific: "Acacia ehrenbergiana",
    type: "tree", rainfallMinMm: 25, rainfallMaxMm: 400,
    phMin: 6.5, phMax: 8.5, aridityMax: 0.95, salinityTolerance: "medium",
    waterReqM3PerTreeYr: 20, carbonTco2HaYr: 2.7, survivalBase: 0.87, sgiCompliant: true,
    suitabilityNote: "Most widespread native acacia across all KSA eco-zones. Excellent wildlife habitat and drought tolerance.",
  },
  {
    id: "acacia-gerrardii",
    nameEn: "Red Thorn Acacia", nameAr: "طَلْح", nameScientific: "Acacia gerrardii",
    type: "tree", rainfallMinMm: 80, rainfallMaxMm: 600,
    phMin: 6.0, phMax: 8.0, aridityMax: 0.85, salinityTolerance: "low",
    waterReqM3PerTreeYr: 40, carbonTco2HaYr: 3.1, survivalBase: 0.80, sgiCompliant: true,
    suitabilityNote: "Native Asir and Hejaz highlands woodland species. Forms dense stands with high biodiversity value.",
  },
  {
    id: "acacia-asak",
    nameEn: "Asak Acacia", nameAr: "أَسَاك", nameScientific: "Acacia asak",
    type: "tree", rainfallMinMm: 30, rainfallMaxMm: 350,
    phMin: 6.5, phMax: 8.5, aridityMax: 0.93, salinityTolerance: "medium",
    waterReqM3PerTreeYr: 22, carbonTco2HaYr: 2.4, survivalBase: 0.83, sgiCompliant: true,
    suitabilityNote: "Native to Tihama coastal plains. Withstands seasonal flooding and high humidity. Good windbreak species.",
  },
  {
    id: "acacia-seyal",
    nameEn: "Shittah Tree", nameAr: "سَيَال", nameScientific: "Acacia seyal",
    type: "tree", rainfallMinMm: 60, rainfallMaxMm: 500,
    phMin: 6.0, phMax: 8.5, aridityMax: 0.88, salinityTolerance: "medium",
    waterReqM3PerTreeYr: 30, carbonTco2HaYr: 2.8, survivalBase: 0.79, sgiCompliant: true,
    suitabilityNote: "Grows on clay soils of seasonal floodplains. Tolerates waterlogging. Gum arabic source with commercial value.",
  },
  {
    id: "prosopis-cineraria",
    nameEn: "Ghaf", nameAr: "غَاف", nameScientific: "Prosopis cineraria",
    type: "tree", rainfallMinMm: 25, rainfallMaxMm: 400,
    phMin: 6.5, phMax: 9.0, aridityMax: 0.96, salinityTolerance: "high",
    waterReqM3PerTreeYr: 22, carbonTco2HaYr: 2.9, survivalBase: 0.85, sgiCompliant: true,
    suitabilityNote: "Survives on 25 mm/yr once established. Nitrogen-fixing. Thrives in arid corridors and sand plains.",
  },
  {
    id: "ziziphus-spina-christi",
    nameEn: "Sidr", nameAr: "سِدْر", nameScientific: "Ziziphus spina-christi",
    type: "tree", rainfallMinMm: 50, rainfallMaxMm: 600,
    phMin: 6.0, phMax: 8.5, aridityMax: 0.90, salinityTolerance: "medium",
    waterReqM3PerTreeYr: 35, carbonTco2HaYr: 2.5, survivalBase: 0.82, sgiCompliant: true,
    suitabilityNote: "Culturally and religiously significant. Provides shade, honey production, and wildlife habitat on wadi margins.",
  },
  {
    id: "ziziphus-nummularia",
    nameEn: "Dwarf Jujube", nameAr: "سِدْر صَغِير", nameScientific: "Ziziphus nummularia",
    type: "shrub", rainfallMinMm: 30, rainfallMaxMm: 400,
    phMin: 6.5, phMax: 9.0, aridityMax: 0.94, salinityTolerance: "medium",
    waterReqM3PerTreeYr: 10, carbonTco2HaYr: 1.2, survivalBase: 0.86, sgiCompliant: true,
    suitabilityNote: "Small multi-stemmed shrub-tree common in rocky wadis. Excellent browse for camels and goats. Very tough.",
  },
  {
    id: "salvadora-persica",
    nameEn: "Arak (Toothbrush Tree)", nameAr: "أَرَاك", nameScientific: "Salvadora persica",
    type: "tree", rainfallMinMm: 25, rainfallMaxMm: 300,
    phMin: 6.5, phMax: 9.5, aridityMax: 0.95, salinityTolerance: "high",
    waterReqM3PerTreeYr: 18, carbonTco2HaYr: 1.8, survivalBase: 0.87, sgiCompliant: true,
    suitabilityNote: "Exceptional salt tolerance. Ideal for saline, degraded soils near coastal flats and sabkha edges.",
  },
  {
    id: "balanites-aegyptiaca",
    nameEn: "Desert Date", nameAr: "هَجَلِيج", nameScientific: "Balanites aegyptiaca",
    type: "tree", rainfallMinMm: 30, rainfallMaxMm: 500,
    phMin: 6.0, phMax: 8.5, aridityMax: 0.93, salinityTolerance: "medium",
    waterReqM3PerTreeYr: 25, carbonTco2HaYr: 2.3, survivalBase: 0.82, sgiCompliant: true,
    suitabilityNote: "Multi-purpose agroforestry tree — edible fruits, medicinal oil, high-protein fodder. Excellent on wadi banks.",
  },
  {
    id: "haloxylon-persicum",
    nameEn: "White Saxaul", nameAr: "غَضَا", nameScientific: "Haloxylon persicum",
    type: "tree", rainfallMinMm: 20, rainfallMaxMm: 250,
    phMin: 7.0, phMax: 9.5, aridityMax: 0.98, salinityTolerance: "high",
    waterReqM3PerTreeYr: 12, carbonTco2HaYr: 2.4, survivalBase: 0.91, sgiCompliant: true,
    suitabilityNote: "KSA's primary sand-control tree used at national scale. Low water need. Biomass accumulates carbon rapidly in sandy substrates.",
  },
  {
    id: "tamarix-aphylla",
    nameEn: "Athel Tamarisk", nameAr: "أَثَل", nameScientific: "Tamarix aphylla",
    type: "tree", rainfallMinMm: 20, rainfallMaxMm: 350,
    phMin: 6.0, phMax: 9.5, aridityMax: 0.97, salinityTolerance: "high",
    waterReqM3PerTreeYr: 30, carbonTco2HaYr: 2.1, survivalBase: 0.90, sgiCompliant: false,
    suitabilityNote: "Fast-growing windbreak with exceptional salt tolerance. Monitor spread on non-saline sites.",
  },
  {
    id: "tamarix-nilotica",
    nameEn: "Nile Tamarisk", nameAr: "أَثَل النِّيل", nameScientific: "Tamarix nilotica",
    type: "shrub", rainfallMinMm: 20, rainfallMaxMm: 300,
    phMin: 7.0, phMax: 9.5, aridityMax: 0.96, salinityTolerance: "high",
    waterReqM3PerTreeYr: 15, carbonTco2HaYr: 1.4, survivalBase: 0.88, sgiCompliant: false,
    suitabilityNote: "Smaller than Athel. Effective pioneer on sabkha and saline wadi floors. Provides quick canopy cover.",
  },
  {
    id: "juniperus-phoenicea",
    nameEn: "Phoenician Juniper", nameAr: "عَرْعَر", nameScientific: "Juniperus phoenicea",
    type: "tree", rainfallMinMm: 150, rainfallMaxMm: 700,
    phMin: 6.0, phMax: 8.0, aridityMax: 0.65, salinityTolerance: "low",
    waterReqM3PerTreeYr: 45, carbonTco2HaYr: 4.5, survivalBase: 0.78, sgiCompliant: true,
    suitabilityNote: "Native Asir highland tree. Highest carbon rate of any KSA native. Requires >150 mm/yr or supplemental water.",
  },
  {
    id: "olea-europaea-wild",
    nameEn: "Wild Olive", nameAr: "زَيْتُون بَرِّي", nameScientific: "Olea europaea ssp. cuspidata",
    type: "tree", rainfallMinMm: 150, rainfallMaxMm: 700,
    phMin: 5.5, phMax: 8.0, aridityMax: 0.70, salinityTolerance: "low",
    waterReqM3PerTreeYr: 50, carbonTco2HaYr: 3.8, survivalBase: 0.75, sgiCompliant: true,
    suitabilityNote: "Long-lived highland native. High ecological and cultural value. Best planted above 1,500 m in Asir/Hejaz ranges.",
  },
  {
    id: "ficus-salicifolia",
    nameEn: "Willow-leaved Fig", nameAr: "تِين بَرِّي", nameScientific: "Ficus salicifolia",
    type: "tree", rainfallMinMm: 150, rainfallMaxMm: 700,
    phMin: 6.0, phMax: 8.0, aridityMax: 0.72, salinityTolerance: "low",
    waterReqM3PerTreeYr: 55, carbonTco2HaYr: 4.2, survivalBase: 0.72, sgiCompliant: true,
    suitabilityNote: "Native highland fig found in wadis and cliff faces above 1,000 m. Key keystone species for birds and pollinators.",
  },
  {
    id: "ficus-sycomorus",
    nameEn: "Sycamore Fig", nameAr: "جُمَّيْز", nameScientific: "Ficus sycomorus",
    type: "tree", rainfallMinMm: 100, rainfallMaxMm: 600,
    phMin: 6.0, phMax: 8.0, aridityMax: 0.80, salinityTolerance: "low",
    waterReqM3PerTreeYr: 60, carbonTco2HaYr: 4.8, survivalBase: 0.74, sgiCompliant: true,
    suitabilityNote: "Large spreading fig native to wadis and highland valleys. Massive canopy creates deep shade; critical habitat for bat species.",
  },
  {
    id: "moringa-peregrina",
    nameEn: "Wild Moringa (Horseradish Tree)", nameAr: "بَان", nameScientific: "Moringa peregrina",
    type: "tree", rainfallMinMm: 50, rainfallMaxMm: 400,
    phMin: 6.0, phMax: 8.5, aridityMax: 0.92, salinityTolerance: "medium",
    waterReqM3PerTreeYr: 28, carbonTco2HaYr: 2.2, survivalBase: 0.78, sgiCompliant: true,
    suitabilityNote: "Native to Hejaz mountains. Multi-purpose (food, medicine, oil). Fast-growing on rocky slopes with poor soils.",
  },
  {
    id: "maerua-crassifolia",
    nameEn: "Meru Tree", nameAr: "صَمَغ", nameScientific: "Maerua crassifolia",
    type: "tree", rainfallMinMm: 40, rainfallMaxMm: 350,
    phMin: 6.5, phMax: 8.5, aridityMax: 0.93, salinityTolerance: "medium",
    waterReqM3PerTreeYr: 22, carbonTco2HaYr: 1.9, survivalBase: 0.80, sgiCompliant: true,
    suitabilityNote: "Multi-purpose wadi tree providing shade, fodder, and food. Stabilises wadi banks and supports pastoral communities.",
  },
  {
    id: "boscia-arabica",
    nameEn: "Arabian Boscia", nameAr: "بَوْسِيَا", nameScientific: "Boscia arabica",
    type: "tree", rainfallMinMm: 40, rainfallMaxMm: 350,
    phMin: 6.5, phMax: 8.5, aridityMax: 0.92, salinityTolerance: "medium",
    waterReqM3PerTreeYr: 20, carbonTco2HaYr: 1.7, survivalBase: 0.79, sgiCompliant: true,
    suitabilityNote: "Evergreen drought-tolerant tree of rocky hillsides and sand plains. Fruits provide food for birds and wildlife.",
  },
  {
    id: "leptadenia-pyrotechnica",
    nameEn: "Markh", nameAr: "مَرْخ", nameScientific: "Leptadenia pyrotechnica",
    type: "shrub", rainfallMinMm: 20, rainfallMaxMm: 200,
    phMin: 7.0, phMax: 9.0, aridityMax: 0.97, salinityTolerance: "medium",
    waterReqM3PerTreeYr: 5, carbonTco2HaYr: 0.7, survivalBase: 0.88, sgiCompliant: true,
    suitabilityNote: "Leafless succulent shrub — photosynthesises through green stems. Excellent at fixing loose desert sands.",
  },
  {
    id: "capparis-decidua",
    nameEn: "Leafless Caper", nameAr: "شُعَيْثِل", nameScientific: "Capparis decidua",
    type: "shrub", rainfallMinMm: 30, rainfallMaxMm: 400,
    phMin: 6.5, phMax: 9.0, aridityMax: 0.93, salinityTolerance: "medium",
    waterReqM3PerTreeYr: 8, carbonTco2HaYr: 1.0, survivalBase: 0.85, sgiCompliant: true,
    suitabilityNote: "Spiny succulent shrub on gravel plains and rocky hillsides. Fruits eaten by desert wildlife; valuable nurse plant.",
  },
  {
    id: "grewia-tenax",
    nameEn: "Crossberry", nameAr: "قَرَظ", nameScientific: "Grewia tenax",
    type: "shrub", rainfallMinMm: 80, rainfallMaxMm: 500,
    phMin: 6.0, phMax: 8.5, aridityMax: 0.85, salinityTolerance: "low",
    waterReqM3PerTreeYr: 12, carbonTco2HaYr: 1.3, survivalBase: 0.78, sgiCompliant: true,
    suitabilityNote: "Multi-stemmed shrub of Asir and Tihama wadis. Edible berries attract birds. Good soil binder on slopes.",
  },
  {
    id: "terminalia-brownii",
    nameEn: "Brown's Terminalia", nameAr: "تَرْمِنَالِيَا", nameScientific: "Terminalia brownii",
    type: "tree", rainfallMinMm: 100, rainfallMaxMm: 500,
    phMin: 6.0, phMax: 8.0, aridityMax: 0.82, salinityTolerance: "low",
    waterReqM3PerTreeYr: 45, carbonTco2HaYr: 3.6, survivalBase: 0.73, sgiCompliant: true,
    suitabilityNote: "Tall deciduous tree native to southwest KSA highlands. Provides timber, shade and high wildlife value.",
  },
  {
    id: "hyphaene-thebaica",
    nameEn: "Doum Palm", nameAr: "دَوْم", nameScientific: "Hyphaene thebaica",
    type: "tree", rainfallMinMm: 30, rainfallMaxMm: 400,
    phMin: 6.5, phMax: 8.5, aridityMax: 0.94, salinityTolerance: "medium",
    waterReqM3PerTreeYr: 30, carbonTco2HaYr: 2.0, survivalBase: 0.80, sgiCompliant: true,
    suitabilityNote: "Branching palm native to KSA's western wadis. Fruits, leaves, and trunk all have traditional uses. Habitat tree for many species.",
  },
  {
    id: "faidherbia-albida",
    nameEn: "Ana Tree / Winter Thorn", nameAr: "حَرَاز", nameScientific: "Faidherbia albida",
    type: "tree", rainfallMinMm: 40, rainfallMaxMm: 500,
    phMin: 6.0, phMax: 8.5, aridityMax: 0.92, salinityTolerance: "low",
    waterReqM3PerTreeYr: 30, carbonTco2HaYr: 3.4, survivalBase: 0.77, sgiCompliant: true,
    suitabilityNote: "Reverses its leaf cycle (leafs in dry season, drops leaves in wet). Exceptional nitrogen-fixer. Boosts crop yields when intercropped.",
  },
  {
    id: "albizia-lebbeck",
    nameEn: "Woman's Tongue Tree", nameAr: "لَبَخ", nameScientific: "Albizia lebbeck",
    type: "tree", rainfallMinMm: 80, rainfallMaxMm: 600,
    phMin: 6.0, phMax: 8.5, aridityMax: 0.83, salinityTolerance: "low",
    waterReqM3PerTreeYr: 50, carbonTco2HaYr: 3.0, survivalBase: 0.76, sgiCompliant: true,
    suitabilityNote: "Fast-growing nitrogen-fixer used widely in KSA urban planting. Good shade tree and windbreak for wadi restoration.",
  },
  {
    id: "conocarpus-lancifolius",
    nameEn: "Damas Tree", nameAr: "كُنُوكَارْبُس", nameScientific: "Conocarpus lancifolius",
    type: "tree", rainfallMinMm: 50, rainfallMaxMm: 600,
    phMin: 6.5, phMax: 9.0, aridityMax: 0.90, salinityTolerance: "high",
    waterReqM3PerTreeYr: 35, carbonTco2HaYr: 2.6, survivalBase: 0.84, sgiCompliant: true,
    suitabilityNote: "Widely planted across KSA for rapid greening. Highly tolerant of saline irrigation water. Fast establishment on poor soils.",
  },
  {
    id: "calotropis-procera",
    nameEn: "Apple of Sodom", nameAr: "عُشَر", nameScientific: "Calotropis procera",
    type: "shrub", rainfallMinMm: 25, rainfallMaxMm: 500,
    phMin: 6.5, phMax: 9.5, aridityMax: 0.96, salinityTolerance: "high",
    waterReqM3PerTreeYr: 6, carbonTco2HaYr: 0.8, survivalBase: 0.92, sgiCompliant: false,
    suitabilityNote: "Extremely resilient pioneer. Stabilises bare ground quickly but can become dominant — use only as short-term cover crop.",
  },
  {
    id: "euphorbia-balsamifera",
    nameEn: "Balsam Spurge", nameAr: "إِيفُورْبِيَا", nameScientific: "Euphorbia balsamifera",
    type: "shrub", rainfallMinMm: 30, rainfallMaxMm: 300,
    phMin: 6.5, phMax: 8.5, aridityMax: 0.93, salinityTolerance: "medium",
    waterReqM3PerTreeYr: 5, carbonTco2HaYr: 0.7, survivalBase: 0.82, sgiCompliant: true,
    suitabilityNote: "Succulent shrub of rocky escarpments in Asir and Hejaz. Dense stands protect soil from erosion on slopes.",
  },
  {
    id: "avicennia-marina",
    nameEn: "Grey Mangrove", nameAr: "الشُّورَى", nameScientific: "Avicennia marina",
    type: "mangrove", rainfallMinMm: 0, rainfallMaxMm: 999,
    phMin: 6.5, phMax: 8.5, aridityMax: 0.99, salinityTolerance: "high",
    waterReqM3PerTreeYr: 0, carbonTco2HaYr: 9.5, survivalBase: 0.88, sgiCompliant: true,
    suitabilityNote: "Highest blue-carbon density in KSA. Requires tidal inundation — Red Sea or Arabian Gulf coastal sites only.",
  },

  // ── SHRUBS & SUBSHRUBS ───────────────────────────────────────────────────

  {
    id: "retama-raetam",
    nameEn: "White Weeping Broom", nameAr: "رَتَم", nameScientific: "Retama raetam",
    type: "shrub", rainfallMinMm: 50, rainfallMaxMm: 350,
    phMin: 6.5, phMax: 8.5, aridityMax: 0.90, salinityTolerance: "low",
    waterReqM3PerTreeYr: 8, carbonTco2HaYr: 0.9, survivalBase: 0.85, sgiCompliant: true,
    suitabilityNote: "Fast-establishing nitrogen-fixer. Pioneer species that reduces erosion and conditions soil for tree planting.",
  },
  {
    id: "calligonum-comosum",
    nameEn: "Abal", nameAr: "عَبَل", nameScientific: "Calligonum comosum",
    type: "shrub", rainfallMinMm: 15, rainfallMaxMm: 150,
    phMin: 7.0, phMax: 9.0, aridityMax: 0.98, salinityTolerance: "medium",
    waterReqM3PerTreeYr: 5, carbonTco2HaYr: 0.6, survivalBase: 0.92, sgiCompliant: true,
    suitabilityNote: "Extreme desert specialist. Sand-binding root system — plant first to fix dunes before trees are established.",
  },
  {
    id: "haloxylon-salicornicum",
    nameEn: "Rimth Saltbush", nameAr: "رِمْث", nameScientific: "Haloxylon salicornicum",
    type: "shrub", rainfallMinMm: 20, rainfallMaxMm: 200,
    phMin: 7.0, phMax: 9.5, aridityMax: 0.97, salinityTolerance: "high",
    waterReqM3PerTreeYr: 4, carbonTco2HaYr: 0.7, survivalBase: 0.90, sgiCompliant: true,
    suitabilityNote: "Halophyte thriving in saline, gypsiferous soils. Excellent ground cover for sabkha and coastal margin sites.",
  },
  {
    id: "dodonaea-viscosa",
    nameEn: "Hopseed Bush", nameAr: "ضَمْرَان", nameScientific: "Dodonaea viscosa",
    type: "shrub", rainfallMinMm: 100, rainfallMaxMm: 600,
    phMin: 5.5, phMax: 8.0, aridityMax: 0.80, salinityTolerance: "low",
    waterReqM3PerTreeYr: 10, carbonTco2HaYr: 1.1, survivalBase: 0.83, sgiCompliant: true,
    suitabilityNote: "Dominant understorey shrub in Asir highlands. Erosion control on steep rocky terrain. Suppresses invasive weeds.",
  },
  {
    id: "lycium-shawii",
    nameEn: "Desert Boxthorn", nameAr: "عَوْسَج", nameScientific: "Lycium shawii",
    type: "shrub", rainfallMinMm: 30, rainfallMaxMm: 250,
    phMin: 7.0, phMax: 9.0, aridityMax: 0.94, salinityTolerance: "medium",
    waterReqM3PerTreeYr: 6, carbonTco2HaYr: 0.8, survivalBase: 0.88, sgiCompliant: true,
    suitabilityNote: "Fast-spreading pioneer shrub. Spines protect young trees from grazing pressure. Excellent nurse plant for tree establishment.",
  },
  {
    id: "nitraria-retusa",
    nameEn: "Ghorda", nameAr: "غُرْدَة", nameScientific: "Nitraria retusa",
    type: "shrub", rainfallMinMm: 20, rainfallMaxMm: 200,
    phMin: 7.5, phMax: 10.0, aridityMax: 0.97, salinityTolerance: "high",
    waterReqM3PerTreeYr: 4, carbonTco2HaYr: 0.5, survivalBase: 0.89, sgiCompliant: true,
    suitabilityNote: "Extreme halophyte. One of the few species that colonises sabkha salt flats where nothing else survives.",
  },
  {
    id: "rhazya-stricta",
    nameEn: "Harmal", nameAr: "حَرْمَل", nameScientific: "Rhazya stricta",
    type: "shrub", rainfallMinMm: 30, rainfallMaxMm: 300,
    phMin: 7.0, phMax: 9.0, aridityMax: 0.93, salinityTolerance: "medium",
    waterReqM3PerTreeYr: 5, carbonTco2HaYr: 0.6, survivalBase: 0.90, sgiCompliant: true,
    suitabilityNote: "Extremely common across all KSA desert zones. Indicator species for degraded rangeland. Toxic to livestock — provides natural grazing protection.",
  },
  {
    id: "atriplex-halimus",
    nameEn: "Mediterranean Saltbush", nameAr: "قَطَف", nameScientific: "Atriplex halimus",
    type: "shrub", rainfallMinMm: 25, rainfallMaxMm: 400,
    phMin: 7.0, phMax: 9.5, aridityMax: 0.95, salinityTolerance: "high",
    waterReqM3PerTreeYr: 5, carbonTco2HaYr: 0.7, survivalBase: 0.88, sgiCompliant: true,
    suitabilityNote: "High-protein fodder shrub for camels and sheep. Widely used in KSA rangeland rehabilitation. Excellent saline soil conditioner.",
  },
  {
    id: "atriplex-leucoclada",
    nameEn: "White-stemmed Saltbush", nameAr: "قَطَف أَبْيَض", nameScientific: "Atriplex leucoclada",
    type: "shrub", rainfallMinMm: 20, rainfallMaxMm: 300,
    phMin: 7.0, phMax: 10.0, aridityMax: 0.97, salinityTolerance: "high",
    waterReqM3PerTreeYr: 4, carbonTco2HaYr: 0.6, survivalBase: 0.87, sgiCompliant: true,
    suitabilityNote: "Native saltbush better adapted to extreme KSA aridity than A. halimus. Good companion species on gypsiferous soils.",
  },
  {
    id: "senna-alexandrina",
    nameEn: "Senna", nameAr: "سَنَا", nameScientific: "Senna alexandrina",
    type: "shrub", rainfallMinMm: 40, rainfallMaxMm: 400,
    phMin: 6.5, phMax: 8.5, aridityMax: 0.90, salinityTolerance: "low",
    waterReqM3PerTreeYr: 7, carbonTco2HaYr: 0.8, survivalBase: 0.82, sgiCompliant: true,
    suitabilityNote: "Medicinal shrub native to Hijaz and Asir. Exported commercially as a laxative. Provides income for restoration communities.",
  },
  {
    id: "aerva-javanica",
    nameEn: "Kapok Bush", nameAr: "رِمَث", nameScientific: "Aerva javanica",
    type: "shrub", rainfallMinMm: 25, rainfallMaxMm: 300,
    phMin: 7.0, phMax: 9.0, aridityMax: 0.95, salinityTolerance: "medium",
    waterReqM3PerTreeYr: 4, carbonTco2HaYr: 0.5, survivalBase: 0.88, sgiCompliant: true,
    suitabilityNote: "Fluffy white-flowered shrub common on rocky desert plains. Important early-succession plant stabilising bare ground.",
  },
  {
    id: "ochradenus-baccatus",
    nameEn: "Taily Weed", nameAr: "تَلِيت", nameScientific: "Ochradenus baccatus",
    type: "shrub", rainfallMinMm: 30, rainfallMaxMm: 300,
    phMin: 7.0, phMax: 9.0, aridityMax: 0.93, salinityTolerance: "medium",
    waterReqM3PerTreeYr: 5, carbonTco2HaYr: 0.5, survivalBase: 0.86, sgiCompliant: true,
    suitabilityNote: "Aromatic shrub found in rocky wadis. Berries attract migratory birds. Useful indicator of recoverable rangeland.",
  },

  // ── GRASSES & GROUND COVERS ──────────────────────────────────────────────

  {
    id: "panicum-turgidum",
    nameEn: "Merkh Desert Grass", nameAr: "ثُمَام", nameScientific: "Panicum turgidum",
    type: "grass", rainfallMinMm: 20, rainfallMaxMm: 200,
    phMin: 7.0, phMax: 9.0, aridityMax: 0.97, salinityTolerance: "medium",
    waterReqM3PerTreeYr: 3, carbonTco2HaYr: 0.4, survivalBase: 0.94, sgiCompliant: true,
    suitabilityNote: "Critical pioneer grass planted first on bare sand to halt dune movement before woody species are introduced.",
  },
  {
    id: "cenchrus-ciliaris",
    nameEn: "Buffel Grass", nameAr: "نَجِيل", nameScientific: "Cenchrus ciliaris",
    type: "grass", rainfallMinMm: 30, rainfallMaxMm: 400,
    phMin: 6.5, phMax: 8.5, aridityMax: 0.93, salinityTolerance: "medium",
    waterReqM3PerTreeYr: 2, carbonTco2HaYr: 0.5, survivalBase: 0.93, sgiCompliant: true,
    suitabilityNote: "Fast-establishing perennial grass widely used in KSA erosion control. Excellent fodder. Monitor — can displace native species.",
  },
  {
    id: "stipagrostis-drarii",
    nameEn: "Drar Needlegrass", nameAr: "نَجْم الرِّمَال", nameScientific: "Stipagrostis drarii",
    type: "grass", rainfallMinMm: 20, rainfallMaxMm: 150,
    phMin: 7.0, phMax: 9.0, aridityMax: 0.97, salinityTolerance: "low",
    waterReqM3PerTreeYr: 2, carbonTco2HaYr: 0.3, survivalBase: 0.90, sgiCompliant: true,
    suitabilityNote: "Native sand-dune grass. The long feathery awns help seeds self-bury. Restores native grass understory lost to overgrazing.",
  },
  {
    id: "cymbopogon-schoenanthus",
    nameEn: "Camel Grass", nameAr: "إِذْخِر", nameScientific: "Cymbopogon schoenanthus",
    type: "grass", rainfallMinMm: 40, rainfallMaxMm: 350,
    phMin: 6.5, phMax: 8.5, aridityMax: 0.91, salinityTolerance: "low",
    waterReqM3PerTreeYr: 3, carbonTco2HaYr: 0.4, survivalBase: 0.85, sgiCompliant: true,
    suitabilityNote: "Aromatic native grass mentioned in Islamic texts. Produces essential oil with commercial value. Stabilises wadi floors.",
  },
  {
    id: "lasiurus-scindicus",
    nameEn: "Sewan Grass", nameAr: "ثُمَام الصَّخْرِي", nameScientific: "Lasiurus scindicus",
    type: "grass", rainfallMinMm: 30, rainfallMaxMm: 300,
    phMin: 7.0, phMax: 9.0, aridityMax: 0.94, salinityTolerance: "medium",
    waterReqM3PerTreeYr: 3, carbonTco2HaYr: 0.4, survivalBase: 0.87, sgiCompliant: true,
    suitabilityNote: "Perennial bunchgrass forming large tussocks. Excellent for rangeland restoration — provides year-round fodder for camels.",
  },
  {
    id: "pennisetum-divisum",
    nameEn: "Samer Grass", nameAr: "سَمَر العُشْب", nameScientific: "Pennisetum divisum",
    type: "grass", rainfallMinMm: 30, rainfallMaxMm: 250,
    phMin: 7.0, phMax: 8.5, aridityMax: 0.94, salinityTolerance: "medium",
    waterReqM3PerTreeYr: 2, carbonTco2HaYr: 0.3, survivalBase: 0.88, sgiCompliant: true,
    suitabilityNote: "Native bunchgrass of sandy plains. Deep roots access sub-surface moisture. Excellent companion to Panicum turgidum in early restoration.",
  },

  // ── CROPS & AGROFORESTRY ─────────────────────────────────────────────────

  {
    id: "phoenix-dactylifera",
    nameEn: "Date Palm", nameAr: "نَخِيل التَّمْر", nameScientific: "Phoenix dactylifera",
    type: "crop", rainfallMinMm: 20, rainfallMaxMm: 300,
    phMin: 7.0, phMax: 9.5, aridityMax: 0.97, salinityTolerance: "high",
    waterReqM3PerTreeYr: 55, carbonTco2HaYr: 2.8, survivalBase: 0.91, sgiCompliant: true,
    suitabilityNote: "National symbol of KSA. Thrives in extreme desert heat. Provides food, income, and dense canopy. Intercrop with vegetables in its shade.",
  },
  {
    id: "simmondsia-chinensis",
    nameEn: "Jojoba", nameAr: "جُوجُوبَا", nameScientific: "Simmondsia chinensis",
    type: "crop", rainfallMinMm: 25, rainfallMaxMm: 400,
    phMin: 6.5, phMax: 8.5, aridityMax: 0.96, salinityTolerance: "medium",
    waterReqM3PerTreeYr: 8, carbonTco2HaYr: 1.8, survivalBase: 0.88, sgiCompliant: true,
    suitabilityNote: "High-value oil crop ideal for KSA's arid conditions. Very low water requirement. Can be intercropped with native shrubs for dual income + restoration.",
  },
  {
    id: "azadirachta-indica",
    nameEn: "Neem", nameAr: "نِيم", nameScientific: "Azadirachta indica",
    type: "tree", rainfallMinMm: 50, rainfallMaxMm: 700,
    phMin: 6.0, phMax: 8.5, aridityMax: 0.88, salinityTolerance: "medium",
    waterReqM3PerTreeYr: 40, carbonTco2HaYr: 3.3, survivalBase: 0.85, sgiCompliant: false,
    suitabilityNote: "Fast-growing multi-purpose tree widely planted in KSA. Natural pesticide from seeds; excellent windbreak. Not native but well-established.",
  },
  {
    id: "olea-europaea-cultivated",
    nameEn: "Cultivated Olive", nameAr: "زَيْتُون", nameScientific: "Olea europaea ssp. europaea",
    type: "crop", rainfallMinMm: 150, rainfallMaxMm: 800,
    phMin: 5.5, phMax: 8.5, aridityMax: 0.72, salinityTolerance: "medium",
    waterReqM3PerTreeYr: 45, carbonTco2HaYr: 2.5, survivalBase: 0.80, sgiCompliant: true,
    suitabilityNote: "Major KSA agricultural crop in Al-Jouf and Tabuk regions. Long-lived (1,000+ years). Agroforestry with restoration trees increases yield stability.",
  },
  {
    id: "pistacia-vera",
    nameEn: "Pistachio", nameAr: "فُسْتُق", nameScientific: "Pistacia vera",
    type: "crop", rainfallMinMm: 150, rainfallMaxMm: 600,
    phMin: 6.5, phMax: 8.0, aridityMax: 0.75, salinityTolerance: "medium",
    waterReqM3PerTreeYr: 50, carbonTco2HaYr: 2.2, survivalBase: 0.74, sgiCompliant: false,
    suitabilityNote: "Drought-tolerant nut tree grown in northern KSA (Tabuk, Al-Jouf). High economic return. Needs cold winters for dormancy.",
  },
  {
    id: "punica-granatum",
    nameEn: "Pomegranate", nameAr: "رُمَّان", nameScientific: "Punica granatum",
    type: "crop", rainfallMinMm: 100, rainfallMaxMm: 600,
    phMin: 5.5, phMax: 8.0, aridityMax: 0.83, salinityTolerance: "medium",
    waterReqM3PerTreeYr: 40, carbonTco2HaYr: 1.8, survivalBase: 0.80, sgiCompliant: false,
    suitabilityNote: "Ancient KSA fruit tree — traditionally grown in Asir, Taif, and Al-Baha. Tolerates heat and moderate drought. Good agroforestry component.",
  },
  {
    id: "ficus-carica",
    nameEn: "Common Fig", nameAr: "تِين", nameScientific: "Ficus carica",
    type: "crop", rainfallMinMm: 150, rainfallMaxMm: 700,
    phMin: 6.0, phMax: 8.0, aridityMax: 0.75, salinityTolerance: "low",
    waterReqM3PerTreeYr: 50, carbonTco2HaYr: 2.0, survivalBase: 0.77, sgiCompliant: false,
    suitabilityNote: "Cultivated in Taif and Asir since antiquity. Extremely drought-tolerant once established. Deep roots tap groundwater in wadi systems.",
  },
  {
    id: "ceratonia-siliqua",
    nameEn: "Carob", nameAr: "خَرُّوب", nameScientific: "Ceratonia siliqua",
    type: "crop", rainfallMinMm: 100, rainfallMaxMm: 600,
    phMin: 6.0, phMax: 8.5, aridityMax: 0.80, salinityTolerance: "medium",
    waterReqM3PerTreeYr: 35, carbonTco2HaYr: 2.3, survivalBase: 0.78, sgiCompliant: false,
    suitabilityNote: "Extremely long-lived Mediterranean crop tree. Pods high in sugar and protein — livestock feed and food processing. Thrives with minimal water once established.",
  },
  {
    id: "tamarindus-indica",
    nameEn: "Tamarind", nameAr: "تَمَر هِنْدِي", nameScientific: "Tamarindus indica",
    type: "crop", rainfallMinMm: 80, rainfallMaxMm: 600,
    phMin: 6.0, phMax: 8.5, aridityMax: 0.86, salinityTolerance: "low",
    waterReqM3PerTreeYr: 45, carbonTco2HaYr: 2.4, survivalBase: 0.76, sgiCompliant: false,
    suitabilityNote: "Large shade tree grown in Jizan and Tihama lowlands. Pods widely used in KSA cuisine. Deep roots stabilise wadi banks.",
  },
  {
    id: "mangifera-indica",
    nameEn: "Mango", nameAr: "مَانْجُو", nameScientific: "Mangifera indica",
    type: "crop", rainfallMinMm: 200, rainfallMaxMm: 999,
    phMin: 5.5, phMax: 7.5, aridityMax: 0.70, salinityTolerance: "low",
    waterReqM3PerTreeYr: 80, carbonTco2HaYr: 3.5, survivalBase: 0.75, sgiCompliant: false,
    suitabilityNote: "Commercial crop in Jizan region (high humidity, rainfall). Large canopy sequesters significant carbon. Requires humid coastal conditions.",
  },
  {
    id: "psidium-guajava",
    nameEn: "Guava", nameAr: "جُوَافَة", nameScientific: "Psidium guajava",
    type: "crop", rainfallMinMm: 150, rainfallMaxMm: 999,
    phMin: 5.0, phMax: 8.0, aridityMax: 0.75, salinityTolerance: "medium",
    waterReqM3PerTreeYr: 45, carbonTco2HaYr: 2.0, survivalBase: 0.78, sgiCompliant: false,
    suitabilityNote: "Fast-fruiting tropical tree grown in Jizan and Asir valleys. Tolerates short dry spells. Dense canopy restores ground biodiversity.",
  },
  {
    id: "musa-acuminata",
    nameEn: "Banana", nameAr: "مَوْز", nameScientific: "Musa acuminata",
    type: "crop", rainfallMinMm: 300, rainfallMaxMm: 999,
    phMin: 5.5, phMax: 7.5, aridityMax: 0.65, salinityTolerance: "low",
    waterReqM3PerTreeYr: 100, carbonTco2HaYr: 1.5, survivalBase: 0.80, sgiCompliant: false,
    suitabilityNote: "Grown in Jizan's humid coastal strip and sheltered Asir valleys. Provides rapid ground cover and food security. Needs reliable water supply.",
  },
  {
    id: "carica-papaya",
    nameEn: "Papaya", nameAr: "بَابَايَا", nameScientific: "Carica papaya",
    type: "crop", rainfallMinMm: 200, rainfallMaxMm: 999,
    phMin: 5.5, phMax: 7.5, aridityMax: 0.68, salinityTolerance: "low",
    waterReqM3PerTreeYr: 60, carbonTco2HaYr: 1.2, survivalBase: 0.77, sgiCompliant: false,
    suitabilityNote: "Fast-growing fruit tree suited to Jizan and Asir lowlands. Short lifespan but provides rapid canopy and income within first year of planting.",
  },
  {
    id: "aloe-vera",
    nameEn: "Aloe Vera", nameAr: "صَبَّار", nameScientific: "Aloe vera",
    type: "crop", rainfallMinMm: 20, rainfallMaxMm: 400,
    phMin: 7.0, phMax: 9.0, aridityMax: 0.96, salinityTolerance: "medium",
    waterReqM3PerTreeYr: 2, carbonTco2HaYr: 0.3, survivalBase: 0.95, sgiCompliant: false,
    suitabilityNote: "Extremely drought-tolerant medicinal and cosmetics crop. Thrives across all KSA zones. High export value. Ideal intercrop under date palms.",
  },
  {
    id: "lawsonia-inermis",
    nameEn: "Henna", nameAr: "حِنَّاء", nameScientific: "Lawsonia inermis",
    type: "crop", rainfallMinMm: 40, rainfallMaxMm: 500,
    phMin: 6.5, phMax: 8.5, aridityMax: 0.91, salinityTolerance: "medium",
    waterReqM3PerTreeYr: 15, carbonTco2HaYr: 1.0, survivalBase: 0.83, sgiCompliant: false,
    suitabilityNote: "Traditional KSA shrub-tree with high cultural value. Grown in Jizan, Asir, and Medina. Leaves harvested for dye. Provides windbreak and ground cover.",
  },
  {
    id: "sorghum-bicolor",
    nameEn: "Sorghum", nameAr: "ذُرَة", nameScientific: "Sorghum bicolor",
    type: "crop", rainfallMinMm: 300, rainfallMaxMm: 999,
    phMin: 5.5, phMax: 8.5, aridityMax: 0.78, salinityTolerance: "medium",
    waterReqM3PerTreeYr: 5, carbonTco2HaYr: 0.8, survivalBase: 0.85, sgiCompliant: false,
    suitabilityNote: "Major food and fodder crop in Asir and Jizan. Traditional terrace cultivation on Asir mountain slopes. Provides fast seasonal canopy cover.",
  },
  {
    id: "pennisetum-glaucum",
    nameEn: "Pearl Millet", nameAr: "دُخْن", nameScientific: "Pennisetum glaucum",
    type: "crop", rainfallMinMm: 200, rainfallMaxMm: 700,
    phMin: 5.5, phMax: 8.0, aridityMax: 0.85, salinityTolerance: "medium",
    waterReqM3PerTreeYr: 3, carbonTco2HaYr: 0.7, survivalBase: 0.87, sgiCompliant: false,
    suitabilityNote: "Most drought-tolerant grain crop. Staple in southwestern KSA. Short growing season allows double-cropping. Excellent soil organic matter builder.",
  },
  {
    id: "sesamum-indicum",
    nameEn: "Sesame", nameAr: "سِمْسِم", nameScientific: "Sesamum indicum",
    type: "crop", rainfallMinMm: 300, rainfallMaxMm: 700,
    phMin: 5.5, phMax: 8.0, aridityMax: 0.80, salinityTolerance: "low",
    waterReqM3PerTreeYr: 4, carbonTco2HaYr: 0.5, survivalBase: 0.82, sgiCompliant: false,
    suitabilityNote: "Ancient KSA oil crop grown in Tihama coastal plains. Thrives in hot, humid conditions with summer rainfall. High oil content with export value.",
  },
  {
    id: "citrullus-lanatus",
    nameEn: "Watermelon", nameAr: "بِطِّيخ", nameScientific: "Citrullus lanatus",
    type: "crop", rainfallMinMm: 200, rainfallMaxMm: 999,
    phMin: 6.0, phMax: 7.5, aridityMax: 0.80, salinityTolerance: "medium",
    waterReqM3PerTreeYr: 6, carbonTco2HaYr: 0.3, survivalBase: 0.84, sgiCompliant: false,
    suitabilityNote: "Originally domesticated in northeast Africa — one of the most drought-adapted vegetables. Common in Jizan and Tihama. Fast ground-cover crop between tree rows.",
  },
  {
    id: "vigna-unguiculata",
    nameEn: "Black-eyed Pea (Cowpea)", nameAr: "لُوبِيَا", nameScientific: "Vigna unguiculata",
    type: "crop", rainfallMinMm: 200, rainfallMaxMm: 700,
    phMin: 5.5, phMax: 8.5, aridityMax: 0.83, salinityTolerance: "medium",
    waterReqM3PerTreeYr: 3, carbonTco2HaYr: 0.6, survivalBase: 0.88, sgiCompliant: false,
    suitabilityNote: "Nitrogen-fixing legume crop grown across southwestern KSA. Intercropping with restoration trees improves soil fertility rapidly.",
  },
  {
    id: "hordeum-vulgare",
    nameEn: "Barley", nameAr: "شَعِير", nameScientific: "Hordeum vulgare",
    type: "crop", rainfallMinMm: 150, rainfallMaxMm: 600,
    phMin: 6.0, phMax: 8.5, aridityMax: 0.82, salinityTolerance: "high",
    waterReqM3PerTreeYr: 4, carbonTco2HaYr: 0.6, survivalBase: 0.84, sgiCompliant: false,
    suitabilityNote: "Most salt and drought-tolerant cereal. Historically grown in northern KSA. Useful short-cycle cover crop to build soil organic matter before tree planting.",
  },
  {
    id: "capparis-spinosa",
    nameEn: "Caper Plant", nameAr: "كَبَّار", nameScientific: "Capparis spinosa",
    type: "crop", rainfallMinMm: 30, rainfallMaxMm: 400,
    phMin: 6.5, phMax: 9.0, aridityMax: 0.94, salinityTolerance: "medium",
    waterReqM3PerTreeYr: 5, carbonTco2HaYr: 0.7, survivalBase: 0.86, sgiCompliant: true,
    suitabilityNote: "Drought-resistant perennial whose flower buds are harvested as capers. Excellent for rocky hillside restoration with commercial harvest potential.",
  },
]

// ═══════════════════════════════════════════════════════════════════════════
// SCORING ENGINE
// ═══════════════════════════════════════════════════════════════════════════

function clamp(v: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, v))
}

function rainfallScore(sp: Species, rainfall: number): number {
  if (rainfall >= sp.rainfallMinMm && rainfall <= sp.rainfallMaxMm) return 1.0
  if (rainfall < sp.rainfallMinMm) {
    return clamp(1 - (sp.rainfallMinMm - rainfall) / sp.rainfallMinMm)
  }
  return clamp(1 - (rainfall - sp.rainfallMaxMm) / sp.rainfallMaxMm * 0.4)
}

function phScore(sp: Species, ph: number | null | undefined): number {
  if (ph == null) return 0.75
  if (ph >= sp.phMin && ph <= sp.phMax) return 1.0
  const dist = Math.min(Math.abs(ph - sp.phMin), Math.abs(ph - sp.phMax))
  return clamp(1 - dist / 2.5)
}

function aridityScore(sp: Species, aridity: number): number {
  if (aridity <= sp.aridityMax) return 1.0
  return clamp(1 - (aridity - sp.aridityMax) / (1 - sp.aridityMax))
}

function isCoastal(lat: number, lng: number): boolean {
  const redSea = lng >= 35 && lng <= 42.5 && lat >= 15 && lat <= 29
  const gulf   = lng >= 47 && lng <= 57 && lat >= 24 && lat <= 30
  return redSea || gulf
}

export interface RecommenderInput {
  lat: number
  lng: number
  rainfall: number
  aridity: number
  ph?: number | null
  ndvi?: number | null
  health?: number | null
}

export function recommendSpecies(input: RecommenderInput, topK = 5): SpeciesRecommendation[] {
  const coastal = isCoastal(input.lat, input.lng)
  const results: SpeciesRecommendation[] = []

  for (const sp of SPECIES_DB) {
    if (sp.type === "mangrove" && !coastal) continue

    const rf  = rainfallScore(sp, input.rainfall)
    const ph  = phScore(sp, input.ph)
    const ari = aridityScore(sp, input.aridity)

    const score    = sp.survivalBase * (0.45 * rf + 0.30 * ari + 0.25 * ph)
    const survival = clamp(sp.survivalBase * (0.50 * rf + 0.30 * ari + 0.20 * ph))

    const matchReasons: string[] = []
    const warnings: string[]     = []

    if (rf >= 0.9)  matchReasons.push(`Rainfall ${input.rainfall} mm/yr within ideal range`)
    else if (rf < 0.5) warnings.push(`Rainfall below preferred minimum (${sp.rainfallMinMm} mm) — irrigation needed`)

    if (ari >= 0.9) matchReasons.push(`Drought tolerance matches site aridity (${input.aridity.toFixed(2)})`)
    if (ari < 0.5)  warnings.push("Site may be too dry — supplemental irrigation recommended for establishment")

    if (input.ph != null && ph >= 0.95) matchReasons.push(`Soil pH ${input.ph.toFixed(1)} optimal`)
    if (sp.sgiCompliant) matchReasons.push("Saudi Green Initiative compliant")
    if (sp.salinityTolerance === "high") matchReasons.push("High salinity tolerance suits regional soils")
    if (sp.type === "mangrove" && coastal) matchReasons.push("Coastal site matches tidal habitat requirement")
    if (sp.type === "crop") matchReasons.push("Provides economic return supporting community-led restoration")

    results.push({
      species: sp,
      suitabilityScore: clamp(score),
      survivalProbability: survival,
      matchReasons: matchReasons.slice(0, 3),
      warnings,
    })
  }

  return results.sort((a, b) => b.suitabilityScore - a.suitabilityScore).slice(0, topK)
}

// Return all species of a given type, still scored by site conditions
export function recommendByType(input: RecommenderInput, type: SpeciesType): SpeciesRecommendation[] {
  const all = recommendSpecies({ ...input }, SPECIES_DB.length)
  return all.filter((r) => r.species.type === type)
}

// ═══════════════════════════════════════════════════════════════════════════
// PROJECT STRATEGY
// ═══════════════════════════════════════════════════════════════════════════

export function recommendStrategy(input: RecommenderInput): ProjectStrategy {
  const coastal = isCoastal(input.lat, input.lng)

  if (coastal) {
    return {
      projectType: "Mangrove & Coastal Restoration",
      sgiProgramme: "Coastal Ecosystem Programme",
      rationale: "Coastal location is suitable for mangrove afforestation (blue carbon) and shoreline stabilisation.",
    }
  }
  if (input.rainfall >= 200) {
    return {
      projectType: "Native Forest Restoration",
      sgiProgramme: "National Forests Programme",
      rationale: `Rainfall (${input.rainfall} mm/yr) supports multi-species afforestation with native highland trees.`,
    }
  }
  if (input.rainfall >= 80) {
    return {
      projectType: "Rangeland & Wadi Rehabilitation",
      sgiProgramme: "Rangeland Rehabilitation Programme",
      rationale: `Moderate rainfall (${input.rainfall} mm/yr) with wadi water harvesting can support shrub–tree mosaic restoration.`,
    }
  }
  if (input.aridity >= 0.90) {
    return {
      projectType: "Sand Dune Stabilisation",
      sgiProgramme: "Anti-desertification Programme",
      rationale: `High aridity (${input.aridity.toFixed(2)}) and low rainfall (${input.rainfall} mm/yr) indicate active desertification — pioneer grasses first, then shrubs, then trees.`,
    }
  }
  return {
    projectType: "Arid Land Afforestation Corridor",
    sgiProgramme: "Anti-desertification Programme",
    rationale: "Semi-arid site suitable for drought-tolerant tree corridors connecting existing vegetation patches.",
  }
}
