import React from "react"
import type { Project } from "@/data/projects"
import type { BudgetReport } from "@/data/budget-report"
import { fmt } from "./helpers"

export const BudgetCoverSection: React.FC<{ project: Project; report: BudgetReport }> = ({
  project,
  report,
}) => (
    <div className="rx-cover">
      <div className="rx-cover-kicker">{report.docId} · Budget &amp; Estimation</div>
      <h1 className="rx-cover-title">Budget &amp; Cost Estimation Report</h1>
      <p className="rx-cover-sub">{report.subtitle}</p>
      <p className="rx-cover-sub" style={{ marginBottom: 4 }}>
        Prepared for <strong>{project.name}</strong> · {project.region}
      </p>

      <div className="bx-cover-meta">
        <div className="bx-cm-col">
          <div className="bx-cm-row"><div className="bx-cm-key">Budget ID</div><div className="bx-cm-val bx-mono">{report.docId}</div></div>
          <div className="bx-cm-row"><div className="bx-cm-key">Linked plan</div><div className="bx-cm-val bx-mono">{report.linkedPlan}</div></div>
          <div className="bx-cm-row"><div className="bx-cm-key">Area</div><div className="bx-cm-val">{report.areaHa} hectares</div></div>
          <div className="bx-cm-row"><div className="bx-cm-key">Duration</div><div className="bx-cm-val">{report.durationLabel}</div></div>
        </div>
        <div className="bx-cm-col">
          <div className="bx-cm-row"><div className="bx-cm-key">Total budget</div><div className="bx-cm-val bx-mono" style={{ color: "var(--rx-amber)", fontWeight: 600 }}>SAR {fmt(report.totalSar)}</div></div>
          <div className="bx-cm-row"><div className="bx-cm-key">Cost per ha</div><div className="bx-cm-val bx-mono">SAR {fmt(report.costPerHaSar)}</div></div>
          <div className="bx-cm-row"><div className="bx-cm-key">Currency</div><div className="bx-cm-val">{report.currencyNote}</div></div>
          <div className="bx-cm-row"><div className="bx-cm-key">Prepared</div><div className="bx-cm-val">{report.preparedLabel}</div></div>
        </div>
      </div>
    </div>
)
