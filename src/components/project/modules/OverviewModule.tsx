"use client"

import React from "react"
import { Activity, Leaf, Ruler, Droplets, Thermometer, CloudRain } from "lucide-react"
import { Project } from "@/data/projects"
import { restorationProcessSteps } from "@/data/restoration-process"
import { SatelliteMapPanel } from "./SatelliteMapPanel"

interface OverviewModuleProps {
  project: Project
  onToast: (msg: string) => void
}

export const OverviewModule: React.FC<OverviewModuleProps> = ({ project }) => {
  const metrics: { icon: React.ElementType; label: string; value: string }[] = [
    { icon: Activity, label: "Health Score", value: `${project.health}/100` },
    { icon: Leaf, label: "NDVI", value: project.ndvi != null ? project.ndvi.toFixed(3) : "—" },
    { icon: Ruler, label: "Area", value: project.area },
    { icon: Leaf, label: "Carbon", value: project.carbon },
    {
      icon: Droplets,
      label: "Soil Moisture",
      value: project.satellite ? project.satellite.soilMoistureIndex.toFixed(3) : "—",
    },
    {
      icon: Thermometer,
      label: "Surface Temp",
      value: project.satellite ? `${project.satellite.surfaceTempC.toFixed(1)}°C` : "—",
    },
    { icon: CloudRain, label: "Rainfall", value: `${project.rainfall} mm` },
    { icon: Activity, label: "Degradation", value: `${project.degrad}%` },
  ]

  const facts: { label: string; value: string }[] = [
    { label: "Region", value: project.region },
    { label: "Location", value: project.location },
    { label: "Timeline", value: project.timeline },
    { label: "Water source", value: project.water },
    { label: "Aridity index", value: `${project.aridity}` },
    { label: "Est. cost", value: project.cost },
  ]

  return (
    <div className="space-y-5">
      {/* Key metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metrics.map((m) => {
          const Icon = m.icon
          return (
            <div key={m.label} className="bg-white border border-border rounded-xl p-4">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-custom uppercase tracking-wider mb-2">
                <Icon className="w-3.5 h-3.5" />
                {m.label}
              </div>
              <div className="font-sans text-2xl font-bold text-ink tracking-tight">{m.value}</div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
        {/* Site snapshot */}
        <div className="lg:col-span-2 bg-white border border-border rounded-xl p-4 flex flex-col">
          <div className="mb-3">
            <h3 className="font-sans text-sm font-semibold text-ink">Site Snapshot</h3>
            <p className="text-xs text-muted-custom">Current true-color satellite imagery</p>
          </div>
          <SatelliteMapPanel project={project} layer="true-color" label="Current · True Color" />
        </div>

        {/* Project facts */}
        <div className="bg-white border border-border rounded-xl p-4 flex flex-col">
          <div className="mb-3">
            <h3 className="font-sans text-sm font-semibold text-ink">Project Details</h3>
            <p className="text-xs text-muted-custom">Site parameters and estimates</p>
          </div>
          <dl className="flex flex-col justify-between flex-1 gap-2.5">
            {facts.map((f) => (
              <div key={f.label} className="flex items-start justify-between gap-3 text-xs">
                <dt className="text-muted-custom shrink-0">{f.label}</dt>
                <dd className="text-ink font-medium text-right">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Stage progress */}
      <div className="bg-white border border-border rounded-xl p-5">
        <h3 className="font-sans text-sm font-semibold text-ink mb-4">Restoration Progress</h3>
        <ol className="space-y-2.5">
          {restorationProcessSteps.map((step) => {
            const Icon = step.icon
            const isCompleted = step.step < project.currentStep
            const isCurrent = step.step === project.currentStep
            return (
              <li key={step.step} className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    isCurrent
                      ? "bg-green-custom text-white"
                      : isCompleted
                      ? "bg-green-lt text-green-custom"
                      : "bg-ws text-dim"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span
                  className={`text-xs ${
                    isCurrent ? "text-ink font-semibold" : isCompleted ? "text-ink2" : "text-muted-custom"
                  }`}
                >
                  {step.title}
                </span>
                {isCurrent && (
                  <span className="ml-auto text-[10px] font-mono uppercase tracking-wider text-green-custom">
                    Current
                  </span>
                )}
                {isCompleted && (
                  <span className="ml-auto text-[10px] font-mono uppercase tracking-wider text-dim">Done</span>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
