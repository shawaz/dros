"use client"

import React from "react"
import { MonitoringRow } from "@/data/rehabilitation-report"

interface MonitoringSectionProps {
  monitoring: MonitoringRow[]
}

export const MonitoringSection: React.FC<MonitoringSectionProps> = ({ monitoring }) => (
  <section className="rx-section">
    <div className="rx-section-num">07</div>
    <h2 className="rx-section-title">Monitoring Protocol</h2>
    <p className="rx-section-intro">
      Ongoing measurements required to verify rehabilitation progress and carbon claims.
    </p>

    <table className="rx-data-table">
      <thead>
        <tr>
          <th>Measurement</th>
          <th>Method</th>
          <th>Frequency</th>
          <th>Target</th>
        </tr>
      </thead>
      <tbody>
        {monitoring.map((row) => (
          <tr key={row.measurement}>
            <td>{row.measurement}</td>
            <td>{row.method}</td>
            <td className="rx-mono-cell">{row.frequency}</td>
            <td className="rx-mono-cell">{row.target}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>
)
