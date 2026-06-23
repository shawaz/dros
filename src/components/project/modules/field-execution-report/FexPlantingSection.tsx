import React from "react"
import type { FieldExecutionReport } from "@/data/field-execution-report"
import { FexSectionBar } from "./FexSectionBar"

export const FexPlantingSection: React.FC<{ report: FieldExecutionReport }> = ({ report }) => (
  <div>
    <FexSectionBar icon="🌱" num="Section 05" title="Planting Execution Record" color="ok" />

    <div className="fx-form-block">
      <div className="fx-form-header"><span className="fx-form-title">Planting log</span></div>
      <div className="fx-form-body">
        <table className="fx-log-table">
          <thead>
            <tr><th>Date</th><th>Species</th><th>Count planted</th><th>Area (ha)</th><th>Spacing</th><th>AMF placed?</th><th>Shade shelter?</th><th>GPS logged?</th></tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                <td><input className="fx-cell-input" type="date" /></td>
                <td><input className="fx-cell-input" placeholder={i === 0 ? "e.g., Atriplex" : "—"} /></td>
                <td><input className="fx-cell-input" placeholder="—" /></td>
                <td><input className="fx-cell-input" placeholder="—" /></td>
                <td><input className="fx-cell-input" placeholder={i === 0 ? "e.g., 2×2 m" : "—"} /></td>
                <td><input className="fx-cell-input" placeholder="Y/N" /></td>
                <td><input className="fx-cell-input" placeholder="Y/N" /></td>
                <td><input className="fx-cell-input" placeholder="Y/N" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="fx-gate fx-c-ok">
      <div className="fx-gate-icon">✓</div>
      <div className="fx-gate-body">{report.plantingQaNote}</div>
    </div>
  </div>
)
