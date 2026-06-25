"use client"

import React, { useState } from "react"
import { Project } from "@/data/projects"
import type { LabReport } from "@/data/lab-report"
import { LabReportView } from "./chem-bio/LabReportView"
import { LabReportForm } from "./chem-bio/LabReportForm"
import { SoilBioReportModule } from "./soil-report/SoilBioReportModule"

interface BioChemicalModuleProps {
  project: Project
  onToast: (msg: string) => void
}

function hasAnyData(report: LabReport | null): boolean {
  if (!report) return false
  return Boolean(report.physical || report.chemical || report.carbon || report.microbial || report.water)
}

export const BioChemicalModule: React.FC<BioChemicalModuleProps> = ({ project, onToast }) => {
  const [labReport, setLabReport] = useState<LabReport | null>(project.labReport)
  const [labMode, setLabMode] = useState<"view" | "edit">("view")
  const [submitting, setSubmitting] = useState(false)

  const handleSaveLab = async (report: LabReport) => {
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
        setLabMode("view")
      } else {
        onToast("Couldn't save the lab report. Try again.")
      }
    } catch {
      onToast("Couldn't reach the server. Check your connection and try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (labMode === "edit") {
    return (
      <LabReportForm
        initial={labReport}
        submitting={submitting}
        onCancel={() => setLabMode("view")}
        onSubmit={handleSaveLab}
      />
    )
  }

  const leading = hasAnyData(labReport)
    ? [
        {
          id: "lab-data",
          label: "Lab Data",
          node: <LabReportView labReport={labReport as LabReport} onEdit={() => setLabMode("edit")} />,
        },
      ]
    : undefined

  return (
    <SoilBioReportModule
      project={{ ...project, labReport }}
      onToast={onToast}
      onLabEdit={() => setLabMode("edit")}
      leading={leading}
    />
  )
}
