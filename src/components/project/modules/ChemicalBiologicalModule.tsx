"use client"

import React from "react"
import { AlertTriangle, FlaskConical } from "lucide-react"
import { Project } from "@/data/projects"

interface ChemicalBiologicalModuleProps {
  project: Project
  onToast: (msg: string) => void
}

interface BarRow {
  label: string
  value: number | null
  domainMax: number
  unit: string
  color: string
}

function radarPoint(t: number, angleDeg: number, cx: number, cy: number, maxR: number) {
  const rad = (angleDeg * Math.PI) / 180
  const r = Math.max(0, Math.min(1, t)) * maxR
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

const EmptyCard: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className="bg-white border border-border rounded-xl p-8 flex flex-col items-center text-center gap-2">
    <FlaskConical className="w-6 h-6 text-dim" />
    <h3 className="font-sans text-sm font-semibold text-ink">{title}</h3>
    <p className="text-xs text-muted-custom max-w-sm">{description}</p>
  </div>
)

export const ChemicalBiologicalModule: React.FC<ChemicalBiologicalModuleProps> = ({ project }) => {
  const { soil, microbiome } = project
  const showToxicityBanner = Boolean(soil?.heavyMetalsDetected) || (soil?.salinityDS ?? 0) > 4

  const bars: BarRow[] = soil
    ? [
        { label: "Nitrogen (N)", value: soil.npk.nitrogen, domainMax: 60, unit: "mg/kg", color: "#185FA5" },
        { label: "Phosphorus (P)", value: soil.npk.phosphorus, domainMax: 30, unit: "mg/kg", color: "#0F6E56" },
        { label: "Potassium (K)", value: soil.npk.potassium, domainMax: 200, unit: "mg/kg", color: "#639922" },
        { label: "Organic Matter", value: soil.organicMatterPct, domainMax: 5, unit: "%", color: "#BA7517" },
        { label: "pH Balance", value: project.ph ?? null, domainMax: 14, unit: "", color: "#888780" },
      ]
    : []

  const cx = 100
  const cy = 100
  const maxR = 72
  const angles = [-90, 30, 150]
  const axes = microbiome
    ? [
        { label: "Fungal:Bacterial", t: Math.min(microbiome.fungalToBacterialRatio / 1.5, 1) },
        { label: "Microbial Biomass C", t: Math.min(microbiome.microbialBiomassCarbon / 500, 1) },
        { label: "Mycorrhizal Spores", t: Math.min(microbiome.mycorrhizalSporeDensity / 100, 1) },
      ]
    : []
  const dataPoints = axes.map((a, i) => radarPoint(a.t, angles[i], cx, cy, maxR))
  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ")
  const gridRings = [0.33, 0.66, 1]

  return (
    <div className="space-y-4">
      {showToxicityBanner && soil && (
        <div className="bg-red-lt border border-red-custom/30 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-custom shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-red-custom mb-0.5">Toxicity Alert</div>
            <p className="text-[13px] text-ink2 leading-relaxed">{soil.toxicityNotes}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {soil ? (
          <div className="bg-white border border-border rounded-xl p-5">
            <h3 className="font-sans text-sm font-semibold text-ink">Soil Composition</h3>
            <p className="text-xs text-muted-custom mb-4">N-P-K levels, pH balance, and organic matter</p>
            <div className="space-y-4">
              {bars.map((bar) => (
                <div key={bar.label}>
                  <div className="flex justify-between mb-1.5 text-xs">
                    <span className="text-muted-custom">{bar.label}</span>
                    <span className="font-mono font-semibold text-ink">
                      {bar.value !== null ? `${bar.value} ${bar.unit}` : "Not tested"}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-ws rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: bar.value !== null ? `${Math.min((bar.value / bar.domainMax) * 100, 100)}%` : "0%",
                        backgroundColor: bar.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyCard
            title="No Lab Samples Yet"
            description="N-P-K levels, pH balance, and organic matter will appear here once a soil sample has been tested."
          />
        )}

        {microbiome ? (
          <div className="bg-white border border-border rounded-xl p-5">
            <h3 className="font-sans text-sm font-semibold text-ink">Soil Microbiome</h3>
            <p className="text-xs text-muted-custom mb-2">Fungal-to-bacterial ratio, biomass, and mycorrhizal spores</p>
            <div className="flex justify-center">
              <svg width="100%" height="220" viewBox="0 0 200 200" className="max-w-[260px]">
                {gridRings.map((ring) => (
                  <polygon
                    key={ring}
                    points={angles.map((a) => {
                      const p = radarPoint(ring, a, cx, cy, maxR)
                      return `${p.x},${p.y}`
                    }).join(" ")}
                    fill="none"
                    stroke="var(--border-theme)"
                    strokeWidth="1"
                  />
                ))}
                {angles.map((a, i) => {
                  const outer = radarPoint(1, a, cx, cy, maxR)
                  return (
                    <line
                      key={i}
                      x1={cx}
                      y1={cy}
                      x2={outer.x}
                      y2={outer.y}
                      stroke="var(--border-theme)"
                      strokeWidth="1"
                    />
                  )
                })}
                <polygon points={dataPolygon} fill="#2E8B57" fillOpacity="0.25" stroke="#2E8B57" strokeWidth="2" />
                {dataPoints.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r="3" fill="#2E8B57" />
                ))}
                {axes.map((a, i) => {
                  const labelPos = radarPoint(1.28, angles[i], cx, cy, maxR)
                  return (
                    <text
                      key={a.label}
                      x={labelPos.x}
                      y={labelPos.y}
                      fontSize="8.5"
                      fill="var(--muted-foreground)"
                      fontFamily="var(--font-sans)"
                      textAnchor="middle"
                    >
                      {a.label}
                    </text>
                  )
                })}
              </svg>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2 text-center">
              <div>
                <div className="font-mono text-sm font-bold text-ink">
                  {microbiome.fungalToBacterialRatio.toFixed(2)}
                </div>
                <div className="text-[10px] text-muted-custom">F:B ratio</div>
              </div>
              <div>
                <div className="font-mono text-sm font-bold text-ink">{microbiome.microbialBiomassCarbon}</div>
                <div className="text-[10px] text-muted-custom">mg C/kg</div>
              </div>
              <div>
                <div className="font-mono text-sm font-bold text-ink">{microbiome.mycorrhizalSporeDensity}</div>
                <div className="text-[10px] text-muted-custom">spores/100g</div>
              </div>
            </div>
          </div>
        ) : (
          <EmptyCard
            title="No Microbiome Data Yet"
            description="Fungal-to-bacterial ratio, microbial biomass, and mycorrhizal spore density will appear here once a lab sample has been analyzed."
          />
        )}
      </div>
    </div>
  )
}
