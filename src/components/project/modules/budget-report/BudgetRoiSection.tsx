import React from "react"
import type { BudgetReport } from "@/data/budget-report"

const SCENARIO_COLOR = ["#ef4444", "#2E8B57", "#3b82f6"]
const SCENARIO_LABEL = ["Conservative", "Base Case", "Optimistic"]

export const BudgetRoiSection: React.FC<{ report: BudgetReport }> = ({ report }) => (
  <div>
    <h2 className="rx-section-title">ROI Analysis</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {report.roiScenarios.map((sc, i) => (
        <div key={sc.pricePerT} className="border border-border rounded-xl p-4 text-center">
          <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: SCENARIO_COLOR[i] }}>
            {SCENARIO_LABEL[i]}
          </div>
          <div className="text-3xl font-bold text-ink mb-1">{sc.roiX}×</div>
          <div className="text-xs text-muted-custom">ROI at USD {sc.pricePerT}/tCO₂e</div>
          <div className="mt-3 pt-3 border-t border-border text-xs">
            Breakeven: <span className="font-semibold">Year {sc.breakevenYear}</span>
          </div>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="border border-red-200 bg-red-50 rounded-xl p-4">
        <div className="text-xs font-semibold text-red-700 uppercase tracking-wider mb-1">Worst Case</div>
        <div className="text-2xl font-bold text-red-700">{report.worstCaseSar.toLocaleString()} SAR</div>
        <div className="text-xs text-muted-custom mt-1">Includes 10% contingency + downside risks</div>
      </div>
      <div className="border border-green-200 bg-green-50 rounded-xl p-4">
        <div className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-1">Best Case</div>
        <div className="text-2xl font-bold text-green-custom">{report.bestCaseSar.toLocaleString()} SAR</div>
        <div className="text-xs text-muted-custom mt-1">Bulk discounts + favourable conditions</div>
      </div>
    </div>
  </div>
)
