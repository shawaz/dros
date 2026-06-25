"use client"

import React, { useState } from "react"
import { Project } from "@/data/projects"
import { ProjectDetailHeader } from "./ProjectDetailHeader"
import { ProcessStepper } from "./ProcessStepper"
import { OverviewModule } from "./modules/OverviewModule"
import { SatelliteAssessmentModule } from "./modules/SatelliteAssessmentModule"
import { BioChemicalModule } from "./modules/BioChemicalModule"
import { RehabilitationReportModule } from "./modules/rehab-report/RehabilitationReportModule"
import { MonitoringCarbonModule } from "./modules/MonitoringCarbonModule"
import { BudgetReportModule } from "./modules/budget-report/BudgetReportModule"
import { DroneFieldModule } from "./modules/drone-field/DroneFieldModule"
import { ExecutionPlanModule } from "./modules/execution-plan/ExecutionPlanModule"
import { useToast } from "@/context/ToastContext"

interface ProjectDetailProps {
  project: Project
}

interface ModuleProps {
  project: Project
  onToast: (msg: string) => void
}

const MODULES: Record<number, React.ComponentType<ModuleProps>> = {
  1: OverviewModule,
  2: SatelliteAssessmentModule,
  3: DroneFieldModule,
  4: BioChemicalModule,
  5: RehabilitationReportModule,
  6: BudgetReportModule,
  7: ExecutionPlanModule,
  8: MonitoringCarbonModule,
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
