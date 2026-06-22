"use client"

import React from "react"
import { TreatmentSubsection } from "@/data/rehabilitation-report"

interface TreatmentPlanSectionProps {
  treatment: TreatmentSubsection[]
}

export const TreatmentPlanSection: React.FC<TreatmentPlanSectionProps> = ({ treatment }) => (
  <section className="rx-section">
    <div className="rx-section-num">03</div>
    <h2 className="rx-section-title">Treatment Plan</h2>
    <p className="rx-section-intro">
      Sequenced amendment and remediation steps. Each gate condition must be satisfied before
      proceeding to the steps beneath it.
    </p>

    {treatment.map((subsection) => (
      <div key={subsection.title}>
        <h3 className="rx-subhead">{subsection.title}</h3>
        {subsection.gate && (
          <div className="rx-gate">
            <span className="rx-gate-label">Gate</span>
            <span className="rx-gate-desc">
              <b>{subsection.gate.label}:</b> {subsection.gate.description}
            </span>
          </div>
        )}
        {subsection.steps.map((step, i) => (
          <div key={i} className="rx-step">
            <span className="rx-step-desc">{step.description}</span>
            {step.dose && <span className="rx-dose">{step.dose}</span>}
          </div>
        ))}
      </div>
    ))}
  </section>
)
