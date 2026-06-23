"use client"

import React, { useState } from "react"
import { Project } from "@/data/projects"
import { ProjectDetailHeader } from "./ProjectDetailHeader"
import { ProcessStepper } from "./ProcessStepper"
import { SatelliteAssessmentModule } from "./modules/SatelliteAssessmentModule"
import { DroneSurveyModule } from "./modules/DroneSurveyModule"
import { ChemicalBiologicalModule } from "./modules/ChemicalBiologicalModule"
import { RehabilitationReportModule } from "./modules/rehab-report/RehabilitationReportModule"
import { FieldExecutionModule } from "./modules/FieldExecutionModule"
import { MonitoringCarbonModule } from "./modules/MonitoringCarbonModule"
import { BudgetReportModule } from "./modules/budget-report/BudgetReportModule"
import { FieldExecutionReportModule } from "./modules/field-execution-report/FieldExecutionReportModule"
import { useToast } from "@/context/ToastContext"

interface ProjectDetailProps {
  project: Project
}

interface ModuleProps {
  project: Project
  onToast: (msg: string) => void
}

const MODULES: Record<number, React.ComponentType<ModuleProps>> = {
  1: SatelliteAssessmentModule,
  2: DroneSurveyModule,
  3: ChemicalBiologicalModule,
  4: RehabilitationReportModule,
  5: FieldExecutionModule,
  6: MonitoringCarbonModule,
  7: BudgetReportModule,
  8: FieldExecutionReportModule,
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project }) => {
  const { showToast } = useToast()
  const [activeStep, setActiveStep] = useState(project.currentStep)

  const ActiveModule = MODULES[activeStep] ?? SatelliteAssessmentModule

  return (
    <div className="space-y-4 animate-[fadeUp_0.35s_ease_both]">
      <ProjectDetailHeader project={project} />
      <ProcessStepper
        currentStep={project.currentStep}
        activeStep={activeStep}
        onStepSelect={setActiveStep}
      />
      <div key={activeStep} className="animate-[fadeUp_0.35s_ease_both]">
        <ActiveModule project={project} onToast={showToast} />
      </div>
    </div>
  )
}
