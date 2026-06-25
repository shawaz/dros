"use client"

import React from "react"
import { Project } from "@/data/projects"
import { SoilBioReport } from "@/data/soil-bio-report"
import { SectionedReport, SectionedReportSection } from "./SectionedReport"
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

interface Props {
  project: Project
  report: SoilBioReport
  asInline?: boolean
  toolbar?: React.ReactNode
  leading?: SectionedReportSection[]
}

export const SoilReportPage: React.FC<Props> = ({ project, report, toolbar, leading }) => {
  const lab = project.labReport
  const sections: SectionedReportSection[] = [
    { id: "sampling", label: "Sampling Methodology", node: <SamplingSection project={project} /> },
    ...(lab?.physical
      ? [
          {
            id: "physical",
            label: "Physical Assessment",
            node: (
              <PhysicalSection
                physical={lab.physical}
                narrative={report.physicalNarrative}
                findings={report.physicalFindings}
              />
            ),
          },
        ]
      : []),
    ...(lab?.chemical
      ? [
          {
            id: "chemical",
            label: "Chemical Assessment",
            node: (
              <ChemicalSection
                chemical={lab.chemical}
                narrative={report.chemicalNarrative}
                findings={report.chemicalFindings}
              />
            ),
          },
        ]
      : []),
    {
      id: "microbial",
      label: "Microbial Analysis",
      node: (
        <MicrobialSection
          microbialAssessment={report.microbialAssessment}
          detectedMicrobes={report.detectedMicrobes}
          narrative={report.microbialNarrative}
          findings={report.microbialFindings}
        />
      ),
    },
    { id: "carbon", label: "Carbon & Sequestration", node: <CarbonSection carbon={report.carbon} /> },
    ...(lab?.water
      ? [
          {
            id: "water",
            label: "Water Availability",
            node: <WaterSection water={lab.water} narrative={report.waterNarrative} />,
          },
        ]
      : []),
    { id: "profile", label: "Soil Profile", node: <SoilProfileSection soilProfile={report.soilProfile} /> },
    {
      id: "calibration",
      label: "Satellite vs. Lab",
      node: (
        <SatVsLabSection
          satVsLab={report.satVsLab}
          calibrationSummary={report.calibrationSummary}
        />
      ),
    },
    {
      id: "findings",
      label: "Findings & Next Steps",
      node: (
        <FindingsSection
          criticalFindings={report.criticalFindings}
          requiredFindings={report.requiredFindings}
          positiveFindings={report.positiveFindings}
          projectId={project.id}
        />
      ),
    },
  ]

  return (
    <SectionedReport
      cover={<SoilBioReportHeader project={project} report={report} />}
      coverLabel="Report Overview"
      sections={sections}
      leading={leading}
      toolbar={toolbar}
    />
  )
}
