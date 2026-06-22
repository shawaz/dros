"use client"

import React, { useState } from "react"
import { BrainCircuit } from "lucide-react"
import { Project } from "@/data/projects"
import { Button } from "@/components/ui/button"
import { OverrideStrategyDialog } from "../OverrideStrategyDialog"

interface AIRehabilitationModuleProps {
  project: Project
  onToast: (msg: string) => void
}

const IRRIGATION_LABELS: Record<string, string> = {
  "subsurface-drip": "Sub-surface Drip Irrigation",
  "groasis-waterbox": "Groasis Waterbox Placement",
  "rain-fed-seasonal": "Rain-fed + Seasonal Supplemental Drip",
}

function gaugeColor(pct: number) {
  if (pct >= 80) return "#2E8B57"
  if (pct >= 40) return "#C9841A"
  return "#C0392B"
}

export const AIRehabilitationModule: React.FC<AIRehabilitationModuleProps> = ({
  project,
  onToast,
}) => {
  const [overrideOpen, setOverrideOpen] = useState(false)
  const { prescription } = project

  if (!prescription) {
    return (
      <div className="bg-white border border-border rounded-xl p-8 flex flex-col items-center text-center gap-2">
        <BrainCircuit className="w-6 h-6 text-dim" />
        <h3 className="font-sans text-sm font-semibold text-ink">No Prescription Yet</h3>
        <p className="text-xs text-muted-custom max-w-sm">
          A seed mix, irrigation strategy, and success-rate forecast will appear here once the AI
          model has run against this site&rsquo;s satellite and soil data.
        </p>
      </div>
    )
  }

  const radius = 56
  const circumference = 2 * Math.PI * radius
  const dashoffset = circumference * (1 - prescription.successRatePct / 100)
  const color = gaugeColor(prescription.successRatePct)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-border rounded-xl p-5 lg:col-span-2">
          <h3 className="font-sans text-sm font-semibold text-ink mb-1">Seed Mix Recipe</h3>
          <p className="text-xs text-muted-custom mb-4">
            Native species weighted by AI-recommended planting ratio
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            {prescription.seedMix.map((entry) => (
              <span
                key={entry.species}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-lt text-green-custom"
              >
                {entry.species}
                <span className="font-mono font-bold">{entry.weightPct}%</span>
              </span>
            ))}
          </div>

          <h3 className="font-sans text-sm font-semibold text-ink mb-1">Irrigation Strategy</h3>
          <div className="bg-ws rounded-lg p-3.5">
            <div className="text-[13px] font-semibold text-ink mb-1">
              {IRRIGATION_LABELS[prescription.irrigationStrategy]}
            </div>
            <p className="text-xs text-muted-custom leading-relaxed">{prescription.irrigationNotes}</p>
          </div>
        </div>

        <div className="bg-white border border-border rounded-xl p-5 flex flex-col items-center text-center">
          <h3 className="font-sans text-sm font-semibold text-ink mb-1 self-start">
            Expected Success Rate
          </h3>
          <p className="text-xs text-muted-custom mb-3 self-start">
            AI confidence: {prescription.aiConfidencePct}%
          </p>
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r={radius} fill="none" stroke="var(--border-theme)" strokeWidth="10" />
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashoffset}
              transform="rotate(-90 70 70)"
            />
            <text
              x="70"
              y="65"
              fontSize="24"
              fontWeight="700"
              fill="var(--foreground)"
              textAnchor="middle"
              fontFamily="var(--font-sans)"
            >
              {prescription.successRatePct}%
            </text>
            <text
              x="70"
              y="82"
              fontSize="9"
              fill="var(--muted-foreground)"
              textAnchor="middle"
              fontFamily="var(--font-sans)"
            >
              SUCCESS RATE
            </text>
          </svg>
          <Button className="mt-4" onClick={() => setOverrideOpen(true)}>
            Override Strategy
          </Button>
        </div>
      </div>

      <OverrideStrategyDialog
        open={overrideOpen}
        onOpenChange={setOverrideOpen}
        project={project}
        prescription={prescription}
        onToast={onToast}
      />
    </div>
  )
}
