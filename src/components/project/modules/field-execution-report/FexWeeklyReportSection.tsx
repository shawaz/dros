import React from "react"
import type { FieldExecutionReport } from "@/data/field-execution-report"
import { FexSectionBar } from "./FexSectionBar"

const Field: React.FC<{ label: string; placeholder?: string }> = ({ label, placeholder }) => (
  <div className="fx-field"><label className="fx-field-label">{label}</label><input className="fx-field-input" placeholder={placeholder} /></div>
)

export const FexWeeklyReportSection: React.FC<{ report: FieldExecutionReport }> = ({ report }) => (
  <div>
    <FexSectionBar icon="📋" num="Section 10" title="Weekly Progress Report" color="purple" />
    <p className="rx-section-intro">
      Submit to Project Lead every Friday. Summarizes the week&rsquo;s progress against the
      rehabilitation plan, flags issues, and forecasts next week&rsquo;s activities.
    </p>

    <div className="fx-form-block">
      <div className="fx-form-header"><span className="fx-form-title">Week summary</span></div>
      <div className="fx-form-body">
        <div className="fx-field-row-4">
          <Field label="Week number" placeholder="e.g., Week 6" />
          <Field label="Dates" placeholder="e.g., Jun 16–20" />
          <div className="fx-field">
            <label className="fx-field-label">Current phase</label>
            <select className="fx-field-input"><option>Phase 1</option><option>Phase 2</option><option>Phase 3</option><option>Phase 4</option><option>Phase 5</option><option>Phase 6</option></select>
          </div>
          <div className="fx-field">
            <label className="fx-field-label">On schedule?</label>
            <select className="fx-field-input"><option>On track</option><option>1–2 days behind</option><option>1+ week behind</option><option>Ahead</option><option>Blocked</option></select>
          </div>
        </div>
        <div className="fx-field" style={{ marginBottom: 14 }}>
          <label className="fx-field-label">Achievements this week</label>
          <textarea className="fx-field-input" placeholder="Key tasks completed, areas treated, measurements taken…" />
        </div>
        <div className="fx-field-row">
          <Field label="Total area treated to date (ha)" placeholder="e.g., 45 / 100 ha" />
          <Field label="Trees planted to date" placeholder="e.g., 6,200 / 25,000" />
        </div>
        <div className="fx-field" style={{ marginBottom: 14 }}>
          <label className="fx-field-label">Issues &amp; blockers</label>
          <textarea className="fx-field-input" style={{ minHeight: 60 }} placeholder="Material delays, weather interruptions, gate failures, equipment issues…" />
        </div>
        <div className="fx-field">
          <label className="fx-field-label">Plan for next week</label>
          <textarea className="fx-field-input" style={{ minHeight: 60 }} placeholder="Planned activities, materials needed, crew requirements…" />
        </div>
      </div>
    </div>

    <div className="fx-form-block">
      <div className="fx-form-header"><span className="fx-form-title">Key metrics this week</span></div>
      <div className="fx-form-body">
        <div className="fx-field-row-4">
          <Field label="Avg soil EC (dS/m)" placeholder="—" />
          <Field label="Avg soil pH" placeholder="—" />
          <Field label="Avg moisture (20 cm)" placeholder="—" />
          <Field label="Survival rate (%)" placeholder="—" />
        </div>
        <div className="fx-field-row">
          <div className="fx-field">
            <label className="fx-field-label">HSE incidents this week</label>
            <select className="fx-field-input"><option>0 — No incidents</option><option>1 Near miss</option><option>1+ First aid</option><option>Medical treatment</option></select>
          </div>
          <Field label="Working days lost" placeholder="e.g., 0" />
        </div>
      </div>
    </div>

    <div className="fx-sig-block">
      <div className="fx-sig-row"><div className="fx-sig-label">Field Lead</div><div className="fx-sig-line" /><div className="fx-sig-line" /><div className="fx-sig-date">Date: ___/___</div></div>
      <div className="fx-sig-row"><div className="fx-sig-label">Project Lead</div><div className="fx-sig-line" /><div className="fx-sig-line" /><div className="fx-sig-date">Date: ___/___</div></div>
    </div>

    <div className="rx-disclaimer">
      <p>{report.disclaimerBody}</p>
      <p style={{ marginTop: 12 }}>{report.disclaimerFooter}</p>
    </div>
  </div>
)
