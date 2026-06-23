import React from "react"
import { FexSectionBar } from "./FexSectionBar"

const Field: React.FC<{ label: string; placeholder?: string; type?: string }> = ({ label, placeholder, type }) => (
  <div className="fx-field">
    <label className="fx-field-label">{label}</label>
    <input className="fx-field-input" type={type} placeholder={placeholder} />
  </div>
)

export const FexDailyLogSection: React.FC = () => (
  <div>
    <FexSectionBar icon="📝" num="Section 02" title="Daily Field Log" color="info" />
    <p className="rx-section-intro">
      Complete one log per field day. Photo-document every activity. Upload to DROS within 48 hours
      while observations are fresh. This log forms part of the carbon credit chain of custody.
    </p>

    <div className="fx-form-block">
      <div className="fx-form-header"><span className="fx-form-title">Day header</span></div>
      <div className="fx-form-body">
        <div className="fx-field-row-4">
          <Field label="Date" type="date" />
          <Field label="Day number" placeholder="e.g., Day 14" />
          <div className="fx-field">
            <label className="fx-field-label">Phase</label>
            <select className="fx-field-input"><option>Phase 1 — Site prep</option><option>Phase 2 — Soil chemistry</option><option>Phase 3 — Nutrients/AMF</option><option>Phase 4 — Planting</option><option>Phase 5 — Monitoring</option><option>Phase 6 — Carbon</option></select>
          </div>
          <Field label="Crew size" placeholder="e.g., 8" />
        </div>
        <div className="fx-field-row-4">
          <Field label="Field lead" placeholder="Name" />
          <div className="fx-field">
            <label className="fx-field-label">Weather</label>
            <select className="fx-field-input"><option>Clear / sunny</option><option>Partly cloudy</option><option>Overcast</option><option>Windy (&gt;25 km/h)</option><option>Rain event</option><option>Dust storm</option></select>
          </div>
          <Field label="Temp (°C)" placeholder="e.g., 34" />
          <Field label="Wind (km/h)" placeholder="e.g., 15" />
        </div>
      </div>
    </div>

    <div className="fx-form-block">
      <div className="fx-form-header"><span className="fx-form-title">Activities completed today</span></div>
      <div className="fx-form-body">
        <div className="fx-field" style={{ marginBottom: 14 }}>
          <label className="fx-field-label">Tasks completed</label>
          <textarea className="fx-field-input" placeholder="List all activities completed today with quantities, areas covered, and any deviations from plan…" />
        </div>
        <div className="fx-field-row">
          <Field label="Area treated (ha)" placeholder="e.g., 12.5 ha" />
          <Field label="Materials used" placeholder="e.g., Gypsum 62 t, Compost 250 t" />
        </div>
        <div className="fx-field" style={{ marginBottom: 14 }}>
          <label className="fx-field-label">Issues encountered</label>
          <textarea className="fx-field-input" style={{ minHeight: 60 }} placeholder="Equipment breakdowns, weather delays, material shortages, deviations from specification…" />
        </div>
        <div className="fx-field">
          <label className="fx-field-label">Photos taken (count &amp; subjects)</label>
          <input className="fx-field-input" placeholder="e.g., 12 photos — soil profile, amendment spreading, GPS points P04–P07" />
        </div>
      </div>
    </div>

    <div className="fx-form-block">
      <div className="fx-form-header"><span className="fx-form-title">Field measurements</span></div>
      <div className="fx-form-body">
        <table className="fx-log-table">
          <thead>
            <tr><th style={{ width: 30 }}>#</th><th>GPS Point</th><th>pH</th><th>EC (dS/m)</th><th>Moisture</th><th>Munsell Color</th><th>Notes</th></tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((n) => (
              <tr key={n}>
                <td className="fx-row-num">{n}</td>
                <td><input className="fx-cell-input" placeholder="Lat, Lon" /></td>
                <td><input className="fx-cell-input" placeholder="—" /></td>
                <td><input className="fx-cell-input" placeholder="—" /></td>
                <td><input className="fx-cell-input" placeholder="—" /></td>
                <td><input className="fx-cell-input" placeholder="—" /></td>
                <td><input className="fx-cell-input" placeholder="—" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="fx-form-block">
      <div className="fx-form-header"><span className="fx-form-title">End-of-day sign-off</span></div>
      <div className="fx-form-body">
        <div className="fx-sig-row" style={{ padding: "14px 0" }}>
          <div className="fx-sig-label">Field Lead</div>
          <div className="fx-sig-line" />
          <div className="fx-sig-line" />
          <div className="fx-sig-date">Date: ___/___</div>
        </div>
      </div>
    </div>
  </div>
)
