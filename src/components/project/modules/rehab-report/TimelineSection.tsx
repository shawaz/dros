"use client"

import React from "react"
import { TimelinePhase } from "@/data/rehabilitation-report"

interface TimelineSectionProps {
  timeline: TimelinePhase[]
  totalCostSar: number
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ timeline, totalCostSar }) => (
  <section className="rx-section">
    <div className="rx-section-num">05</div>
    <h2 className="rx-section-title">Implementation Timeline</h2>
    <p className="rx-section-intro">Phased execution schedule with per-phase cost.</p>

    <div className="rx-phase-tl">
      {timeline.map((phase) => (
        <div key={phase.name} className="rx-phase">
          <span className={`rx-phase-dot rx-dot-${phase.dotColor}`} />
          <div className="rx-phase-head">
            <span className="rx-phase-name">{phase.name}</span>
            <span className="rx-phase-range">{phase.monthRange}</span>
          </div>
          <div className="rx-phase-cost">{phase.cost}</div>
          <p className="rx-phase-desc">{phase.description}</p>
        </div>
      ))}
    </div>

    <div className="rx-proc-total">
      <span className="rx-proc-total-label">Total Program Cost</span>
      <span className="rx-proc-total-value">{Math.round(totalCostSar).toLocaleString("en-US")} SAR</span>
    </div>
  </section>
)
