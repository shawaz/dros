import React from "react"
import type { BudgetColor } from "@/data/budget-report"
import { colorClass } from "./helpers"

interface Props {
  icon: string // emoji glyph
  num: string // e.g. "Section 01"
  title: string
  color: BudgetColor
}

export const BudgetSectionBar: React.FC<Props> = ({ icon, num, title, color }) => (
  <div className={`bx-section-bar ${colorClass(color)}`}>
    <div className="bx-section-icon">{icon}</div>
    <div>
      <div className="bx-section-num">{num}</div>
      <h2 className="bx-section-title">{title}</h2>
    </div>
  </div>
)
