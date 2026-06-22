"use client"

import React, { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { LabReport, MicrobialLevel, RunoffPotential, DetectedMicrobe } from "@/data/lab-report"

interface LabReportFormProps {
  initial: LabReport | null
  submitting: boolean
  onCancel: () => void
  onSubmit: (report: LabReport) => void
}

function toNum(s: string): number {
  if (s.trim() === "") return 0
  const n = Number(s)
  return Number.isFinite(n) ? n : 0
}

interface PhysicalForm {
  enabled: boolean
  texture: string
  sandPct: string
  siltPct: string
  clayPct: string
  bulkDensityGCm3: string
  waterHoldingCapacityPct: string
  infiltrationRateMmHr: string
}

interface ChemicalForm {
  enabled: boolean
  ph: string
  ecDsM: string
  organicMatterPct: string
  totalNitrogenPct: string
  phosphorusPpm: string
  potassiumPpm: string
  calciumPpm: string
  magnesiumPpm: string
  sodiumPpm: string
}

interface CarbonForm {
  enabled: boolean
  socPct: string
  currentStockTco2eHa: string
  targetStockMinTco2eHa: string
  targetStockMaxTco2eHa: string
}

interface MicrobialForm {
  enabled: boolean
  biomassCarbon: MicrobialLevel
  bacterialDiversity: MicrobialLevel
  fungalDiversity: MicrobialLevel
  nitrogenFixers: MicrobialLevel
  cyanobacteriaPresence: MicrobialLevel
  mycorrhizalFungi: MicrobialLevel
  detectedSpecies: DetectedMicrobe[]
}

interface WaterForm {
  enabled: boolean
  groundwaterDepthM: string
  groundwaterEcDsM: string
  annualRainfallMm: string
  runoffCapturePotential: RunoffPotential
  floodEventsMinPerYear: string
  floodEventsMaxPerYear: string
}

function initPhysical(d: LabReport["physical"]): PhysicalForm {
  return d
    ? { enabled: true, texture: d.texture, sandPct: String(d.sandPct), siltPct: String(d.siltPct), clayPct: String(d.clayPct), bulkDensityGCm3: String(d.bulkDensityGCm3), waterHoldingCapacityPct: String(d.waterHoldingCapacityPct), infiltrationRateMmHr: String(d.infiltrationRateMmHr) }
    : { enabled: false, texture: "", sandPct: "", siltPct: "", clayPct: "", bulkDensityGCm3: "", waterHoldingCapacityPct: "", infiltrationRateMmHr: "" }
}

function initChemical(d: LabReport["chemical"]): ChemicalForm {
  return d
    ? { enabled: true, ph: String(d.ph), ecDsM: String(d.ecDsM), organicMatterPct: String(d.organicMatterPct), totalNitrogenPct: String(d.totalNitrogenPct), phosphorusPpm: String(d.phosphorusPpm), potassiumPpm: String(d.potassiumPpm), calciumPpm: String(d.calciumPpm), magnesiumPpm: String(d.magnesiumPpm), sodiumPpm: String(d.sodiumPpm) }
    : { enabled: false, ph: "", ecDsM: "", organicMatterPct: "", totalNitrogenPct: "", phosphorusPpm: "", potassiumPpm: "", calciumPpm: "", magnesiumPpm: "", sodiumPpm: "" }
}

function initCarbon(d: LabReport["carbon"]): CarbonForm {
  return d
    ? { enabled: true, socPct: String(d.socPct), currentStockTco2eHa: String(d.currentStockTco2eHa), targetStockMinTco2eHa: String(d.targetStockMinTco2eHa), targetStockMaxTco2eHa: String(d.targetStockMaxTco2eHa) }
    : { enabled: false, socPct: "", currentStockTco2eHa: "", targetStockMinTco2eHa: "", targetStockMaxTco2eHa: "" }
}

function initMicrobial(d: LabReport["microbial"]): MicrobialForm {
  return d
    ? { enabled: true, biomassCarbon: d.biomassCarbon, bacterialDiversity: d.bacterialDiversity, fungalDiversity: d.fungalDiversity, nitrogenFixers: d.nitrogenFixers, cyanobacteriaPresence: d.cyanobacteriaPresence, mycorrhizalFungi: d.mycorrhizalFungi, detectedSpecies: d.detectedSpecies }
    : { enabled: false, biomassCarbon: "low", bacterialDiversity: "low", fungalDiversity: "low", nitrogenFixers: "low", cyanobacteriaPresence: "low", mycorrhizalFungi: "low", detectedSpecies: [] }
}

function initWater(d: LabReport["water"]): WaterForm {
  return d
    ? { enabled: true, groundwaterDepthM: String(d.groundwaterDepthM), groundwaterEcDsM: String(d.groundwaterEcDsM), annualRainfallMm: String(d.annualRainfallMm), runoffCapturePotential: d.runoffCapturePotential, floodEventsMinPerYear: String(d.floodEventsMinPerYear), floodEventsMaxPerYear: String(d.floodEventsMaxPerYear) }
    : { enabled: false, groundwaterDepthM: "", groundwaterEcDsM: "", annualRainfallMm: "", runoffCapturePotential: "moderate", floodEventsMinPerYear: "", floodEventsMaxPerYear: "" }
}

const MICROBIAL_LEVELS: MicrobialLevel[] = ["absent", "trace", "rare", "low", "moderate", "high"]

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <label className="text-[11px] font-semibold text-muted-custom tracking-wider uppercase mb-1 block">{label}</label>
    {children}
  </div>
)

