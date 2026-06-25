"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import "@/styles/formal-report.css"

export interface TocSection {
  id: string
  label: string
  num: string
}

interface ReportLayoutProps {
  backHref?: string
  backLabel?: string
  reportType: string
  sections: TocSection[]
  children: React.ReactNode
  asInline?: boolean
}

export const ReportLayout: React.FC<ReportLayoutProps> = ({
  backHref,
  backLabel,
  reportType,
  sections,
  children,
  asInline,
}) => {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "")

  useEffect(() => {
    if (asInline) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            break
          }
        }
      },
      { rootMargin: "-5% 0px -85% 0px" }
    )
    for (const sec of sections) {
      const el = document.getElementById(sec.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [sections, asInline])

  if (asInline) {
    return <>{children}</>
  }

  return (
    <div className="rl-page">
      <aside className="rl-toc">
        <div className="rl-toc-type">{reportType}</div>
        <nav className="rl-toc-nav">
          {sections.map((sec) => (
            <button
              key={sec.id}
              className={`rl-toc-link${activeId === sec.id ? " rl-active" : ""}`}
              onClick={() => {
                document.getElementById(sec.id)?.scrollIntoView({ behavior: "smooth", block: "start" })
                setActiveId(sec.id)
              }}
            >
              <span className="rl-toc-num">{sec.num}</span>
              {sec.label}
            </button>
          ))}
        </nav>
      </aside>
      <div className="rl-main">
        <div className="rl-back-row">
          <Link href={backHref!} className="rl-back-link">
            ← {backLabel}
          </Link>
        </div>
        {children}
      </div>
    </div>
  )
}
