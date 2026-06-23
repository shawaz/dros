import React from "react"
import type { FieldExecutionReport } from "@/data/field-execution-report"

export const FexMaterialsSection: React.FC<{ report: FieldExecutionReport }> = ({ report }) => (
  <div>
    <h2 className="rx-section-title">Materials Manifest</h2>
    {report.coldChainNote && (
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
        <span className="font-bold uppercase tracking-wide">Cold Chain Warning: </span>
        {report.coldChainNote}
      </div>
    )}
    <table className="rx-table">
      <thead>
        <tr>
          <th>Material</th>
          <th>Ordered Quantity</th>
          <th>Storage Requirements</th>
        </tr>
      </thead>
      <tbody>
        {report.materialsManifest.map((row, i) => {
          const isColdChain = row.storage?.toLowerCase().includes("cold") || row.storage?.toLowerCase().includes("refrigerat")
          return (
            <tr key={i} style={isColdChain ? { backgroundColor: "#dbeafe" } : undefined}>
              <td className="font-medium">{row.material}</td>
              <td className="font-mono text-xs">{row.orderedQty}</td>
              <td className="text-xs text-muted-custom">{row.storage ?? "—"}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>
)
