import React from "react"
import type { FieldExecutionReport } from "@/data/field-execution-report"
import { FexSectionBar } from "./FexSectionBar"

export const FexMaterialsSection: React.FC<{ report: FieldExecutionReport }> = ({ report }) => (
  <div>
    <FexSectionBar icon="📦" num="Section 03" title="Materials Manifest & Tracking" color="warn" />

    <div className="fx-form-block">
      <div className="fx-form-header"><span className="fx-form-title">Delivery tracking</span></div>
      <div className="fx-form-body">
        <table className="fx-log-table">
          <thead>
            <tr><th>Material</th><th>Ordered (t/kg)</th><th>Delivered</th><th>Delivery date</th><th>CoA ref</th><th>Storage loc.</th><th style={{ width: 60 }}>Status</th></tr>
          </thead>
          <tbody>
            {report.materials.map((m) => (
              <tr key={m.material}>
                <td>{m.material}</td>
                <td><input className="fx-cell-input" defaultValue={m.ordered} /></td>
                <td><input className="fx-cell-input" placeholder="— t" /></td>
                <td><input className="fx-cell-input" type="date" /></td>
                <td><input className="fx-cell-input" placeholder="—" /></td>
                <td><input className="fx-cell-input" placeholder={m.storage ?? "—"} /></td>
                <td><input className="fx-cell-input" placeholder="—" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="fx-gate fx-c-warn">
      <div className="fx-gate-icon">!</div>
      <div className="fx-gate-body">{report.coldChainNote}</div>
    </div>
  </div>
)
