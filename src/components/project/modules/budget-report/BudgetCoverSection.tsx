import React from "react"
import type { Project } from "@/data/projects"
import type { BudgetReport } from "@/data/budget-report"

interface Props {
  project: Project
  report: BudgetReport
}

export const BudgetCoverSection: React.FC<Props> = ({ project, report }) => {
  const date = new Date(report.generatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  return (
    <div className="rx-cover">
      <div className="rx-badge">DROS FINANCIAL MODEL</div>
      <h1 className="rx-title">{project.name}</h1>
      <p className="rx-subtitle">Budget &amp; Cost Estimation Report</p>
      <table className="rx-meta-table">
        <tbody>
          <tr><td>Document ID</td><td>{report.docId}</td></tr>
          <tr><td>Region</td><td>{project.region}, Saudi Arabia</td></tr>
          <tr><td>Project ID</td><td>{project.id}</td></tr>
          <tr><td>Total Budget</td><td>{report.totalSar.toLocaleString()} SAR</td></tr>
          <tr><td>Cost per Hectare</td><td>{report.costPerHa.toLocaleString()} SAR/ha</td></tr>
          <tr><td>Carbon ROI</td><td>{report.carbonRoiX}× by Year 10</td></tr>
          <tr><td>Breakeven Year</td><td>Year {report.breakevenYear} (carbon offset)</td></tr>
          <tr><td>Report Date</td><td>{date}</td></tr>
        </tbody>
      </table>
    </div>
  )
}
