import React from "react"
import type { Project } from "@/data/projects"
import type { FieldExecutionReport } from "@/data/field-execution-report"

export const FexCoverSection: React.FC<{ project: Project; report: FieldExecutionReport }> = ({
  project,
  report,
}) => (
  <div className="rx-cover">
    <div className="rx-cover-kicker">{report.docId} · Field Execution Template</div>
    <h1 className="rx-cover-title">Field Execution Template</h1>
    <p className="rx-cover-sub">{report.subtitle}</p>
    <p className="rx-cover-sub" style={{ marginBottom: 4 }}>
      Prepared for <strong>{project.name}</strong> · {project.region}
    </p>

    <div className="fx-cover-meta">
      <div className="fx-cm-col">
        <div className="fx-cm-row"><div className="fx-cm-key">Document ID</div><div className="fx-cm-val fx-mono">{report.docId}</div></div>
        <div className="fx-cm-row"><div className="fx-cm-key">Linked plan</div><div className="fx-cm-val fx-mono">{report.linkedPlan}</div></div>
        <div className="fx-cm-row"><div className="fx-cm-key">Parcel</div><div className="fx-cm-val">{report.parcel}</div></div>
        <div className="fx-cm-row"><div className="fx-cm-key">Area</div><div className="fx-cm-val">{report.areaHa} hectares</div></div>
      </div>
      <div className="fx-cm-col">
        <div className="fx-cm-row"><div className="fx-cm-key">Field lead</div><div className="fx-cm-val">{report.fieldLead}</div></div>
        <div className="fx-cm-row"><div className="fx-cm-key">Team size</div><div className="fx-cm-val">{report.teamSize}</div></div>
        <div className="fx-cm-row"><div className="fx-cm-key">Start date</div><div className="fx-cm-val">{report.startDate}</div></div>
        <div className="fx-cm-row"><div className="fx-cm-key">Current phase</div><div className="fx-cm-val">{report.currentPhase}</div></div>
      </div>
    </div>
  </div>
)
