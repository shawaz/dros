"use client"

import React, { useMemo, useState, useEffect } from "react"
import { Leaf, Droplets, Wind, ArrowRight, CheckCircle2, AlertTriangle, TreePine, Shrub, Wheat, Apple, Sparkles, Loader2, ShieldCheck } from "lucide-react"
import { recommendSpecies, recommendStrategy } from "@/lib/predict/species-recommender"
import type { SelectedSite } from "./SiteSelectionMap"
import { polygonCentroid } from "@/lib/aoi"

interface AssessmentData {
  rainfall: number
  aridity: number
  ph?: number | null
  ndvi?: number | null
  health?: number | null
}

interface SpeciesRecommendationStepProps {
  site: SelectedSite
  assessment: AssessmentData
  onBack: () => void
  onContinue: () => void
}

interface AiValidationItem {
  id: string
  aiRank: number
  confidence: "high" | "medium" | "low"
  note: string
}

interface AiValidation {
  byId: Record<string, AiValidationItem>
  siteSummary: string | null
  topWarning: string | null
}

const TYPE_ICON: Record<string, React.ReactNode> = {
  tree:     <TreePine className="w-3 h-3" />,
  shrub:    <Shrub className="w-3 h-3" />,
  mangrove: <Leaf className="w-3 h-3" />,
  grass:    <Wheat className="w-3 h-3" />,
  crop:     <Apple className="w-3 h-3" />,
}

const TYPE_COLOR: Record<string, string> = {
  tree:     "bg-green-100 text-green-700",
  shrub:    "bg-lime-100 text-lime-700",
  mangrove: "bg-teal-100 text-teal-700",
  grass:    "bg-yellow-100 text-yellow-700",
  crop:     "bg-orange-100 text-orange-700",
}

const CONFIDENCE_COLOR: Record<string, string> = {
  high:   "text-green-700 bg-green-50 border-green-200",
  medium: "text-amber-700 bg-amber-50 border-amber-200",
  low:    "text-red-700 bg-red-50 border-red-200",
}

const SGI_PROGRAMME_COLOR: Record<string, string> = {
  "National Forests Programme":        "bg-green-100 text-green-700",
  "Coastal Ecosystem Programme":       "bg-teal-100 text-teal-700",
  "Rangeland Rehabilitation Programme":"bg-amber-100 text-amber-700",
  "Anti-desertification Programme":    "bg-orange-100 text-orange-700",
}

