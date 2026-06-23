import React from "react"
import type { FieldExecutionReport } from "@/data/field-execution-report"

export const FexCoverSection: React.FC<{ report: FieldExecutionReport }> = ({ report }) => {
  const date = new Date(report.generatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  return (
    <div className="rx-cover">
      <div className="rx-badge">DROS FIELD OPERATIONS</div>
      <h1 className="rx-title">{report.projectName}</h1>
      <p className="rx-subtitle">Field Execution Plan</p>
      <table className="rx-meta-table">
        <tbody>
          <tr><td>Document ID</td><td>{report.docId}</td></tr>
          <tr><td>Parcel / Zone</td><td>{report.parcel}</td></tr>
          <tr><td>Area</td><td>{report.areaHa} ha</td></tr>
          <tr><td>Linked Plan</td><td>{report.linkedPlan}</td></tr>
          <tr><td>Field Lead</td><td>{report.fieldLead}</td></tr>
          <tr><td>Team Size</td><td>{report.teamSize} personnel</td></tr>
          <tr><td>Start Date</td><td>{report.startDate}</td></tr>
          <tr><td>Current Phase</td><td>{report.currentPhase}</td></tr>
          <tr><td>Generated</td><td>{date}</td></tr>
        </tbody>
      </table>
    </div>
  )
}
