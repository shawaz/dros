"use client"

import React, { useState, useEffect } from "react"
import { FileText, Loader2, RefreshCw, Pencil } from "lucide-react"
import { Project } from "@/data/projects"
import { RehabilitationReport } from "@/data/rehabilitation-report"
import { Button } from "@/components/ui/button"
import { RehabReportPage } from "@/components/project/report-pages/RehabReportPage"
import { ReportEditPanel } from "@/components/project/ReportEditPanel"

interface RehabilitationReportModuleProps {
  project: Project
  onProjectUpdate?: (updated: Project) => void
  onToast: (msg: string) => void
}

export const RehabilitationReportModule: React.FC<RehabilitationReportModuleProps> = ({
  project,
  onProjectUpdate,
  onToast,
}) => {
  const [report, setReport] = useState<RehabilitationReport | null>(project.rehabReport)
  const [generating, setGenerating] = useState(false)
  const [editing, setEditing] = useState(false)

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await fetch(`/api/projects/${project.id}/report`, { method: "POST" })
      const data = await res.json()
      if (data.available && data.project?.rehabReport) {
        setReport(data.project.rehabReport)
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

  // Auto-generate the report on stage open when it's missing.
  useEffect(() => {
    if (!report && !generating) {
      handleGenerate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!report) {
    return (
      <div className="bg-white border border-border rounded-xl p-10 flex flex-col items-center text-center gap-3">
        <FileText className="w-6 h-6 text-dim" />
        <h3 className="font-sans text-sm font-semibold text-ink">No Rehabilitation Report Yet</h3>
        <p className="text-xs text-muted-custom max-w-md">
          Generate a formal rehabilitation prescription from this project&rsquo;s satellite, soil,
          and microbiome data — soil diagnostics, a priority-ranked treatment plan, species
          selection, a phased timeline, and a carbon credit pathway.
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
              Generate Rehabilitation Report
            </>
          )}
        </Button>
      </div>
    )
  }

  if (editing) {
    return (
      <ReportEditPanel
        initial={report}
        saveUrl={`/api/projects/${project.id}/report`}
        title="Editing Rehabilitation Report"
        onCancel={() => setEditing(false)}
        onSaved={(r) => {
          setReport(r)
          setEditing(false)
        }}
        onToast={onToast}
      />
    )
  }

  return (
    <RehabReportPage
      project={project}
      report={report}
      toolbar={
        <div className="space-y-2">
          <Button size="sm" onClick={() => setEditing(true)} className="w-full">
            <Pencil className="w-3.5 h-3.5" /> Edit
          </Button>
          <Button variant="outline" size="sm" onClick={handleGenerate} disabled={generating} className="w-full">
            {generating ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Regenerating…</>
            ) : (
              <><RefreshCw className="w-3.5 h-3.5" /> Regenerate</>
            )}
          </Button>
          <p className="text-[11px] text-muted-custom leading-snug px-0.5">
            Generated {new Date(report.generatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      }
    />
  )
}
