"use client"

import React, { useState, useEffect } from "react"
import { FileText, Loader2, RefreshCw } from "lucide-react"
import { Project } from "@/data/projects"
import { SoilBioReport } from "@/data/soil-bio-report"
import { Button } from "@/components/ui/button"
import { SoilReportPage } from "@/components/project/report-pages/SoilReportPage"

interface Props {
  project: Project
  onProjectUpdate?: (updated: Project) => void
  onToast: (msg: string) => void
}

export const SoilBioReportModule: React.FC<Props> = ({ project, onProjectUpdate, onToast }) => {
  const [report, setReport] = useState<SoilBioReport | null>(project.soilReport)
  const [generating, setGenerating] = useState(false)

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await fetch(`/api/projects/${project.id}/soil-report`, { method: "POST" })
      const data = await res.json()
      if (data.available && data.project?.soilReport) {
        setReport(data.project.soilReport)
        onProjectUpdate?.(data.project)
      } else {
        onToast(data.reason ?? "Failed to generate report")
      }
    } catch {
      onToast("Network error generating report")
    } finally {
      setGenerating(false)
    }
  }

  // Auto-generate on open when lab data exists but no report yet.
  useEffect(() => {
    if (!report && project.labReport && !generating) {
      handleGenerate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!report) {
    if (!project.labReport) {
      return (
        <div className="bg-white border border-border rounded-xl p-10 flex flex-col items-center text-center gap-3">
          <FileText className="w-6 h-6 text-dim" />
          <h3 className="font-sans text-sm font-semibold text-ink">Lab Report Required</h3>
          <p className="text-xs text-muted-custom max-w-md">
            The soil &amp; biological assessment is generated from laboratory data. Add this site&rsquo;s
            lab results in the <strong>Field Execution</strong> stage, then return here to generate the
            report.
          </p>
        </div>
      )
    }
    return (
      <div className="bg-white border border-border rounded-xl p-10 flex flex-col items-center text-center gap-3">
        <FileText className="w-6 h-6 text-dim" />
        <h3 className="font-sans text-sm font-semibold text-ink">No Assessment Report Yet</h3>
        <p className="text-xs text-muted-custom max-w-md">
          Generate a formal soil and biological assessment report from laboratory data — physical
          structure, chemical properties, microbial community analysis, carbon stock estimates,
          water availability, and a satellite vs. lab calibration table.
        </p>
        <Button onClick={handleGenerate} disabled={generating} className="mt-2">
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating…
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              Generate Assessment Report
            </>
          )}
        </Button>
      </div>
    )
  }

  return (
    <SoilReportPage
      project={project}
      report={report}
      toolbar={
        <div className="space-y-2">
          <Button variant="outline" size="sm" onClick={handleGenerate} disabled={generating} className="w-full">
            {generating ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Regenerating…</>
            ) : (
              <><RefreshCw className="w-3.5 h-3.5" /> Regenerate</>
            )}
          </Button>
          <p className="text-[11px] text-muted-custom leading-snug px-0.5">
            {report.reportId} · Generated {new Date(report.generatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      }
    />
  )
}
