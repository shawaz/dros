"use client"

import React, { useState, useEffect } from "react"
import { Receipt, Loader2, RefreshCw } from "lucide-react"
import { Project } from "@/data/projects"
import { BudgetReport } from "@/data/budget-report"
import { Button } from "@/components/ui/button"
import { BudgetReportPage } from "@/components/project/report-pages/BudgetReportPage"

interface BudgetReportModuleProps {
  project: Project
  onToast: (msg: string) => void
}

export const BudgetReportModule: React.FC<BudgetReportModuleProps> = ({ project, onToast }) => {
  const [report, setReport] = useState<BudgetReport | null>(project.budgetReport)
  const [generating, setGenerating] = useState(false)

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await fetch(`/api/projects/${project.id}/budget-report`, { method: "POST" })
      const data = await res.json()
      if (data.available && data.project?.budgetReport) {
        setReport(data.project.budgetReport)
      } else {
        onToast(data.reason ?? "Failed to generate budget report")
      }
    } catch {
      onToast("Network error generating budget report")
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
        <Receipt className="w-6 h-6 text-dim" />
        <h3 className="font-sans text-sm font-semibold text-ink">No Budget Report Yet</h3>
        <p className="text-xs text-muted-custom max-w-md">
          Generate a full financial model — phase-by-phase cost breakdown, amendments procurement,
          labour, planting, cash flow projection, carbon revenue, ROI scenarios, and sensitivity
          analysis — all calibrated to this project&rsquo;s site data.
        </p>
        <Button onClick={handleGenerate} disabled={generating} className="mt-2">
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating — this may take up to 60 seconds…
            </>
          ) : (
            <>
              <Receipt className="w-4 h-4" />
              Generate Budget Report
            </>
          )}
        </Button>
      </div>
    )
  }

  return (
    <BudgetReportPage
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
            Generated {new Date(report.generatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            {" · "}Total: {report.totalSar.toLocaleString()} SAR
          </p>
        </div>
      }
    />
  )
}
