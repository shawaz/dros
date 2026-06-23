"use client"

import React, { useState } from "react"
import type { FieldExecutionReport } from "@/data/field-execution-report"
import { FexSectionBar } from "./FexSectionBar"
import { fxColor } from "./helpers"

const CheckIcon = () => (
  <svg viewBox="0 0 12 12" fill="none">
    <path d="M2.5 6l3 3 4.5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const FexPreMobSection: React.FC<{ report: FieldExecutionReport }> = ({ report }) => {
  const [done, setDone] = useState<Set<string>>(new Set())
  const toggle = (key: string) =>
    setDone((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })

  const total = report.preMobTotal
  const count = done.size
  const pct = total > 0 ? Math.round((count / total) * 100) : 0

  return (
    <div>
      <FexSectionBar icon="✅" num="Section 01" title="Pre-Mobilization Checklist" color="warn" />
      <p className="rx-section-intro">
        Complete all items before field crew deploys to site. Items marked CRITICAL must be verified
        by the Field Lead with a signature. Do not mobilize with any critical item incomplete.
      </p>

      {report.preMobGroups.map((group, gi) => (
        <div key={group.title} className="fx-form-block">
          <div className="fx-form-header">
            <span className="fx-form-title">{group.title}</span>
            <span className={`fx-st ${fxColor(group.badgeStatus)}`}>{group.badge}</span>
          </div>
          <div className="fx-form-body">
            {group.items.map((item, ii) => {
              const key = `${gi}-${ii}`
              return (
                <div key={key} className="fx-check-item" onClick={() => toggle(key)}>
                  <div className={`fx-check-box${done.has(key) ? " fx-done" : ""}`}>
                    <CheckIcon />
                  </div>
                  <div>
                    <div className="fx-check-title">{item.title}</div>
                    {item.detail && <div className="fx-check-detail">{item.detail}</div>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      <div className="fx-progress">
        <span className="fx-progress-count">{count} / {total}</span>
        <span className="fx-progress-label">items completed</span>
        <div className="fx-progress-bar"><div className="fx-progress-fill" style={{ width: `${pct}%` }} /></div>
      </div>
    </div>
  )
}