const SectionCard: React.FC<{ title: string; enabled: boolean; onToggle: (v: boolean) => void; children: React.ReactNode }> = ({
  title,
  enabled,
  onToggle,
  children,
}) => (
  <div className="bg-white border border-border rounded-xl p-5">
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-sans text-sm font-semibold text-ink">{title}</h3>
      <label className="flex items-center gap-1.5 text-xs text-muted-custom cursor-pointer select-none">
        <input type="checkbox" checked={enabled} onChange={(e) => onToggle(e.target.checked)} className="accent-green-custom" />
        Section has data
      </label>
    </div>
    {enabled && children}
  </div>
)

export const LabReportForm: React.FC<LabReportFormProps> = ({ initial, submitting, onCancel, onSubmit }) => {
  const [physical, setPhysical] = useState<PhysicalForm>(() => initPhysical(initial?.physical ?? null))
  const [chemical, setChemical] = useState<ChemicalForm>(() => initChemical(initial?.chemical ?? null))
  const [carbon, setCarbon] = useState<CarbonForm>(() => initCarbon(initial?.carbon ?? null))
  const [microbial, setMicrobial] = useState<MicrobialForm>(() => initMicrobial(initial?.microbial ?? null))
  const [water, setWater] = useState<WaterForm>(() => initWater(initial?.water ?? null))

  const updateSpecies = (index: number, field: keyof DetectedMicrobe, value: string) => {
    setMicrobial((m) => ({
      ...m,
      detectedSpecies: m.detectedSpecies.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    }))
  }

  const handleSubmit = () => {
    const report: LabReport = {
      physical: physical.enabled
        ? {
            texture: physical.texture,
            sandPct: toNum(physical.sandPct),
            siltPct: toNum(physical.siltPct),
            clayPct: toNum(physical.clayPct),
            bulkDensityGCm3: toNum(physical.bulkDensityGCm3),
            waterHoldingCapacityPct: toNum(physical.waterHoldingCapacityPct),
            infiltrationRateMmHr: toNum(physical.infiltrationRateMmHr),
          }
        : null,
      chemical: chemical.enabled
        ? {
            ph: toNum(chemical.ph),
            ecDsM: toNum(chemical.ecDsM),
            organicMatterPct: toNum(chemical.organicMatterPct),
            totalNitrogenPct: toNum(chemical.totalNitrogenPct),
            phosphorusPpm: toNum(chemical.phosphorusPpm),
            potassiumPpm: toNum(chemical.potassiumPpm),
            calciumPpm: toNum(chemical.calciumPpm),
            magnesiumPpm: toNum(chemical.magnesiumPpm),
            sodiumPpm: toNum(chemical.sodiumPpm),
          }
        : null,
      carbon: carbon.enabled
        ? {
            socPct: toNum(carbon.socPct),
            currentStockTco2eHa: toNum(carbon.currentStockTco2eHa),
            targetStockMinTco2eHa: toNum(carbon.targetStockMinTco2eHa),
            targetStockMaxTco2eHa: toNum(carbon.targetStockMaxTco2eHa),
          }
        : null,
      microbial: microbial.enabled
        ? {
            biomassCarbon: microbial.biomassCarbon,
            bacterialDiversity: microbial.bacterialDiversity,
            fungalDiversity: microbial.fungalDiversity,
            nitrogenFixers: microbial.nitrogenFixers,
            cyanobacteriaPresence: microbial.cyanobacteriaPresence,
            mycorrhizalFungi: microbial.mycorrhizalFungi,
            detectedSpecies: microbial.detectedSpecies.filter((s) => s.species.trim() !== ""),
          }
        : null,
      water: water.enabled
        ? {
            groundwaterDepthM: toNum(water.groundwaterDepthM),
            groundwaterEcDsM: toNum(water.groundwaterEcDsM),
            annualRainfallMm: toNum(water.annualRainfallMm),
            runoffCapturePotential: water.runoffCapturePotential,
            floodEventsMinPerYear: toNum(water.floodEventsMinPerYear),
            floodEventsMaxPerYear: toNum(water.floodEventsMaxPerYear),
          }
        : null,
      submittedAt: new Date().toISOString(),
    }
    onSubmit(report)
  }

  const selectClass =
    "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"

  return (
    <div className="space-y-4">
      <SectionCard title="1. Physical Soil Properties" enabled={physical.enabled} onToggle={(v) => setPhysical((p) => ({ ...p, enabled: v }))}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Field label="Texture">
            <Input value={physical.texture} onChange={(e) => setPhysical((p) => ({ ...p, texture: e.target.value }))} placeholder="Sandy Loam" />
          </Field>
          <Field label="Sand (%)">
            <Input type="number" value={physical.sandPct} onChange={(e) => setPhysical((p) => ({ ...p, sandPct: e.target.value }))} />
          </Field>
          <Field label="Silt (%)">
            <Input type="number" value={physical.siltPct} onChange={(e) => setPhysical((p) => ({ ...p, siltPct: e.target.value }))} />
          </Field>
          <Field label="Clay (%)">
            <Input type="number" value={physical.clayPct} onChange={(e) => setPhysical((p) => ({ ...p, clayPct: e.target.value }))} />
          </Field>
          <Field label="Bulk Density (g/cm³)">
            <Input type="number" value={physical.bulkDensityGCm3} onChange={(e) => setPhysical((p) => ({ ...p, bulkDensityGCm3: e.target.value }))} />
          </Field>
          <Field label="Water Holding Capacity (%)">
            <Input
              type="number"
              value={physical.waterHoldingCapacityPct}
              onChange={(e) => setPhysical((p) => ({ ...p, waterHoldingCapacityPct: e.target.value }))}
            />
          </Field>
          <Field label="Infiltration Rate (mm/hr)">
            <Input
              type="number"
              value={physical.infiltrationRateMmHr}
              onChange={(e) => setPhysical((p) => ({ ...p, infiltrationRateMmHr: e.target.value }))}
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="2. Chemical Soil Analysis" enabled={chemical.enabled} onToggle={(v) => setChemical((c) => ({ ...c, enabled: v }))}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Field label="pH">
            <Input type="number" value={chemical.ph} onChange={(e) => setChemical((c) => ({ ...c, ph: e.target.value }))} />
          </Field>
          <Field label="EC (dS/m)">
            <Input type="number" value={chemical.ecDsM} onChange={(e) => setChemical((c) => ({ ...c, ecDsM: e.target.value }))} />
          </Field>
          <Field label="Organic Matter (%)">
            <Input type="number" value={chemical.organicMatterPct} onChange={(e) => setChemical((c) => ({ ...c, organicMatterPct: e.target.value }))} />
          </Field>
          <Field label="Total Nitrogen (%)">
            <Input type="number" value={chemical.totalNitrogenPct} onChange={(e) => setChemical((c) => ({ ...c, totalNitrogenPct: e.target.value }))} />
          </Field>
          <Field label="Phosphorus (ppm)">
            <Input type="number" value={chemical.phosphorusPpm} onChange={(e) => setChemical((c) => ({ ...c, phosphorusPpm: e.target.value }))} />
          </Field>
          <Field label="Potassium (ppm)">
            <Input type="number" value={chemical.potassiumPpm} onChange={(e) => setChemical((c) => ({ ...c, potassiumPpm: e.target.value }))} />
          </Field>
          <Field label="Calcium (ppm)">
            <Input type="number" value={chemical.calciumPpm} onChange={(e) => setChemical((c) => ({ ...c, calciumPpm: e.target.value }))} />
          </Field>
          <Field label="Magnesium (ppm)">
            <Input type="number" value={chemical.magnesiumPpm} onChange={(e) => setChemical((c) => ({ ...c, magnesiumPpm: e.target.value }))} />
          </Field>
          <Field label="Sodium (ppm)">
            <Input type="number" value={chemical.sodiumPpm} onChange={(e) => setChemical((c) => ({ ...c, sodiumPpm: e.target.value }))} />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="3. Carbon Sequestration Potential" enabled={carbon.enabled} onToggle={(v) => setCarbon((c) => ({ ...c, enabled: v }))}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Field label="Soil Organic Carbon (%)">
            <Input type="number" value={carbon.socPct} onChange={(e) => setCarbon((c) => ({ ...c, socPct: e.target.value }))} />
          </Field>
          <Field label="Current Stock (tCO₂e/ha)">
            <Input type="number" value={carbon.currentStockTco2eHa} onChange={(e) => setCarbon((c) => ({ ...c, currentStockTco2eHa: e.target.value }))} />
          </Field>
          <Field label="Target Stock Min (tCO₂e/ha)">
            <Input
              type="number"
              value={carbon.targetStockMinTco2eHa}
              onChange={(e) => setCarbon((c) => ({ ...c, targetStockMinTco2eHa: e.target.value }))}
            />
          </Field>
          <Field label="Target Stock Max (tCO₂e/ha)">
            <Input
              type="number"
              value={carbon.targetStockMaxTco2eHa}
              onChange={(e) => setCarbon((c) => ({ ...c, targetStockMaxTco2eHa: e.target.value }))}
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="4. Soil Microbial Analysis" enabled={microbial.enabled} onToggle={(v) => setMicrobial((m) => ({ ...m, enabled: v }))}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          <Field label="Microbial Biomass Carbon">
            <select className={selectClass} value={microbial.biomassCarbon} onChange={(e) => setMicrobial((m) => ({ ...m, biomassCarbon: e.target.value as MicrobialLevel }))}>
              {MICROBIAL_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </Field>
          <Field label="Bacterial Diversity">
            <select className={selectClass} value={microbial.bacterialDiversity} onChange={(e) => setMicrobial((m) => ({ ...m, bacterialDiversity: e.target.value as MicrobialLevel }))}>
              {MICROBIAL_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </Field>
          <Field label="Fungal Diversity">
            <select className={selectClass} value={microbial.fungalDiversity} onChange={(e) => setMicrobial((m) => ({ ...m, fungalDiversity: e.target.value as MicrobialLevel }))}>
              {MICROBIAL_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </Field>
          <Field label="Nitrogen Fixers">
            <select className={selectClass} value={microbial.nitrogenFixers} onChange={(e) => setMicrobial((m) => ({ ...m, nitrogenFixers: e.target.value as MicrobialLevel }))}>
              {MICROBIAL_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </Field>
          <Field label="Cyanobacteria Presence">
            <select className={selectClass} value={microbial.cyanobacteriaPresence} onChange={(e) => setMicrobial((m) => ({ ...m, cyanobacteriaPresence: e.target.value as MicrobialLevel }))}>
              {MICROBIAL_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </Field>
          <Field label="Mycorrhizal Fungi">
            <select className={selectClass} value={microbial.mycorrhizalFungi} onChange={(e) => setMicrobial((m) => ({ ...m, mycorrhizalFungi: e.target.value as MicrobialLevel }))}>
              {MICROBIAL_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </Field>
        </div>

        <h4 className="text-xs font-semibold text-ink2 mb-2">Detected Species</h4>
        <div className="space-y-2">
          {microbial.detectedSpecies.map((s, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Input
                value={s.species}
                onChange={(e) => updateSpecies(i, "species", e.target.value)}
                placeholder="Species, e.g. Bacillus subtilis"
                className="flex-1"
              />
              <Input
                value={s.function}
                onChange={(e) => updateSpecies(i, "function", e.target.value)}
                placeholder="Function, e.g. Nutrient cycling"
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setMicrobial((m) => ({ ...m, detectedSpecies: m.detectedSpecies.filter((_, idx) => idx !== i) }))}
              >
                <Trash2 className="w-3.5 h-3.5 text-red-custom" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMicrobial((m) => ({ ...m, detectedSpecies: [...m.detectedSpecies, { species: "", function: "" }] }))}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Species
          </Button>
        </div>
      </SectionCard>

      <SectionCard title="5. Water Availability" enabled={water.enabled} onToggle={(v) => setWater((w) => ({ ...w, enabled: v }))}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Field label="Groundwater Depth (m)">
            <Input type="number" value={water.groundwaterDepthM} onChange={(e) => setWater((w) => ({ ...w, groundwaterDepthM: e.target.value }))} />
          </Field>
          <Field label="Groundwater EC (dS/m)">
            <Input type="number" value={water.groundwaterEcDsM} onChange={(e) => setWater((w) => ({ ...w, groundwaterEcDsM: e.target.value }))} />
          </Field>
          <Field label="Annual Rainfall (mm)">
            <Input type="number" value={water.annualRainfallMm} onChange={(e) => setWater((w) => ({ ...w, annualRainfallMm: e.target.value }))} />
          </Field>
          <Field label="Runoff Capture Potential">
            <select
              className={selectClass}
              value={water.runoffCapturePotential}
              onChange={(e) => setWater((w) => ({ ...w, runoffCapturePotential: e.target.value as RunoffPotential }))}
            >
              <option value="low">low</option>
              <option value="moderate">moderate</option>
              <option value="high">high</option>
            </select>
          </Field>
          <Field label="Flood Events Min (/yr)">
            <Input type="number" value={water.floodEventsMinPerYear} onChange={(e) => setWater((w) => ({ ...w, floodEventsMinPerYear: e.target.value }))} />
          </Field>
          <Field label="Flood Events Max (/yr)">
            <Input type="number" value={water.floodEventsMaxPerYear} onChange={(e) => setWater((w) => ({ ...w, floodEventsMaxPerYear: e.target.value }))} />
          </Field>
        </div>
      </SectionCard>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Saving…" : "Save Lab Report"}
        </Button>
      </div>
    </div>
  )
}
