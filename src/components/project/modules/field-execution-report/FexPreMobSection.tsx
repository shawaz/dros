import React from "react"
import type { FieldExecutionReport, FexPriority } from "@/data/field-execution-report"

const PRIORITY_STYLE: Record<FexPriority, string> = {
  critical: "bg-red-100 text-red-700 border-red-200",
  required: "bg-amber-100 text-amber-700 border-amber-200",
  confirm: "bg-blue-100 text-blue-700 border-blue-200",
}

export const FexPreMobSection: React.FC<{ report: FieldExecutionReport }> = ({ report }) => (
  <div>
    <h2 className="rx-section-title">Pre-Mobilisation Checklist</h2>
    <div className="space-y-6">
      {report.preMobGroups.map((group) => (
        <div key={group.title} className="border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-border">
            <h3 className="text-sm font-semibold text-ink">{group.title}</h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${PRIORITY_STYLE[group.items[0]?.priority ?? "confirm"]}`}>
              {group.badge}
            </span>
          </div>
          <div className="divide-y divide-border">
            {group.items.map((item) => (
              <div key={item.id} className="flex items-start gap-3 px-4 py-3">
                <div className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded border-2 ${
                  item.priority === "critical" ? "border-red-400" :
                  item.priority === "required" ? "border-amber-400" : "border-blue-400"
                }`} />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-ink">{item.title}</p>
                    <span className={`flex-shrink-0 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${PRIORITY_STYLE[item.priority]}`}>
                      {item.priority}
                    </span>
                  </div>
                  {item.detail && (
                    <p className="text-xs text-muted-custom mt-0.5">{item.detail}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
)
