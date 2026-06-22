"use client"

import React from "react"
import { TrendingUp } from "lucide-react"
import { Project, DMRVStepStatus } from "@/data/projects"

interface MonitoringCarbonModuleProps {
  project: Project
  onToast: (msg: string) => void
}

const WIDTH = 600
const HEIGHT = 160

function statusStyles(status: DMRVStepStatus) {
  switch (status) {
    case "complete":
      return { dot: "bg-green-custom", text: "text-green-custom", label: "Complete" }
    case "in-progress":
      return { dot: "bg-amber-custom pulse-dot", text: "text-amber-custom", label: "In Progress" }
    default:
      return { dot: "bg-dim", text: "text-muted-custom", label: "Pending" }
  }
}

export const MonitoringCarbonModule: React.FC<MonitoringCarbonModuleProps> = ({ project }) => {
  const { biomass, dmrv, carbonSequesteredTons, carbon } = project
  const maxVal = Math.max(...biomass.map((b) => Math.max(b.predicted, b.actual ?? 0)), 10)

  const xFor = (i: number) => (i / (biomass.length - 1)) * (WIDTH - 20) + 10
  const yFor = (v: number) => HEIGHT - 14 - (v / maxVal) * (HEIGHT - 30)

  const predictedPath = biomass
    .map((b, i) => `${i === 0 ? "M" : "L"}${xFor(i)} ${yFor(b.predicted)}`)
    .join(" ")

  const actualPoints = biomass
    .map((b, i) => (b.actual !== null ? { x: xFor(i), y: yFor(b.actual) } : null))
    .filter((p): p is { x: number; y: number } => p !== null)
  const actualPath = actualPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ")

  return (
    <div className="space-y-4">
      <div className="bg-white border border-border rounded-xl p-5">
        <div className="flex items-center gap-4 mb-1">
          <h3 className="font-sans text-sm font-semibold text-ink">Biomass Growth</h3>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-custom">
            <span className="w-3 h-0.5 bg-green-custom inline-block" /> Actual
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-custom">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-muted-custom inline-block" /> Predicted
          </div>
        </div>
        <p className="text-xs text-muted-custom mb-4">Actual measured biomass vs. AI-predicted baseline</p>
        {biomass.length > 0 ? (
          <>
            <svg
              width="100%"
              height={HEIGHT}
              viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
              preserveAspectRatio="none"
              className="overflow-visible"
            >
              <line
                x1="10"
                y1={HEIGHT - 14}
                x2={WIDTH - 10}
                y2={HEIGHT - 14}
                stroke="var(--border-theme)"
                strokeWidth="1"
              />
              <path d={predictedPath} stroke="var(--muted-foreground)" strokeWidth="2" fill="none" strokeDasharray="5 4" />
              {actualPath && (
                <path d={actualPath} stroke="#2E8B57" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              )}
              {actualPoints.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="3" fill="#2E8B57" />
              ))}
            </svg>
            <div className="flex justify-between text-[10px] text-dim font-mono mt-1">
              {biomass.map((b) => (
                <span key={b.month}>M{b.month}</span>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-center gap-2 py-8">
            <TrendingUp className="w-6 h-6 text-dim" />
            <p className="text-xs text-muted-custom max-w-sm">
              Biomass measurements will appear here once field execution begins and an AI-predicted
              baseline has been generated.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-4">
        <div className="bg-white border border-border rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <div className="text-[11px] font-semibold text-muted-custom tracking-wider uppercase mb-2">
            Total CO₂ Sequestered to Date
          </div>
          <div className="font-sans text-4xl font-bold text-green-custom tracking-tight">
            {carbonSequesteredTons.toLocaleString()}
          </div>
          <div className="font-mono text-[11px] text-muted-custom mt-1">METRIC TONS CO₂</div>
          <div className="text-[11px] text-dim mt-2">Projected run-rate at maturity: {carbon}</div>
        </div>

        <div className="bg-white border border-border rounded-xl p-5">
          <h3 className="font-sans text-sm font-semibold text-ink mb-1">dMRV Status</h3>
          <p className="text-xs text-muted-custom mb-4">
            Digital measurement, reporting & verification by registry
          </p>
          <div className="space-y-3">
            {dmrv.map((step, i) => {
              const s = statusStyles(step.status)
              return (
                <div key={i} className="flex items-start gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${s.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[13px] text-ink font-medium">{step.label}</span>
                      <span className={`text-[10px] font-semibold shrink-0 ${s.text}`}>{s.label}</span>
                    </div>
                    <div className="text-[11px] text-muted-custom font-mono mt-0.5">{step.registry}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
