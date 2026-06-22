"use client"

import React, { useState } from "react"
import { ChevronLeft, FlaskConical } from "lucide-react"
import { Project } from "@/data/projects"
import type { LabReport } from "@/data/lab-report"
import { Button } from "@/components/ui/button"
import { LabReportView } from "./chem-bio/LabReportView"
import { LabReportForm } from "./chem-bio/LabReportForm"
import { SoilBioReportModule } from "./soil-report/SoilBioReportModule"

interface ChemicalBiologicalModuleProps {
  project: Project
  onToast: (msg: string) => void
}

function hasAnyData(report: LabReport | null): boolean {
  if (!report) return false
  return Boolean(report.physical || report.chemical || report.carbon || report.microbial || report.water)
}

export const ChemicalBiologicalModule: React.FC<ChemicalBiologicalModuleProps> = ({ project, onToast }) => {
  const [labReport, setLabReport] = useState<LabReport | null>(project.labReport)
  const [mode, setMode] = useState<"view" | "edit" | "report">(hasAnyData(project.labReport) ? "view" : "edit")
  const [submitting, setSubmitting] = useState(false)

  const handleSave = async (report: LabReport) => {
    setSubmitting(true)
    try {
      const res = await fetch(`/api/projects/${project.id}/lab-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(report),
      })
      const json = await res.json()
      if (json.available) {
        setLabReport(json.project.labReport)
        setMode("view")
      } else {
        onToast("Couldn't save the lab report. Try again.")
      }
    } catch {
      onToast("Couldn't reach the server. Check your connection and try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (mode === "edit") {
    return <LabReportForm initial={labReport} submitting={submitting} onCancel={() => setMode("view")} onSubmit={handleSave} />
  }

  if (mode === "report") {
    const projectWithLab = { ...project, labReport }
    return (
      <div className="space-y-3">
        <div>
          <Button variant="outline" size="sm" onClick={() => setMode("view")}>
            <ChevronLeft className="w-3.5 h-3.5" />
            Back to Lab Data
          </Button>
        </div>
        <SoilBioReportModule project={projectWithLab} onToast={onToast} />
      </div>
    )
  }

  if (!hasAnyData(labReport)) {
    return (
      <div className="bg-white border border-border rounded-xl p-10 flex flex-col items-center text-center gap-3">
        <FlaskConical className="w-6 h-6 text-dim" />
        <h3 className="font-sans text-sm font-semibold text-ink">No Lab Report Yet</h3>
        <p className="text-xs text-muted-custom max-w-md">
          Enter this site&rsquo;s physical, chemical, carbon, microbial, and water-availability lab
          results to see status assessments and ground the AI rehabilitation report in real data.
        </p>
        <Button onClick={() => setMode("edit")} className="mt-2">
          <FlaskConical className="w-4 h-4" />
          Add Lab Report
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <LabReportView labReport={labReport as LabReport} onEdit={() => setMode("edit")} />
      <SoilBioReportModule
        project={{ ...project, labReport }}
        onToast={onToast}
        onProjectUpdate={() => setMode("report")}
      />
    </div>
  )
}
