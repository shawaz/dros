"use client"

import React, { useState, useRef, useEffect } from "react"
import dynamic from "next/dynamic"
import { Layers, Search, Loader2, Sparkles, MapPin, Undo2, Trash2, Pentagon } from "lucide-react"
import type { RecommendedLocation } from "@/lib/location-recommender"
import type { LatLng } from "@/data/projects"
import { polygonAreaHa, polygonCentroid, squareAround } from "@/lib/aoi"

const LeafletPicker = dynamic(
  () => import("./LeafletPicker").then((m) => m.LeafletPicker),
  { ssr: false }
)

export interface SelectedSite {
  polygon: LatLng[]
}

interface SiteSelectionMapProps {
  onContinue: (site: SelectedSite) => void
}

// Compact labelled metric used inside each recommendation row.
const Stat: React.FC<{ value: string; unit?: string; label: string }> = ({ value, unit, label }) => (
  <span className="inline-flex flex-col leading-tight">
    <span className="text-xs font-semibold text-ink tabular-nums">
      {value}
      {unit && <span className="font-normal text-muted-custom"> {unit}</span>}
    </span>
    <span className="text-[10px] text-muted-custom">{label}</span>
  </span>
)

// Maps the recommender's restoration-priority label to a token-based pill style.
function priorityPillClass(priority: string): string {
  const p = priority.toLowerCase()
  if (p.includes("critical") || p.includes("urgent")) return "bg-red-lt text-red-custom"
  if (p.includes("high")) return "bg-amber-lt text-amber-custom"
  return "bg-green-lt text-green-custom"
}

