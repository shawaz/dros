"use client"

import React, { useState } from "react"
import { FileText, Loader2, Printer, RefreshCw } from "lucide-react"
import { Project } from "@/data/projects"
import { RehabilitationReport } from "@/data/rehabilitation-report"
import { DEMO_REHABILITATION_REPORT } from "@/data/rehab-report-demo"
import { Button } from "@/components/ui/button"
import "../../../../styles/formal-report.css"
import { ReportHeader } from "./ReportHeader"
import { SoilDiagnosticsSection } from "./SoilDiagnosticsSection"
import { PriorityRankingSection } from "./PriorityRankingSection"
import { TreatmentPlanSection } from "./TreatmentPlanSection"
import { SpeciesSection } from "./SpeciesSection"
import { TimelineSection } from "./TimelineSection"
import { CarbonPathwaySection } from "./CarbonPathwaySection"
import { MonitoringSection } from "./MonitoringSection"
import { ProcurementSection } from "./ProcurementSection"
import { SignoffSection } from "./SignoffSection"

interface RehabilitationReportModuleProps {
  project: Project
  onToast: (msg: string) => void
}

export const RehabilitationReportModule: React.FC<RehabilitationReportModuleProps> = ({
  project,
}) => {
  const [report, setReport] = useState<RehabilitationReport | null>(project.rehabReport)
  const [generating, setGenerating] = useState(false)

  const handleGenerate = () => {
    setGenerating(true)
    window.setTimeout(() => {
      setReport({ ...DEMO_REHABILITATION_REPORT, generatedAt: new Date().toISOString() })
      setGenerating(false)
    }, 600)
  }

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

  return (
    <div>
      <div className="rx-report-toolbar">
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Printer className="w-3.5 h-3.5" />
          Print Report
        </Button>
        <Button variant="outline" size="sm" onClick={handleGenerate} disabled={generating}>
          {generating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <RefreshCw className="w-3.5 h-3.5" />
          )}
          Regenerate
        </Button>
      </div>

      <article className="rx-report">
        <ReportHeader project={project} report={report} />
        <div className="rx-body">
          <SoilDiagnosticsSection
            soilPhysical={report.soilPhysical}
            soilChemical={report.soilChemical}
            microbial={report.microbial}
            detectedSpecies={report.detectedSpecies}
            water={report.water}
          />
          <PriorityRankingSection priorityProblems={report.priorityProblems} />
          <TreatmentPlanSection treatment={report.treatment} />
          <SpeciesSection species={report.species} />
          <TimelineSection timeline={report.timeline} totalCostSar={report.totalCostSar} />
          <CarbonPathwaySection
            carbonPathway={report.carbonPathway}
            registrationSteps={report.registrationSteps}
          />
          <MonitoringSection monitoring={report.monitoring} />
          <ProcurementSection
            procurement={report.procurement}
            procurementTotalLow={report.procurementTotalLow}
            procurementTotalHigh={report.procurementTotalHigh}
          />
          <SignoffSection />
        </div>
      </article>
    </div>
  )
}
