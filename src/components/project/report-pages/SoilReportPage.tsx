"use client"

import React from "react"
import { Project } from "@/data/projects"
import { SoilBioReport } from "@/data/soil-bio-report"
import { ReportLayout, TocSection } from "./ReportLayout"
import { SoilBioReportHeader } from "../modules/soil-report/SoilBioReportHeader"
import { SamplingSection } from "../modules/soil-report/SamplingSection"
import { PhysicalSection } from "../modules/soil-report/PhysicalSection"
import { ChemicalSection } from "../modules/soil-report/ChemicalSection"
import { MicrobialSection } from "../modules/soil-report/MicrobialSection"
import { CarbonSection } from "../modules/soil-report/CarbonSection"
import { WaterSection } from "../modules/soil-report/WaterSection"
import { SoilProfileSection } from "../modules/soil-report/SoilProfileSection"
import { SatVsLabSection } from "../modules/soil-report/SatVsLabSection"
import { FindingsSection } from "../modules/soil-report/FindingsSection"

const SECTIONS: TocSection[] = [
  { id: "cover", num: "00", label: "Report Overview" },
  { id: "sampling", num: "01", label: "Sampling Methodology" },
  { id: "physical", num: "02", label: "Physical Assessment" },
  { id: "chemical", num: "03", label: "Chemical Assessment" },
  { id: "microbial", num: "04", label: "Microbial Analysis" },
  { id: "carbon", num: "05", label: "Carbon & Sequestration" },
  { id: "water", num: "06", label: "Water Availability" },
  { id: "profile", num: "07", label: "Soil Profile" },
  { id: "calibration", num: "08", label: "Satellite vs. Lab" },
  { id: "findings", num: "09", label: "Findings & Next Steps" },
]

interface Props {
  project: Project
  report: SoilBioReport
}

export const SoilReportPage: React.FC<Props> = ({ project, report }) => {
  const lab = project.labReport
  return (
    <ReportLayout
      backHref={`/projects/${project.id}`}
      backLabel="Back to Project"
      reportType="Soil & Biological Assessment"
      sections={SECTIONS}
    >
      <article className="rx-report">
        <div id="cover" className="rl-section">
          <SoilBioReportHeader project={project} report={report} />
        </div>
        <div className="rx-body">
          <div id="sampling" className="rl-section">
            <SamplingSection project={project} />
          </div>
          {lab?.physical && (
            <div id="physical" className="rl-section">
              <PhysicalSection
                physical={lab.physical}
                narrative={report.physicalNarrative}
                findings={report.physicalFindings}
              />
            </div>
          )}
          {lab?.chemical && (
            <div id="chemical" className="rl-section">
              <ChemicalSection
                chemical={lab.chemical}
                narrative={report.chemicalNarrative}
                findings={report.chemicalFindings}
              />
            </div>
          )}
          <div id="microbial" className="rl-section">
            <MicrobialSection
              microbialAssessment={report.microbialAssessment}
              detectedMicrobes={report.detectedMicrobes}
              narrative={report.microbialNarrative}
              findings={report.microbialFindings}
            />
          </div>
          <div id="carbon" className="rl-section">
            <CarbonSection carbon={report.carbon} />
          </div>
          {lab?.water && (
            <div id="water" className="rl-section">
              <WaterSection water={lab.water} narrative={report.waterNarrative} />
            </div>
          )}
          <div id="profile" className="rl-section">
            <SoilProfileSection soilProfile={report.soilProfile} />
          </div>
          <div id="calibration" className="rl-section">
            <SatVsLabSection
              satVsLab={report.satVsLab}
              calibrationSummary={report.calibrationSummary}
            />
          </div>
          <div id="findings" className="rl-section">
            <FindingsSection
              criticalFindings={report.criticalFindings}
              requiredFindings={report.requiredFindings}
              positiveFindings={report.positiveFindings}
              projectId={project.id}
            />
          </div>
        </div>
      </article>
    </ReportLayout>
  )
}
