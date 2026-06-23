import React from "react"
import type { BudgetReport } from "@/data/budget-report"

export const BudgetCarbonRevenueSection: React.FC<{ report: BudgetReport }> = ({ report }) => (
  <div>
    <h2 className="rx-section-title">Carbon Revenue Projection</h2>
    <p className="text-xs text-muted-custom mb-4">
      Carbon sequestration projected over a 10-year crediting period. Revenue modelled at USD 15 (low) and USD 30 (high) per tCO₂e.
    </p>
    <table className="rx-table">
      <thead>
        <tr>
          <th>Period</th>
          <th className="text-right">Seq. (tCO₂e)</th>
          <th className="text-right">Cumulative (tCO₂e)</th>
          <th className="text-right">Rev. Low (USD)</th>
          <th className="text-right">Rev. High (USD)</th>
        </tr>
      </thead>
      <tbody>
        {report.carbonRevenue.map((row) => (
          <tr key={row.period}>
            <td className="font-mono text-xs">{row.period}</td>
            <td className="text-right font-mono">{row.seqTco2e}</td>
            <td className="text-right font-mono">{row.cumulative}</td>
            <td className="text-right font-mono text-amber-700">{row.revLowUsd}</td>
            <td className="text-right font-mono text-green-custom">{row.revHighUsd}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