export const SiteSelectionMap: React.FC<SiteSelectionMapProps> = ({ onContinue }) => {
  const [showNdvi, setShowNdvi] = useState(true)
  const [vertices, setVertices] = useState<LatLng[]>([])
  const [flyTarget, setFlyTarget] = useState<{ lat: number; lng: number; ts: number } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searching, setSearching]     = useState(false)
  const [recommending, setRecommending] = useState(false)
  const [recommendations, setRecommendations] = useState<RecommendedLocation[] | null>(null)
  const [recSummary, setRecSummary]   = useState<string>("")
  const [recAiGenerated, setRecAiGenerated] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  const hasArea = vertices.length >= 3
  const areaHa = hasArea ? Math.round(polygonAreaHa(vertices)) : 0
  const centroid = vertices.length > 0 ? polygonCentroid(vertices) : null

  const addVertex = (p: LatLng) => setVertices((vs) => [...vs, p])
  const undoVertex = () => setVertices((vs) => vs.slice(0, -1))
  const clearVertices = () => setVertices([])

  // Once an area exists, ask the recommender for the strongest restoration
  // sites near its centroid. Debounced so adding vertices doesn't fire a
  // request per click.
  const lat = centroid?.lat
  const lng = centroid?.lng
  useEffect(() => {
    if (lat == null || lng == null) {
      setRecommendations(null)
      return
    }
    let cancelled = false
    setRecommending(true)
    const timer = setTimeout(() => {
      fetch("/api/predict/recommend-locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nearLat: lat, nearLng: lng }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (cancelled) return
          if (data.available && Array.isArray(data.locations)) {
            setRecommendations(data.locations)
            setRecSummary(typeof data.summary === "string" ? data.summary : "")
            setRecAiGenerated(Boolean(data.aiGenerated))
          } else {
            setRecommendations([])
            setRecSummary("")
            setRecAiGenerated(false)
          }
        })
        .catch(() => {
          if (!cancelled) {
            setRecommendations([])
            setRecSummary("")
            setRecAiGenerated(false)
          }
        })
        .finally(() => {
          if (!cancelled) setRecommending(false)
        })
    }, 500)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [lat, lng])

  // Picking a recommendation seeds a default square area around it that the
  // user can keep or clear and redraw.
  const handlePickRecommendation = (loc: RecommendedLocation) => {
    setVertices(squareAround(loc.lat, loc.lng))
    setFlyTarget({ lat: loc.lat, lng: loc.lng, ts: Date.now() })
  }

  const handleSearch = async () => {
    const q = searchQuery.trim()
    if (!q) return
    setSearching(true)
    try {
      const res  = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      if (data.available) {
        setFlyTarget({ lat: data.lat, lng: data.lng, ts: Date.now() })
      }
    } catch {
      // silent
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Location search */}
      <div className="bg-white border border-border rounded-xl p-4">
        <h3 className="font-sans text-sm font-semibold text-ink mb-1">Search a Location</h3>
        <p className="text-xs text-muted-custom mb-3">
          Enter a city, region, or landmark in Saudi Arabia to jump to it on the map.
        </p>
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); handleSearch() }}>
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g. Riyadh, Asir, Tabuk, NEOM…"
            className="flex-1 rounded-lg border border-border px-3 py-2 text-sm text-ink placeholder:text-muted-custom focus:outline-none focus:ring-2 focus:ring-green-custom/30 focus:border-green-custom"
          />
          <button
            type="submit"
            disabled={searching || !searchQuery.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-green-custom text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#257a4a] transition-colors cursor-pointer"
          >
            {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Search
          </button>
        </form>
      </div>

      {/* Map */}
      <div className="bg-white border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-sans text-sm font-semibold text-ink">Draw the Project Area</h3>
            <p className="text-xs text-muted-custom">
              Click on the map to drop boundary points. Three or more points define your area.
            </p>
          </div>
          <button
            onClick={() => setShowNdvi((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
              showNdvi
                ? "bg-green-custom border-green-custom text-white"
                : "bg-white border-border text-muted-custom hover:border-green-custom hover:text-green-custom"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            NDVI Overlay
          </button>
        </div>

        <div className="h-[480px] rounded-lg overflow-hidden border border-border">
          <LeafletPicker
            showNdvi={showNdvi}
            vertices={vertices}
            onAddVertex={addVertex}
            flyTarget={flyTarget}
          />
        </div>

        {vertices.length > 0 && (
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex items-baseline gap-2 text-xs">
              <Pentagon className="w-4 h-4 text-green-custom self-center" />
              <span className="font-mono font-semibold text-ink tabular-nums">
                {vertices.length} {vertices.length === 1 ? "point" : "points"}
              </span>
              <span className="text-muted-custom">
                {hasArea ? `· ~${areaHa.toLocaleString()} ha` : "· add at least 3 points"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={undoVertex}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-border text-ink2 hover:border-green-custom hover:text-green-custom transition-colors cursor-pointer"
              >
                <Undo2 className="w-3.5 h-3.5" /> Undo
              </button>
              <button
                onClick={clearVertices}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-border text-ink2 hover:border-red-custom hover:text-red-custom transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* AI recommendations for better sites near the drawn area */}
      {centroid && (
        <div className="bg-white border border-border rounded-xl p-4">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-sans text-sm font-semibold text-ink flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-green-custom" />
              Recommended Sites Near Your Area
            </h3>
            {!recommending && recommendations && recommendations.length > 0 && (
              <span className="text-[11px] font-medium text-muted-custom tabular-nums">
                {recommendations.length} ranked
              </span>
            )}
          </div>
          <p className="text-xs text-ink2 mb-3">
            AI-ranked locations near your selection with the strongest restoration potential.
            Tap one to drop a starter area there, or keep your own outline.
          </p>

          {recommending && (
            <div className="space-y-2" aria-busy="true">
              <div className="flex items-center gap-2 text-xs text-ink2 pb-0.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-green-custom" />
                Scoring nearby sites and ranking with AI…
              </div>
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg border border-border">
                  <div className="w-7 h-7 rounded-full bg-green-lt pulse-dot flex-shrink-0" />
                  <div className="flex-1 space-y-2 py-0.5">
                    <div className="h-3 w-1/3 rounded bg-green-lt pulse-dot" />
                    <div className="h-1.5 w-full rounded bg-green-lt pulse-dot" />
                    <div className="h-2.5 w-2/3 rounded bg-green-lt pulse-dot" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!recommending && recommendations && recommendations.length > 0 && (
            <div className="space-y-3">
              {recSummary && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-green-lt border border-green-mid">
                  <Sparkles className="w-3.5 h-3.5 text-green-custom mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-ink leading-relaxed">{recSummary}</p>
                    {!recAiGenerated && (
                      <p className="text-[11px] text-green-custom/80 mt-1">
                        Ranked by the quantitative model (AI narrative unavailable).
                      </p>
                    )}
                  </div>
                </div>
              )}

              <ul className="rounded-lg border border-border divide-y divide-border overflow-hidden">
                {recommendations.map((loc, i) => (
                  <li key={`${loc.lat},${loc.lng}`}>
                    <button
                      onClick={() => handlePickRecommendation(loc)}
                      style={{ animationDelay: `${i * 60}ms` }}
                      className="rec-in w-full text-left p-3 flex gap-3 bg-white hover:bg-green-lt/50 transition-colors cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-green-custom/40"
                    >
                      <span className="flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-custom text-white text-xs font-bold tabular-nums">
                        {loc.rank}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="min-w-0 flex items-center gap-1.5">
                            <span className="text-sm font-semibold text-ink truncate">{loc.region}</span>
                            {loc.restorationPriority && (
                              <span className={`flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${priorityPillClass(loc.restorationPriority)}`}>
                                {loc.restorationPriority}
                              </span>
                            )}
                          </span>
                          <span className="flex-shrink-0 text-sm font-bold text-green-custom tabular-nums">
                            {loc.suitabilityPct}%
                          </span>
                        </div>

                        {/* Suitability bar */}
                        <div className="mt-1.5 mb-2.5 h-1.5 rounded-full bg-green-lt overflow-hidden">
                          <div
                            className="h-full rounded-full bg-green-custom"
                            style={{ width: `${loc.suitabilityPct}%` }}
                          />
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                          <Stat value={`${loc.carbonPotentialTco2Ha}`} unit="tCO₂/ha" label="Carbon/yr" />
                          <Stat value={`${loc.successPct}%`} label="Success" />
                          <Stat value={`${loc.rainfallMmYr}`} unit="mm" label="Rainfall/yr" />
                          <Stat value={`${loc.waterAccessibilityPct}%`} label="Water access" />
                        </div>

                        {loc.rationale && (
                          <p className="mt-2 text-[11px] text-ink2 leading-snug">{loc.rationale}</p>
                        )}

                        <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-green-custom opacity-0 group-hover:opacity-100 transition-opacity">
                          <MapPin className="w-3 h-3" /> Use this area
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!recommending && recommendations && recommendations.length === 0 && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-lt border border-green-mid text-xs text-ink">
              <MapPin className="w-3.5 h-3.5 text-green-custom flex-shrink-0" />
              No stronger nearby sites found. Your selected spot is already a solid choice.
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end">
        <button
          disabled={!hasArea}
          onClick={() => hasArea && onContinue({ polygon: vertices })}
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-green-custom text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:bg-[#257a4a] transition-colors"
        >
          Assess This Site →
        </button>
      </div>
    </div>
  )
}
