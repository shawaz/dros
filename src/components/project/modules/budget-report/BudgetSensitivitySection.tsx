import React from "react"
import type { BudgetReport } from "@/data/budget-report"

export const BudgetSensitivitySection: React.FC<{ report: BudgetReport }> = ({ report }) => (
  <div>
    <h2 className="rx-section-title">Sensitivity Analysis</h2>
    <table className="rx-table">
      <thead>
        <tr>
          <th>Variable</th>
          <th>Base Case</th>
          <th>Downside</th>
          <th>Upside</th>
          <th>NPV Impact</th>
        </tr>
      </thead>
      <tbody>
        {report.sensitivity.map((row) => (
          <tr key={row.variable}>
            <td className="font-medium">{row.variable}</td>
            <td className="text-xs font-mono">{row.baseCase}</td>
            <td className="text-xs font-mono text-red-600">{row.downside}</td>
            <td className="text-xs font-mono text-green-custom">{row.upside}</td>
            <td className="text-xs font-semibold">{row.impact}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
