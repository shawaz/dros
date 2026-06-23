import React from "react"
import type { FieldExecutionReport } from "@/data/field-execution-report"
import { FexSectionBar } from "./FexSectionBar"

export const FexAmendmentLogSection: React.FC<{ report: FieldExecutionReport }> = ({ report }) => (
  <div>
    <FexSectionBar icon="⚗" num="Section 04" title="Amendment Application Log" color="ok" />
    <p className="rx-section-intro">
      Record every amendment application with date, rate, area, method, and operator. This log is
      required for carbon credit chain of custody and treatment verification.
    </p>

    <div className="fx-form-block">
      <div className="fx-form-header"><span className="fx-form-title">Application record</span></div>
      <div className="fx-form-body">
        <table className="fx-log-table">
          <thead>
            <tr><th>Date</th><th>Amendment</th><th>Rate applied</th><th>Area (ha)</th><th>Method</th><th>Depth (cm)</th><th>Operator</th><th>Verified by</th></tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i}>
                <td><input className="fx-cell-input" type="date" /></td>
                <td><input className="fx-cell-input" placeholder={i === 0 ? "e.g., Gypsum" : "—"} /></td>
                <td><input className="fx-cell-input" placeholder={i === 0 ? "e.g., 5 t/ha" : "—"} /></td>
                <td><input className="fx-cell-input" placeholder="—" /></td>
                <td><input className="fx-cell-input" placeholder={i === 0 ? "e.g., Broadcast" : "—"} /></td>
                <td><input className="fx-cell-input" placeholder={i === 0 ? "e.g., 30" : "—"} /></td>
                <td><input className="fx-cell-input" placeholder="—" /></td>
                <td><input className="fx-cell-input" placeholder="—" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="fx-gate fx-c-crit">
      <div className="fx-gate-icon">G1</div>
      <div className="fx-gate-body">{report.amendmentGateNote}</div>
    </div>

    <div className="fx-form-block">
      <div className="fx-form-header">
        <span className="fx-form-title">Gate 1 verification — EC retest after leaching flush</span>
        <span className="fx-st fx-c-crit">MANDATORY</span>
      </div>
      <div className="fx-form-body">
        <table className="fx-log-table">
          <thead>
            <tr><th style={{ width: 30 }}>#</th><th>GPS Point</th><th>EC (dS/m)</th><th>SAR</th><th>Date</th><th style={{ width: 60 }}>Pass?</th></tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((n) => (
              <tr key={n}>
                <td className="fx-row-num">{n}</td>
                <td><input className="fx-cell-input" placeholder="Lat, Lon" /></td>
                <td><input className="fx-cell-input" placeholder="—" /></td>
                <td><input className="fx-cell-input" placeholder="—" /></td>
                <td><input className="fx-cell-input" type="date" /></td>
                <td><input className="fx-cell-input" placeholder="Y/N" /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="fx-sig-row" style={{ padding: "14px 0", marginTop: 12, borderTop: "1px solid var(--rx-border)" }}>
          <div className="fx-sig-label">Gate 1 approved by</div>
          <div className="fx-sig-line" />
          <div className="fx-sig-line" />
          <div className="fx-sig-date">Date: ___/___</div>
        </div>
      </div>
    </div>
  </div>
)
