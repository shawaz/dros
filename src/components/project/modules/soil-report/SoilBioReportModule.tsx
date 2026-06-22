"use client"

import React, { useState } from "react"
import { FileText, Loader2, Printer, RefreshCw } from "lucide-react"
import { Project } from "@/data/projects"
import { SoilBioReport } from "@/data/soil-bio-report"
import { Button } from "@/components/ui/button"
import "../../../../styles/formal-report.css"
import { SoilBioReportHeader } from "./SoilBioReportHeader"
import { SamplingSection } from "./SamplingSection"
import { PhysicalSection } from "./PhysicalSection"
import { ChemicalSection } from "./ChemicalSection"
import { MicrobialSection } from "./MicrobialSection"
import { CarbonSection } from "./CarbonSection"
import { WaterSection } from "./WaterSection"
import { SoilProfileSection } from "./SoilProfileSection"
import { SatVsLabSection } from "./SatVsLabSection"
import { FindingsSection } from "./FindingsSection"

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

  const lab = project.labReport

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
        <SoilBioReportHeader project={project} report={report} />
        <div className="rx-body">
          <SamplingSection project={project} />
          {lab?.physical && (
            <PhysicalSection
              physical={lab.physical}
              narrative={report.physicalNarrative}
              findings={report.physicalFindings}
            />
          )}
          {lab?.chemical && (
            <ChemicalSection
              chemical={lab.chemical}
              narrative={report.chemicalNarrative}
              findings={report.chemicalFindings}
            />
          )}
          <MicrobialSection
            microbialAssessment={report.microbialAssessment}
            detectedMicrobes={report.detectedMicrobes}
            narrative={report.microbialNarrative}
            findings={report.microbialFindings}
          />
          <CarbonSection carbon={report.carbon} />
          {lab?.water && (
            <WaterSection water={lab.water} narrative={report.waterNarrative} />
          )}
          <SoilProfileSection soilProfile={report.soilProfile} />
          <SatVsLabSection
            satVsLab={report.satVsLab}
            calibrationSummary={report.calibrationSummary}
          />
          <FindingsSection
            criticalFindings={report.criticalFindings}
            requiredFindings={report.requiredFindings}
            positiveFindings={report.positiveFindings}
            projectId={project.id}
          />
        </div>
      </article>
    </div>
  )
}
