import React from "react"
import type { BudgetColor, BudgetTableBlock } from "@/data/budget-report"
import { BudgetSectionBar } from "./BudgetSectionBar"
import { BudgetTable } from "./BudgetTable"

interface Props {
  icon: string
  num: string
  title: string
  color: BudgetColor
  block: BudgetTableBlock
}

export const BudgetTableSection: React.FC<Props> = ({ icon, num, title, color, block }) => (
  <div>
    <BudgetSectionBar icon={icon} num={num} title={title} color={color} />
    {block.intro && <p className="rx-section-intro">{block.intro}</p>}
    <BudgetTable block={block} />
  </div>
)
