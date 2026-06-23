"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ClipboardList, Loader2, RefreshCw, ExternalLink } from "lucide-react"
import { Project } from "@/data/projects"
import { FieldExecutionReport } from "@/data/field-execution-report"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FieldExecutionReportModuleProps {
  project: Project
  onToast: (msg: string) => void
}

export const FieldExecutionReportModule: React.FC<FieldExecutionReportModuleProps> = ({ project, onToast }) => {
  const [report, setReport] = useState<FieldExecutionReport | null>(project.fieldExecutionReport)
  const [generating, setGenerating] = useState(false)

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await fetch(`/api/projects/${project.id}/field-execution-report`, { method: "POST" })
      const data = await res.json()
      if (data.available && data.project?.fieldExecutionReport) {
        setReport(data.project.fieldExecutionReport)
      } else {
        onToast(data.reason ?? "Failed to generate field execution plan")
      }
    } catch {
      onToast("Network error generating field execution plan")
    } finally {
      setGenerating(false)
    }
  }

  if (!report) {
    return (
      <div className="bg-white border border-border rounded-xl p-10 flex flex-col items-center text-center gap-3">
        <ClipboardList className="w-6 h-6 text-dim" />
        <h3 className="font-sans text-sm font-semibold text-ink">No Field Execution Plan Yet</h3>
        <p className="text-xs text-muted-custom max-w-md">
          Generate a pre-filled operational document for field crews — pre-mobilisation checklists,
          materials manifest, amendment log, planting record, QA gates, HSE protocol, and weekly
          reporting template — all calibrated to this project&rsquo;s species and site conditions.
        </p>
        <Button onClick={handleGenerate} disabled={generating} className="mt-2">
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating — this may take up to 60 seconds…
            </>
          ) : (
            <>
              <ClipboardList className="w-4 h-4" />
              Generate Field Execution Plan
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
      <ClipboardList className="w-6 h-6 text-green-custom" />
      <h3 className="font-sans text-sm font-semibold text-ink">Field Execution Plan Ready</h3>
      <p className="text-xs text-muted-custom">
        Generated {date} · {report.areaHa} ha · Phase: {report.currentPhase}
      </p>
      <div className="flex gap-2 mt-2 flex-wrap justify-center">
        <Link
          href={`/projects/${project.id}/field-execution-report`}
          className={cn(buttonVariants({ variant: "default" }))}
        >
          <ExternalLink className="w-4 h-4" />
          View Full Plan
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
