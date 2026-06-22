"use client"

import React, { useState } from "react"
import Link from "next/link"
import { FileText, Loader2, RefreshCw, ExternalLink } from "lucide-react"
import { Project } from "@/data/projects"
import { SoilBioReport } from "@/data/soil-bio-report"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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

  if (!report) {
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

  const date = new Date(report.generatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="bg-white border border-border rounded-xl p-10 flex flex-col items-center text-center gap-3">
      <FileText className="w-6 h-6 text-green-custom" />
      <h3 className="font-sans text-sm font-semibold text-ink">Soil & Biological Assessment Ready</h3>
      <p className="text-xs text-muted-custom">
        {report.reportId} · Generated {date}
      </p>
      <div className="flex gap-2 mt-2 flex-wrap justify-center">
        <Link
          href={`/projects/${project.id}/soil-report`}
          className={cn(buttonVariants({ variant: "default" }))}
        >
          <ExternalLink className="w-4 h-4" />
          View Full Report
        </Link>
        <Button variant="outline" onClick={handleGenerate} disabled={generating}>
          {generating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <RefreshCw className="w-3.5 h-3.5" />
          )}
          Regenerate
        </Button>
      </div>
    </div>
  )
}
