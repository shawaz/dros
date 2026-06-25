"use client"

import React from "react"
import { useScrollSpy } from "@/hooks/useScrollSpy"
import { ReportErrorBoundary } from "@/components/project/ReportErrorBoundary"

export interface SectionedReportSection {
  id: string
  label: string
  node: React.ReactNode
}

interface SectionedReportProps {
  /** Rendered full-bleed as the first card (its own padding). */
  cover?: React.ReactNode
  /** Nav label for the cover card. */
  coverLabel?: string
  sections: SectionedReportSection[]
  /** Extra sections rendered (as raw nodes) before the cover and listed first in the menu. */
  leading?: SectionedReportSection[]
  /** Rendered at the top of the section menu (e.g. generate/regenerate button). */
  toolbar?: React.ReactNode
}

/**
 * Stage content laid out like the Satellite Assessment: a sticky left section
 * menu and a right column of spaced cards. The menu tracks scroll position and
 * each section component keeps its rx- styling via the `rx-report rx-card` wrapper.
 */
export const SectionedReport: React.FC<SectionedReportProps> = ({
  cover,
  coverLabel = "Overview",
  sections,
  leading = [],
  toolbar,
}) => {
  const navItems = [
    ...leading.map((s) => ({ id: s.id, label: s.label })),
    ...(cover ? [{ id: "cover", label: coverLabel }] : []),
    ...sections.map((s) => ({ id: s.id, label: s.label })),
  ]
  const { active, scrollTo } = useScrollSpy(navItems.map((s) => s.id))

  return (
    <div className="flex flex-col lg:flex-row gap-5 items-start">
      {/* Section menu */}
      <nav className="w-full lg:w-56 lg:shrink-0 lg:sticky lg:top-4 bg-white border border-border rounded-xl p-2">
        {toolbar && <div className="px-1 pt-1 pb-3 mb-1 border-b border-border">{toolbar}</div>}
        <div className="text-[10px] font-mono uppercase tracking-wider text-dim px-2.5 pt-1 pb-2">
          Sections
        </div>
        <ul className="flex flex-col gap-0.5">
          {navItems.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => scrollTo(s.id)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  active === s.id
                    ? "bg-green-lt text-green-custom font-semibold"
                    : "text-muted-custom hover:bg-ws hover:text-ink"
                }`}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Content */}
      <div className="flex-1 min-w-0 w-full space-y-6 pb-6">
        {leading.map((s) => (
          <div key={s.id} id={s.id} className="scroll-mt-4">
            {s.node}
          </div>
        ))}
        {cover && (
          <div id="cover" className="rx-report rx-card overflow-hidden scroll-mt-4">
            <ReportErrorBoundary>{cover}</ReportErrorBoundary>
          </div>
        )}
        {sections.map((s) => (
          <div key={s.id} id={s.id} className="rx-report rx-card scroll-mt-4">
            <div className="rx-card-body">
              <ReportErrorBoundary>{s.node}</ReportErrorBoundary>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