export const SpeciesRecommendationStep: React.FC<SpeciesRecommendationStepProps> = ({
  site, assessment, onBack, onContinue,
}) => {
  const [aiValidation, setAiValidation] = useState<AiValidation | null>(null)
  const [aiLoading, setAiLoading]       = useState(true)
  const [aiError, setAiError]           = useState(false)

  const center = useMemo(() => polygonCentroid(site.polygon), [site.polygon])

  const strategy = useMemo(() => recommendStrategy({
    lat: center.lat, lng: center.lng,
    rainfall: assessment.rainfall,
    aridity: assessment.aridity,
    ph: assessment.ph,
    ndvi: assessment.ndvi,
    health: assessment.health,
  }), [center, assessment])

  const recommendations = useMemo(() => recommendSpecies({
    lat: center.lat, lng: center.lng,
    rainfall: assessment.rainfall,
    aridity: assessment.aridity,
    ph: assessment.ph,
    ndvi: assessment.ndvi,
    health: assessment.health,
  }, 5), [center, assessment])

  // Fire AI validation in background immediately on mount
  useEffect(() => {
    let cancelled = false
    setAiLoading(true)
    setAiError(false)
    setAiValidation(null)

    fetch("/api/species-recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lat:      center.lat,
        lng:      center.lng,
        rainfall: assessment.rainfall,
        aridity:  assessment.aridity,
        ph:       assessment.ph ?? null,
        ndvi:     assessment.ndvi ?? null,
        health:   assessment.health ?? null,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        if (data.available) {
          setAiValidation({ byId: data.byId, siteSummary: data.siteSummary, topWarning: data.topWarning })
        } else {
          setAiError(true)
        }
      })
      .catch(() => {
        if (!cancelled) setAiError(true)
      })
      .finally(() => {
        if (!cancelled) setAiLoading(false)
      })

    return () => { cancelled = true }
  }, [center, assessment])

  // If AI validation is available, sort recommendations by AI rank
  const displayRecs = useMemo(() => {
    if (!aiValidation) return recommendations
    return [...recommendations].sort((a, b) => {
      const aRank = aiValidation.byId[a.species.id]?.aiRank ?? 99
      const bRank = aiValidation.byId[b.species.id]?.aiRank ?? 99
      return aRank - bRank
    })
  }, [recommendations, aiValidation])

  return (
    <div className="space-y-4">
      {/* Strategy card */}
      <div className="bg-white border border-border rounded-xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
            <TreePine className="w-5 h-5 text-green-custom" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-sans text-sm font-bold text-ink">{strategy.projectType}</h3>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${SGI_PROGRAMME_COLOR[strategy.sgiProgramme] ?? "bg-gray-100 text-gray-600"}`}>
                SGI · {strategy.sgiProgramme}
              </span>
            </div>
            <p className="text-xs text-muted-custom leading-relaxed">{strategy.rationale}</p>
          </div>
        </div>

        {/* Site indicators */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { icon: <Droplets className="w-3.5 h-3.5" />, label: "Rainfall", value: `${assessment.rainfall} mm/yr` },
            { icon: <Wind className="w-3.5 h-3.5" />, label: "Aridity Index", value: assessment.aridity.toFixed(2) },
            { icon: <Leaf className="w-3.5 h-3.5" />, label: "NDVI", value: assessment.ndvi != null ? assessment.ndvi.toFixed(3) : "—" },
          ].map(({ icon, label, value }) => (
            <div key={label} className="bg-ws rounded-lg px-3 py-2">
              <div className="flex items-center gap-1 text-muted-custom mb-0.5">{icon}<span className="text-[10px] uppercase tracking-wide font-medium">{label}</span></div>
              <div className="text-xs font-bold text-ink tabular-nums">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Species recommendations */}
      <div className="bg-white border border-border rounded-xl p-5">
        {/* Header with AI status */}
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className="font-sans text-sm font-semibold text-ink">Recommended Species</h3>
          <div className="shrink-0">
            {aiLoading && (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-muted-custom bg-gray-50 border border-border rounded-full px-2 py-0.5">
                <Loader2 className="w-3 h-3 animate-spin" />
                AI validating…
              </span>
            )}
            {!aiLoading && aiValidation && (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
                <ShieldCheck className="w-3 h-3" />
                AI Validated
              </span>
            )}
            {!aiLoading && aiError && (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-muted-custom bg-gray-50 border border-border rounded-full px-2 py-0.5">
                Rule-based only
              </span>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-custom mb-4">
          Top 5 from 60+ species ranked for {center.lat.toFixed(3)}°N, {center.lng.toFixed(3)}°E.
          {aiValidation ? " Rankings and notes reviewed by AI ecologist." : ""}
        </p>

        {/* AI site summary */}
        {aiValidation?.siteSummary && (
          <div className="mb-4 flex gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-blue-800 leading-relaxed">{aiValidation.siteSummary}</p>
          </div>
        )}

        {/* AI top warning */}
        {aiValidation?.topWarning && (
          <div className="mb-4 flex gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-800 leading-relaxed">{aiValidation.topWarning}</p>
          </div>
        )}

        <div className="space-y-3">
          {displayRecs.map((rec, i) => {
            const pct     = Math.round(rec.suitabilityScore * 100)
            const survPct = Math.round(rec.survivalProbability * 100)
            const barColor = pct >= 70 ? "bg-green-500" : pct >= 45 ? "bg-amber-400" : "bg-red-400"
            const aiItem  = aiValidation?.byId[rec.species.id]

            return (
              <div
                key={rec.species.id}
                className={`rounded-xl border p-4 transition-colors ${
                  aiItem?.confidence === "low"
                    ? "border-red-200 bg-red-50/30"
                    : "border-border hover:border-green-custom/40"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Rank */}
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 ${
                    i === 0 ? "bg-green-custom text-white" : "bg-ws text-muted-custom"
                  }`}>
                    {i + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Header row */}
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-sm font-bold text-ink">{rec.species.nameEn}</span>
                      <span className="text-sm text-muted-custom font-medium">{rec.species.nameAr}</span>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${TYPE_COLOR[rec.species.type]}`}>
                        {TYPE_ICON[rec.species.type]}
                        {rec.species.type.charAt(0).toUpperCase() + rec.species.type.slice(1)}
                      </span>
                      {rec.species.sgiCompliant && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                          SGI ✓
                        </span>
                      )}
                      {aiItem && (
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${CONFIDENCE_COLOR[aiItem.confidence]}`}>
                          AI: {aiItem.confidence}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] italic text-muted-custom mb-2">{rec.species.nameScientific}</p>

                    {/* Suitability bar */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[11px] font-bold text-ink tabular-nums w-14 text-right">
                        {pct}% fit · {survPct}% surv.
                      </span>
                    </div>

                    {/* Stats row */}
                    <div className="flex gap-3 text-[11px] text-muted-custom mb-3">
                      <span><span className="font-semibold text-ink">{rec.species.carbonTco2HaYr}</span> tCO₂/ha/yr</span>
                      {rec.species.waterReqM3PerTreeYr > 0 && (
                        <span><span className="font-semibold text-ink">{rec.species.waterReqM3PerTreeYr}</span> m³/tree/yr</span>
                      )}
                    </div>

                    {/* AI expert note — shown when available, replaces static note */}
                    {aiItem ? (
                      <div className="flex gap-1.5 mb-2">
                        <Sparkles className="w-3 h-3 text-blue-400 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-blue-800 leading-snug">{aiItem.note}</p>
                      </div>
                    ) : (
                      <>
                        {/* Rule-based match reasons */}
                        {rec.matchReasons.length > 0 && (
                          <div className="flex flex-col gap-1 mb-2">
                            {rec.matchReasons.map((r) => (
                              <div key={r} className="flex items-start gap-1.5">
                                <CheckCircle2 className="w-3 h-3 text-green-500 mt-px shrink-0" />
                                <span className="text-[11px] text-muted-custom">{r}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {rec.warnings.length > 0 && (
                          <div className="flex flex-col gap-1 mb-2">
                            {rec.warnings.map((w) => (
                              <div key={w} className="flex items-start gap-1.5">
                                <AlertTriangle className="w-3 h-3 text-amber-500 mt-px shrink-0" />
                                <span className="text-[11px] text-amber-700">{w}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        <p className="text-[11px] text-muted-custom mt-2 leading-snug border-t border-border pt-2">
                          {rec.species.suitabilityNote}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Nav */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg text-sm font-semibold border border-border bg-white text-ink hover:bg-gray-50 transition-colors cursor-pointer"
        >
          ← Back
        </button>
        <button
          onClick={onContinue}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-green-custom text-white hover:bg-[#257a4a] transition-colors cursor-pointer"
        >
          Continue to Site Assessment
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
