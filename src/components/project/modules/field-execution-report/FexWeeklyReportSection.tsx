import React from "react"
import type { FieldExecutionReport } from "@/data/field-execution-report"

export const FexWeeklyReportSection: React.FC<{ report: FieldExecutionReport }> = ({ report }) => (
  <div>
    <h2 className="rx-section-title">Weekly Progress Report</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
      {report.weeklyKpis.map((kpi) => (
        <div key={kpi.label} className="border border-border rounded-xl p-3">
          <div className="text-[10px] font-semibold text-muted-custom uppercase tracking-wider mb-1">{kpi.label}</div>
          <div className="text-lg font-bold text-ink">{kpi.value}</div>
        </div>
      ))}
    </div>
    <div className="border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-2 bg-gray-50 border-b border-border">
        <h3 className="text-sm font-semibold text-ink">Signature Block</h3>
      </div>
      <div className="grid grid-cols-3 divide-x divide-border">
        {["Field Lead", "Site Manager", "Project Director"].map((role) => (
          <div key={role} className="p-4 text-center">
            <div className="h-12 border-b border-gray-300 mb-2" />
            <div className="text-xs text-muted-custom">{role}</div>
            <div className="text-xs text-gray-300 mt-1">Date: ___________</div>
          </div>
        ))}
      </div>
    </div>
  </div>
)
