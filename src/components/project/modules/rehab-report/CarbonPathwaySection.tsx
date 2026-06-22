"use client"

import React from "react"
import { CarbonPathwayRow, RegistrationStep } from "@/data/rehabilitation-report"

interface CarbonPathwaySectionProps {
  carbonPathway: CarbonPathwayRow[]
  registrationSteps: RegistrationStep[]
}

export const CarbonPathwaySection: React.FC<CarbonPathwaySectionProps> = ({
  carbonPathway,
  registrationSteps,
}) => (
  <section className="rx-section">
    <div className="rx-section-num">06</div>
    <h2 className="rx-section-title">Carbon Credit Pathway</h2>
    <p className="rx-section-intro">
      Projected crediting parameters and the registration sequence to verified-credit issuance.
    </p>

    <table className="rx-data-table">
      <thead>
        <tr>
          <th>Parameter</th>
          <th>Value</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {carbonPathway.map((row) => (
          <tr key={row.parameter}>
            <td>{row.parameter}</td>
            <td className="rx-mono-cell">{row.value}</td>
            <td>{row.notes}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <h3 className="rx-subhead">Registration Sequence</h3>
    {registrationSteps.map((step, i) => (
      <div key={i} className="rx-step">
        <span className="rx-step-desc">{step.description}</span>
      </div>
    ))}
  </section>
)
