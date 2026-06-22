"use client"

import React from "react"
import { FlaskConical, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { LabReport } from "@/data/lab-report"
import { assessPhysical, assessChemical, assessCarbon, assessMicrobial, assessWater } from "@/lib/lab-report-assessment"
import { StatusPill } from "./StatusPill"

interface LabReportViewProps {
  labReport: LabReport
  onEdit: () => void
}

const PendingSection: React.FC<{ title: string }> = ({ title }) => (
  <div className="bg-white border border-border rounded-xl p-6 flex flex-col items-center text-center gap-2">
    <FlaskConical className="w-5 h-5 text-dim" />
    <h3 className="font-sans text-sm font-semibold text-ink">{title}</h3>
    <p className="text-xs text-muted-custom">Pending lab sample</p>
  </div>
)

const Bullets: React.FC<{ bullets: string[] }> = ({ bullets }) =>
  bullets.length > 0 ? (
    <ul className="mt-3 space-y-1">
      {bullets.map((b) => (
        <li key={b} className="text-xs text-ink2 flex items-start gap-1.5">
          <span className="text-dim mt-0.5">—</span>
          <span>{b}</span>
        </li>
      ))}
    </ul>
  ) : null

export const LabReportView: React.FC<LabReportViewProps> = ({ labReport, onEdit }) => {
  const physical = labReport.physical ? assessPhysical(labReport.physical) : null
  const chemical = labReport.chemical ? assessChemical(labReport.chemical) : null
  const carbon = labReport.carbon ? assessCarbon(labReport.carbon) : null
  const microbial = labReport.microbial ? assessMicrobial(labReport.microbial) : null
  const water = labReport.water ? assessWater(labReport.water) : null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-custom">
          Field lab report — last updated {new Date(labReport.submittedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Pencil className="w-3.5 h-3.5" />
          Edit Lab Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {physical ? (
          <div className="bg-white border border-border rounded-xl p-5">
            <h3 className="font-sans text-sm font-semibold text-ink">1. Physical Soil Properties</h3>
            <table className="w-full mt-3 text-xs">
              <thead>
                <tr className="text-left text-[10px] text-dim uppercase tracking-wide">
                  <th className="pb-2 font-medium">Parameter</th>
                  <th className="pb-2 font-medium">Result</th>
                  <th className="pb-2 font-medium">Optimal</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {physical.rows.map((r) => (
                  <tr key={r.parameter} className="border-t border-border">
                    <td className="py-1.5 text-ink2">{r.parameter}</td>
                    <td className="py-1.5 font-mono text-ink">{r.result}</td>
                    <td className="py-1.5 font-mono text-muted-custom">{r.optimal}</td>
                    <td className="py-1.5"><StatusPill status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Bullets bullets={physical.bullets} />
          </div>
        ) : (
          <PendingSection title="1. Physical Soil Properties" />
        )}

        {chemical ? (
          <div className="bg-white border border-border rounded-xl p-5">
            <h3 className="font-sans text-sm font-semibold text-ink">2. Chemical Soil Analysis</h3>
            <table className="w-full mt-3 text-xs">
              <thead>
                <tr className="text-left text-[10px] text-dim uppercase tracking-wide">
                  <th className="pb-2 font-medium">Parameter</th>
                  <th className="pb-2 font-medium">Result</th>
                  <th className="pb-2 font-medium">Optimal</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {chemical.rows.map((r) => (
                  <tr key={r.parameter} className="border-t border-border">
                    <td className="py-1.5 text-ink2">{r.parameter}</td>
                    <td className="py-1.5 font-mono text-ink">{r.result}</td>
                    <td className="py-1.5 font-mono text-muted-custom">{r.optimal}</td>
                    <td className="py-1.5"><StatusPill status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Bullets bullets={chemical.bullets} />
          </div>
        ) : (
          <PendingSection title="2. Chemical Soil Analysis" />
        )}
      </div>

      {carbon ? (
        <div className="bg-white border border-border rounded-xl p-5">
          <h3 className="font-sans text-sm font-semibold text-ink">3. Carbon Sequestration Potential</h3>
          <table className="w-full mt-3 text-xs">
            <thead>
              <tr className="text-left text-[10px] text-dim uppercase tracking-wide">
                <th className="pb-2 font-medium">Parameter</th>
                <th className="pb-2 font-medium">Value</th>
                <th className="pb-2 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {carbon.rows.map((r) => (
                <tr key={r.parameter} className="border-t border-border">
                  <td className="py-1.5 text-ink2">{r.parameter}</td>
                  <td className="py-1.5 font-mono text-ink">{r.value}</td>
                  <td className="py-1.5 text-muted-custom">{r.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <PendingSection title="3. Carbon Sequestration Potential" />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {microbial ? (
          <div className="bg-white border border-border rounded-xl p-5">
            <h3 className="font-sans text-sm font-semibold text-ink">4. Soil Microbial Analysis</h3>
            <table className="w-full mt-3 text-xs">
              <thead>
                <tr className="text-left text-[10px] text-dim uppercase tracking-wide">
                  <th className="pb-2 font-medium">Parameter</th>
                  <th className="pb-2 font-medium">Result</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {microbial.rows.map((r) => (
                  <tr key={r.parameter} className="border-t border-border">
                    <td className="py-1.5 text-ink2">{r.parameter}</td>
                    <td className="py-1.5 font-mono text-ink">{r.result}</td>
                    <td className="py-1.5"><StatusPill status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {microbial.detectedSpecies.length > 0 && (
              <>
                <h4 className="text-xs font-semibold text-ink2 mt-4 mb-1.5">Detected Species</h4>
                <table className="w-full text-xs">
                  <tbody>
                    {microbial.detectedSpecies.map((s) => (
                      <tr key={s.species} className="border-t border-border">
                        <td className="py-1.5 font-mono text-ink">{s.species}</td>
                        <td className="py-1.5 text-muted-custom">{s.function}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
            <Bullets bullets={microbial.bullets} />
          </div>
        ) : (
          <PendingSection title="4. Soil Microbial Analysis" />
        )}

        {water ? (
          <div className="bg-white border border-border rounded-xl p-5">
            <h3 className="font-sans text-sm font-semibold text-ink">5. Water Availability</h3>
            <table className="w-full mt-3 text-xs">
              <thead>
                <tr className="text-left text-[10px] text-dim uppercase tracking-wide">
                  <th className="pb-2 font-medium">Parameter</th>
                  <th className="pb-2 font-medium">Value</th>
                  <th className="pb-2 font-medium">Assessment</th>
                </tr>
              </thead>
              <tbody>
                {water.map((r) => (
                  <tr key={r.parameter} className="border-t border-border">
                    <td className="py-1.5 text-ink2">{r.parameter}</td>
                    <td className="py-1.5 font-mono text-ink">{r.value}</td>
                    <td className="py-1.5 text-muted-custom">{r.assessment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <PendingSection title="5. Water Availability" />
        )}
      </div>
    </div>
  )
}
