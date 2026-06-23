import React from "react"
import type { FieldExecutionReport } from "@/data/field-execution-report"

export const FexPlantingSection: React.FC<{ report: FieldExecutionReport }> = ({ report }) => {
  const totalPlants = report.plantingLog.reduce((s, r) => s + r.count, 0)
  const totalArea = report.plantingLog.reduce((s, r) => s + r.areaHa, 0)
  return (
    <div>
      <h2 className="rx-section-title">Planting Record</h2>
      <table className="rx-table">
        <thead>
          <tr>
            <th>Species</th>
            <th className="text-right">Count</th>
            <th>Spacing</th>
            <th className="text-right">Area (ha)</th>
          </tr>
        </thead>
        <tbody>
          {report.plantingLog.map((row, i) => (
            <tr key={i}>
              <td className="font-medium italic">{row.species}</td>
              <td className="text-right font-mono">{row.count.toLocaleString()}</td>
              <td className="font-mono text-xs">{row.spacing}</td>
              <td className="text-right font-mono">{row.areaHa.toFixed(1)}</td>
            </tr>
          ))}
          <tr className="font-bold bg-gray-50">
            <td>Total</td>
            <td className="text-right font-mono">{totalPlants.toLocaleString()}</td>
            <td />
            <td className="text-right font-mono">{totalArea.toFixed(1)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
