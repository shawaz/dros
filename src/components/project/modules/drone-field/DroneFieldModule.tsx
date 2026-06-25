"use client"

import React from "react"
import { Project } from "@/data/projects"
import { EditableHtmlDoc } from "@/components/project/EditableHtmlDoc"
import { HTML, SECTIONS } from "./content"
import "./drone-field.css"

export const DroneFieldModule: React.FC<{ project: Project; onToast: (msg: string) => void }> = ({
  project,
  onToast,
}) => (
  <EditableHtmlDoc
    defaultHtml={HTML}
    savedHtml={project.customHtml?.droneField}
    sections={SECTIONS}
    docClass="dmg-doc"
    saveUrl={`/api/projects/${project.id}/custom-html`}
    saveKey="droneField"
    onToast={onToast}
  />
)
