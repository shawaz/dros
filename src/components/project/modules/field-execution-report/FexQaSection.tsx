import React from "react"
import type { FexStatus, FieldExecutionReport } from "@/data/field-execution-report"
import { FexSectionBar } from "./FexSectionBar"

const TARGET_COLOR: Record<FexStatus, string> = {
  crit: "var(--rx-red)",
  warn: "var(--rx-amber)",
  info: "var(--rx-blue)",
  ok: "var(--rx-green)",
}

export const FexQaSection: React.FC<{ report: FieldExecutionReport }> = ({ report }) => (
  <div>
    <FexSectionBar icon="🔍" num="Section 08" title="Quality Assurance Checkpoints" color="ok" />
    <p className="rx-section-intro">
      QA checkpoints are pass/fail gates. A failed checkpoint halts the corresponding activity until
      corrective action is verified. The Field Lead and Project Lead must both sign off on gate passages.
    </p>

    <div className="fx-form-block">
      <div className="fx-form-header"><span className="fx-form-title">Gate verification log</span></div>
      <div className="fx-form-body">
        <table className="fx-log-table">
          <thead>
            <tr><th>Gate</th><th>Condition</th><th>Target</th><th>Actual result</th><th>Date tested</th><th style={{ width: 50 }}>Pass?</th><th>Signed by</th></tr>
          </thead>
          <tbody>
            {report.qaGates.map((g, i) => (
              <tr key={i}>
                <td><strong>{g.gate}</strong></td>
                <td>{g.condition}</td>
                <td><input className="fx-cell-input" defaultValue={g.target} readOnly style={{ color: TARGET_COLOR[g.targetColor] }} /></td>
                <td><input className="fx-cell-input" placeholder="—" /></td>
                <td><input className="fx-cell-input" type="date" /></td>
                <td><input className="fx-cell-input" placeholder="—" /></td>
                <td><input className="fx-cell-input" placeholder="—" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)
