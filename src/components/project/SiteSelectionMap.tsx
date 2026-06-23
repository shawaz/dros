"use client"

import React, { useState, useRef, useEffect } from "react"
import dynamic from "next/dynamic"
import { Layers, Search, Loader2, Sparkles, MapPin } from "lucide-react"
import type { RecommendedLocation } from "@/lib/location-recommender"

const LeafletPicker = dynamic(
  () => import("./LeafletPicker").then((m) => m.LeafletPicker),
  { ssr: false }
)

export interface SelectedSite {
  lat: number
  lng: number
  radiusM: number
}

interface SiteSelectionMapProps {
  onContinue: (site: SelectedSite) => void
}

const DEFAULT_RADIUS_M = 1500

export const SiteSelectionMap: React.FC<SiteSelectionMapProps> = ({ onContinue }) => {
  const [showNdvi, setShowNdvi] = useState(true)
  const [point, setPoint]       = useState<{ lat: number; lng: number } | null>(null)
  const [radiusM, setRadiusM]   = useState(DEFAULT_RADIUS_M)
  const [flyTarget, setFlyTarget] = useState<{ lat: number; lng: number; ts: number } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searching, setSearching]     = useState(false)
  const [recommending, setRecommending] = useState(false)
  const [recommendations, setRecommendations] = useState<RecommendedLocation[] | null>(null)
  const [recSummary, setRecSummary]   = useState<string>("")
  const [recAiGenerated, setRecAiGenerated] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  const areaHa = Math.round((Math.PI * radiusM * radiusM) / 10000)

  // Whenever the pin moves, automatically ask the recommender for the best
  // restoration sites near it. Debounced so dragging/clicking around the map
  // doesn't fire a request per pixel.
  const lat = point?.lat
  const lng = point?.lng
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

  const handlePickRecommendation = (loc: RecommendedLocation) => {
    setPoint({ lat: loc.lat, lng: loc.lng })
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
        setPoint({ lat: data.lat, lng: data.lng })
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
            <h3 className="font-sans text-sm font-semibold text-ink">Select a Site</h3>
            <p className="text-xs text-muted-custom">
              Click anywhere in Saudi Arabia to drop a pin, then size the project area below.
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
            point={point}
            radiusM={radiusM}
            onPick={setPoint}
            flyTarget={flyTarget}
          />
        </div>

        {point && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-custom">Site radius</span>
              <span className="font-mono font-semibold text-ink">
                {(radiusM / 1000).toFixed(1)} km · ~{areaHa.toLocaleString()} ha
              </span>
            </div>
            <input
              type="range"
              min={500}
              max={20000}
              step={100}
              value={radiusM}
              onChange={(e) => setRadiusM(parseInt(e.target.value, 10))}
              className="w-full accent-green-custom cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* AI recommendations for better sites near the dropped pin */}
      {point && (
        <div className="bg-white border border-border rounded-xl p-4">
          <h3 className="font-sans text-sm font-semibold text-ink flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-green-custom" />
            Recommended Sites Near Your Pin
          </h3>
          <p className="text-xs text-muted-custom mb-3">
            AI-ranked locations near your selection with the strongest restoration potential —
            tap one to move your pin there, or keep your own spot.
          </p>

          {recommending && (
            <div className="flex items-center gap-2 text-xs text-muted-custom py-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Scoring nearby sites and ranking with AI…
            </div>
          )}

          {!recommending && recommendations && recommendations.length > 0 && (
            <div className="space-y-3">
              {recSummary && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-green-50 border border-green-100">
                  <Sparkles className="w-3.5 h-3.5 text-green-custom mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-ink leading-relaxed">{recSummary}</p>
                    {!recAiGenerated && (
                      <p className="text-[10px] text-muted-custom mt-1">
                        Ranked by the quantitative model (AI narrative unavailable).
                      </p>
                    )}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {recommendations.map((loc) => (
                  <button
                    key={`${loc.lat},${loc.lng}`}
                    onClick={() => handlePickRecommendation(loc)}
                    className="text-left p-3 rounded-lg border border-border hover:border-green-custom hover:bg-green-50/40 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-semibold text-ink flex items-center gap-1">
                        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-green-custom text-white text-[10px] font-bold">
                          {loc.rank}
                        </span>
                        {loc.region}
                      </span>
                      <span className="text-[10px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full">
                        {loc.suitabilityPct}% fit
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-muted-custom font-mono mb-1">
                      <span>{loc.carbonPotentialTco2Ha} tCO₂/ha/yr</span>
                      <span>{loc.successPct}% success</span>
                      <span>{loc.rainfallMmYr} mm/yr</span>
                    </div>
                    {loc.rationale && (
                      <p className="text-[11px] text-ink/80 leading-snug">{loc.rationale}</p>
                    )}
                    <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-green-custom opacity-0 group-hover:opacity-100 transition-opacity">
                      <MapPin className="w-3 h-3" /> Move pin here
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!recommending && recommendations && recommendations.length === 0 && (
            <p className="text-xs text-muted-custom py-1">
              No stronger nearby sites found — your selected spot is a solid choice.
            </p>
          )}
        </div>
      )}

      <div className="flex justify-end">
        <button
          disabled={!point}
          onClick={() => point && onContinue({ ...point, radiusM })}
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-green-custom text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:bg-[#257a4a] transition-colors"
        >
          Assess This Site →
        </button>
      </div>
    </div>
  )
}
