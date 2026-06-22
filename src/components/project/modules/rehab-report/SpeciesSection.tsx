"use client"

import React from "react"
import { SpeciesCard } from "@/data/rehabilitation-report"

interface SpeciesSectionProps {
  species: SpeciesCard[]
}

export const SpeciesSection: React.FC<SpeciesSectionProps> = ({ species }) => (
  <section className="rx-section">
    <div className="rx-section-num">04</div>
    <h2 className="rx-section-title">Species Selection</h2>
    <p className="rx-section-intro">
      Native, arid-adapted species selected for this site, ranked by planting priority.
    </p>

    <div className="rx-species-grid">
      {[...species]
        .sort((a, b) => a.priorityRank - b.priorityRank)
        .map((s) => (
          <div key={s.name} className="rx-species-card">
            <span className="rx-species-rank">#{s.priorityRank}</span>
            <div className="rx-species-name">{s.name}</div>
            <div className="rx-species-latin">{s.latinName}</div>
            <div className="rx-species-role">{s.role}</div>
            <p className="rx-species-desc">{s.description}</p>
          </div>
        ))}
    </div>
  </section>
)
