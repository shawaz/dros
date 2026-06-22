"use client"

import React from "react"
import { PriorityProblem } from "@/data/rehabilitation-report"

interface PriorityRankingSectionProps {
  priorityProblems: PriorityProblem[]
}

export const PriorityRankingSection: React.FC<PriorityRankingSectionProps> = ({ priorityProblems }) => (
  <section className="rx-section">
    <div className="rx-section-num">02</div>
    <h2 className="rx-section-title">Priority-Ranked Problems</h2>
    <p className="rx-section-intro">
      Issues identified above, ordered by treatment priority. Critical items must be resolved
      before the corresponding treatment gate (Section 03) opens.
    </p>

    {[...priorityProblems]
      .sort((a, b) => a.rank - b.rank)
      .map((p) => (
        <div key={p.rank} className={`rx-severity-strip rx-p-${p.priority}`}>
          <div className="rx-severity-rank">{p.rank}</div>
          <div className="rx-severity-body">
            <div className="rx-severity-title">{p.problem}</div>
            <div className="rx-severity-meta">
              <b>Evidence:</b> {p.evidence}
              <br />
              <b>If untreated:</b> {p.consequence}
            </div>
          </div>
        </div>
      ))}
  </section>
)
