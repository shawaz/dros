import React from "react"
import type { BudgetReport } from "@/data/budget-report"

export const BudgetPhasesSection: React.FC<{ report: BudgetReport }> = ({ report }) => (
  <div>
    <h2 className="rx-section-title">Phase Cost Breakdown</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {report.phases.map((phase) => (
        <div key={phase.phase} className="border border-border rounded-xl p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-sm font-semibold text-ink">{phase.phase}</h3>
            <span className="text-xs font-mono text-muted-custom">{phase.period}</span>
          </div>
          <p className="text-xs text-muted-custom mb-3">{phase.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-ink">{phase.cost.toLocaleString()} SAR</span>
            <span className="text-xs font-semibold text-green-custom bg-green-50 px-2 py-0.5 rounded-full">
              {phase.pctOfTotal}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
            <div
              className="h-1.5 rounded-full bg-green-custom"
              style={{ width: phase.pctOfTotal }}
            />
          </div>
        </div>
      ))}
    </div>
    <table className="rx-table">
      <thead>
        <tr>
          <th>Phase</th>
          <th>Period</th>
          <th className="text-right">Cost (SAR)</th>
          <th className="text-right">% of Total</th>
        </tr>
      </thead>
      <tbody>
        {report.phases.map((phase) => (
          <tr key={phase.phase}>
            <td className="font-medium">{phase.phase}</td>
            <td className="font-mono text-xs">{phase.period}</td>
            <td className="text-right font-mono">{phase.cost.toLocaleString()}</td>
            <td className="text-right font-semibold text-green-custom">{phase.pctOfTotal}</td>
          </tr>
        ))}
        <tr className="font-bold bg-gray-50">
          <td colSpan={2}>Total</td>
          <td className="text-right font-mono">{report.totalSar.toLocaleString()}</td>
          <td className="text-right">100%</td>
        </tr>
      </tbody>
    </table>
  </div>
)
