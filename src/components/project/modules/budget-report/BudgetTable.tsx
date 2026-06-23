import React from "react"
import type { BudgetTableBlock } from "@/data/budget-report"
import { rowClass, colorClass, fmt } from "./helpers"

export const BudgetTable: React.FC<{ block: BudgetTableBlock }> = ({ block }) => {
  const { columns, rows, subtotalLabel, subtotal } = block
  const leftCols = columns.length - 1
  return (
    <table className="bx-btable">
      <thead>
        <tr>
          {columns.map((c, i) => (
            <th key={c} className={i === columns.length - 1 ? "bx-right" : undefined}>
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} className={rowClass(row.status)}>
            {row.cells.map((cell, ci) => (
              <td
                key={ci}
                className={
                  cell.bold ? "bx-item" : cell.muted ? "bx-detail" : cell.mono ? "bx-mono" : undefined
                }
              >
                {cell.text}
              </td>
            ))}
            <td className={`bx-cost${row.costColor ? " " + colorClass(row.costColor) : ""}`}>
              {fmt(row.cost)}
            </td>
          </tr>
        ))}
        <tr className="bx-subtotal">
          <td colSpan={leftCols}>{subtotalLabel}</td>
          <td className="bx-cost">{fmt(subtotal)}</td>
        </tr>
      </tbody>
    </table>
  )
}
