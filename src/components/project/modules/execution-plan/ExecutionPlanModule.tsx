"use client"

import React from "react"
import { Project } from "@/data/projects"
import { EditableHtmlDoc } from "@/components/project/EditableHtmlDoc"
import { HTML, SECTIONS } from "./content"
import "./execution-plan.css"

export const ExecutionPlanModule: React.FC<{ project: Project; onToast: (msg: string) => void }> = ({
  project,
  onToast,
}) => (
  <EditableHtmlDoc
    defaultHtml={HTML}
    savedHtml={project.customHtml?.execution}
    sections={SECTIONS}
    docClass="fep-doc"
    saveUrl={`/api/projects/${project.id}/custom-html`}
    saveKey="execution"
    onToast={onToast}
  />
)
