"use client"

import React, { useState } from "react"
import type { FexCheckItem } from "@/data/field-execution-report"

const CheckIcon = () => (
  <svg viewBox="0 0 12 12" fill="none">
    <path d="M2.5 6l3 3 4.5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// Standalone interactive checklist (irrigation, HSE briefing). Toggles are
// local-only, mirroring the print template's client-side behaviour.
export const FexChecklist: React.FC<{ items: FexCheckItem[] }> = ({ items }) => {
  const [done, setDone] = useState<Set<number>>(new Set())
  const toggle = (i: number) =>
    setDone((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} className="fx-check-item" onClick={() => toggle(i)}>
          <div className={`fx-check-box${done.has(i) ? " fx-done" : ""}`}>
            <CheckIcon />
          </div>
          <div>
            <div className="fx-check-title">{item.title}</div>
            {item.detail && <div className="fx-check-detail">{item.detail}</div>}
          </div>
        </div>
      ))}
    </div>
  )
}
