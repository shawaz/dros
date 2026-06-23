import React from "react"
import type { FieldExecutionReport } from "@/data/field-execution-report"
import { FexSectionBar } from "./FexSectionBar"

const PREFILL: { depth: string; time: string; label: string; micro: string }[] = [
  { depth: "0–10 cm", time: "08:30", label: "P01-A", micro: "Y/N" },
  { depth: "10–30 cm", time: "08:45", label: "P01-B", micro: "Y" },
  { depth: "30–60 cm", time: "09:00", label: "P01-C", micro: "N" },
]

export const FexSamplingSection: React.FC<{ report: FieldExecutionReport }> = ({ report }) => (
  <div>
    <FexSectionBar icon="🧪" num="Section 07" title="Sample Collection Protocol" color="teal" />

    <div className="fx-gate fx-c-info">
      <div className="fx-gate-icon">!</div>
      <div className="fx-gate-body">{report.samplingNote}</div>
    </div>

    <div className="fx-form-block">
      <div className="fx-form-header"><span className="fx-form-title">Sample collection log</span></div>
      <div className="fx-form-body">
        <table className="fx-log-table">
          <thead>
            <tr><th style={{ width: 30 }}>#</th><th>GPS Point</th><th>Depth</th><th>Time</th><th>Collector</th><th>Field pH</th><th>Field EC</th><th>Bag label</th><th>Microbial?</th></tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5, 6].map((n, i) => {
              const p = PREFILL[i]
              return (
                <tr key={n}>
                  <td className="fx-row-num">{n}</td>
                  <td><input className="fx-cell-input" placeholder="Lat, Lon" /></td>
                  <td><input className="fx-cell-input" placeholder={p?.depth ?? "—"} /></td>
                  <td><input className="fx-cell-input" placeholder={p?.time ?? "—"} /></td>
                  <td><input className="fx-cell-input" placeholder="—" /></td>
                  <td><input className="fx-cell-input" placeholder="—" /></td>
                  <td><input className="fx-cell-input" placeholder="—" /></td>
                  <td><input className="fx-cell-input" placeholder={p?.label ?? "—"} /></td>
                  <td><input className="fx-cell-input" placeholder={p?.micro ?? "—"} /></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>

    <div className="fx-form-block">
      <div className="fx-form-header"><span className="fx-form-title">Chain of custody transfer</span></div>
      <div className="fx-form-body">
        <div className="fx-field-row">
          <div className="fx-field"><label className="fx-field-label">Total samples dispatched</label><input className="fx-field-input" placeholder="e.g., 45 chemical + 15 microbial" /></div>
          <div className="fx-field"><label className="fx-field-label">Courier company</label><input className="fx-field-input" placeholder="e.g., Aramex cold chain" /></div>
        </div>
        <div className="fx-field-row">
          <div className="fx-field"><label className="fx-field-label">Dispatch time</label><input className="fx-field-input" type="time" /></div>
          <div className="fx-field"><label className="fx-field-label">Tracking number</label><input className="fx-field-input" placeholder="—" /></div>
        </div>
        <div className="fx-sig-row" style={{ padding: "14px 0", marginTop: 8, borderTop: "1px solid var(--rx-border)" }}>
          <div className="fx-sig-label">Released by</div>
          <div className="fx-sig-line" />
          <div className="fx-sig-line" />
          <div className="fx-sig-date">Date: ___/___</div>
        </div>
      </div>
    </div>
  </div>
)
