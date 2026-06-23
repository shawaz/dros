import React from "react"
import type { FieldExecutionReport } from "@/data/field-execution-report"
import { FexSectionBar } from "./FexSectionBar"
import { FexChecklist } from "./FexChecklist"

export const FexHseSection: React.FC<{ report: FieldExecutionReport }> = ({ report }) => (
  <div>
    <FexSectionBar icon="🛡" num="Section 09" title="Health, Safety & Environment" color="crit" />

    <div className="fx-gate fx-c-crit">
      <div className="fx-gate-icon">!</div>
      <div className="fx-gate-body">{report.hseHeatNote}</div>
    </div>

    <div className="fx-form-block">
      <div className="fx-form-header"><span className="fx-form-title">Daily HSE briefing checklist</span></div>
      <div className="fx-form-body">
        <FexChecklist items={report.hseBriefing} />
      </div>
    </div>

    <div className="fx-form-block">
      <div className="fx-form-header"><span className="fx-form-title">Incident log</span></div>
      <div className="fx-form-body">
        <div className="fx-field-row">
          <div className="fx-field">
            <label className="fx-field-label">Incident type</label>
            <select className="fx-field-input"><option>No incident</option><option>Near miss</option><option>First aid</option><option>Medical treatment</option><option>Lost time injury</option><option>Environmental spill</option></select>
          </div>
          <div className="fx-field"><label className="fx-field-label">Date &amp; time</label><input className="fx-field-input" type="datetime-local" /></div>
        </div>
        <div className="fx-field" style={{ marginBottom: 14 }}>
          <label className="fx-field-label">Description</label>
          <textarea className="fx-field-input" style={{ minHeight: 60 }} placeholder="Describe what happened, who was involved, and what immediate action was taken…" />
        </div>
        <div className="fx-field">
          <label className="fx-field-label">Corrective action</label>
          <textarea className="fx-field-input" style={{ minHeight: 60 }} placeholder="What was done to prevent recurrence…" />
        </div>
      </div>
    </div>
  </div>
)
