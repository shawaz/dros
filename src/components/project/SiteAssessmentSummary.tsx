"use client"

import React, { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { SelectedSite } from "./SiteSelectionMap"
import { polygonCentroid } from "@/lib/aoi"

interface SiteAssessmentSummaryProps {
  site: SelectedSite
  onBack: () => void
  onCreated: (projectId: string) => void
  onToast: (msg: string) => void
}

interface AssessmentResponse {
  available: boolean
  region?: string
  location?: string
  rainfall?: number
  ph?: number | null
  organicCarbon?: number | null
  nitrogen?: number | null
  sandPct?: number | null
  siltPct?: number | null
  clayPct?: number | null
  textureClass?: string | null
  cec?: number | null
  bulkDensity?: number | null
  health?: number
  risk?: "SEVERE" | "LOW"
  aridity?: number
  satelliteAvailable?: boolean
  ndvi?: number | null
  ndviHistory?: { year: number; ndvi: number }[]
  soilMoistureIndex?: number | null
  reason?: string
}

export const SiteAssessmentSummary: React.FC<SiteAssessmentSummaryProps> = ({
  site,
  onBack,
  onCreated,
  onToast,
}) => {
  const centroid = polygonCentroid(site.polygon)
  const requestKey = `${centroid.lat}:${centroid.lng}:${site.polygon.length}`
  const [response, setResponse] = useState<{ key: string; data: AssessmentResponse } | null>(null)
  const [name, setName] = useState("")
  const [region, setRegion] = useState("")
  const [location, setLocation] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch(`/api/site-assessment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ polygon: site.polygon }),
    })
      .then((res) => res.json())
      .then((data: AssessmentResponse) => {
        setResponse({ key: requestKey, data })
        if (data.available) {
          setRegion(data.region ?? "")
          setLocation(data.location ?? "")
        }
      })
      .catch(() => setResponse({ key: requestKey, data: { available: false, reason: "request_failed" } }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey])

  const loading = response === null || response.key !== requestKey
  const data = response?.key === requestKey ? response.data : null

  const handleCreate = () => {
    if (!data?.available || !name.trim()) return
    setSubmitting(true)
    fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        region: region.trim() || "Saudi Arabia",
        location: location.trim() || `${centroid.lat.toFixed(4)}, ${centroid.lng.toFixed(4)}`,
        polygon: site.polygon,
        rainfall: data.rainfall,
        ph: data.ph ?? null,
        carbon_soil: data.organicCarbon ?? null,
        nitrogen: data.nitrogen ?? null,
        health: data.health,
        risk: data.risk,
        aridity: data.aridity,
        ndvi: data.ndvi ?? null,
        ndviHistory: data.ndviHistory ?? [],
        soilMoistureIndex: data.soilMoistureIndex ?? null,
      }),
    })
      .then((res) => res.json())
      .then((json: { project?: { id: string }; error?: string }) => {
        if (json.project) {
          onToast(`${json.project.id} created`)
          onCreated(json.project.id)
        } else {
          onToast(json.error ?? "Could not create project")
        }
      })
      .catch(() => onToast("Could not create project"))
      .finally(() => setSubmitting(false))
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-border rounded-xl p-5">
        <h3 className="font-sans text-sm font-semibold text-ink mb-1">Site Assessment</h3>
        <p className="text-xs text-muted-custom mb-4">
          Real rainfall and soil data for {centroid.lat.toFixed(4)}, {centroid.lng.toFixed(4)} (area centroid)
        </p>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-custom py-8 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
            Assessing site…
          </div>
        ) : !data?.available ? (
          <div className="text-center py-8">
            <p className="text-sm text-red-custom font-medium mb-1">Could not assess this site</p>
            <p className="text-xs text-muted-custom">
              The rainfall data source is temporarily unavailable. Try a different point or try again shortly.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              <Stat label="Health" value={`${data.health}/100`} />
              <Stat label="Risk" value={data.risk ?? "—"} />
              <Stat label="Rainfall" value={`${data.rainfall} mm/yr`} />
              <Stat
                label="NDVI"
                value={data.satelliteAvailable && data.ndvi != null ? data.ndvi.toFixed(3) : "Pending"}
                muted={!data.satelliteAvailable || data.ndvi == null}
              />
              <Stat label="Soil pH" value={data.ph !== null && data.ph !== undefined ? data.ph.toFixed(1) : "Not tested"} muted={data.ph == null} />
              <Stat
                label="Organic Carbon"
                value={data.organicCarbon !== null && data.organicCarbon !== undefined ? `${data.organicCarbon} g/kg` : "Not tested"}
                muted={data.organicCarbon == null}
              />
              <Stat label="Aridity Index" value={data.aridity?.toFixed(2) ?? "—"} />
              <Stat
                label="Total Nitrogen"
                value={data.nitrogen != null ? `${data.nitrogen} g/kg` : "Not tested"}
                muted={data.nitrogen == null}
              />
              <Stat
                label="Texture"
                value={data.textureClass ?? "Not tested"}
                muted={!data.textureClass}
              />
              <Stat
                label="Sand / Silt / Clay"
                value={
                  data.sandPct != null && data.siltPct != null && data.clayPct != null
                    ? `${Math.round(data.sandPct)} / ${Math.round(data.siltPct)} / ${Math.round(data.clayPct)}%`
                    : "Not tested"
                }
                muted={data.sandPct == null}
              />
              <Stat
                label="CEC"
                value={data.cec != null ? `${data.cec} cmol/kg` : "Not tested"}
                muted={data.cec == null}
              />
              <Stat
                label="Bulk Density"
                value={data.bulkDensity != null ? `${data.bulkDensity} g/cm³` : "Not tested"}
                muted={data.bulkDensity == null}
              />
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-muted-custom tracking-wider uppercase mb-1 block">
                  Project Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Wadi Hanifa Restoration"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-muted-custom tracking-wider uppercase mb-1 block">
                    Region
                  </label>
                  <Input value={region} onChange={(e) => setRegion(e.target.value)} />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-custom tracking-wider uppercase mb-1 block">
                    Location
                  </label>
                  <Input value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          ← Back
        </Button>
        <Button onClick={handleCreate} disabled={!data?.available || !name.trim() || submitting}>
          {submitting ? "Creating…" : "Create Project"}
        </Button>
      </div>
    </div>
  )
}

const Stat: React.FC<{ label: string; value: string; muted?: boolean }> = ({ label, value, muted }) => (
  <div className="bg-ws rounded-lg p-3">
    <div className="text-[10px] text-muted-custom font-medium uppercase tracking-wide mb-1">{label}</div>
    <div className={`font-sans text-[15px] font-bold ${muted ? "text-dim" : "text-ink"}`}>{value}</div>
  </div>
)
