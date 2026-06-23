import React from "react"
import type { FexStatus } from "@/data/field-execution-report"
import { fxColor } from "./helpers"

interface Props {
  icon: string
  num: string
  title: string
  color: FexStatus | "teal" | "purple"
}

export const FexSectionBar: React.FC<Props> = ({ icon, num, title, color }) => (
  <div className={`fx-section-bar fx-c-${color}`}>
    <div className="fx-section-icon">{icon}</div>
    <div>
      <div className="fx-section-num">{num}</div>
      <h2 className="fx-section-title">{title}</h2>
    </div>
  </div>
)

export const fxBarColor = fxColor
