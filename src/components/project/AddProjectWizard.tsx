"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import { SiteSelectionMap, type SelectedSite } from "./SiteSelectionMap"
import { SiteAssessmentSummary } from "./SiteAssessmentSummary"
import { SpeciesRecommendationStep } from "./SpeciesRecommendationStep"
import { useToast } from "@/context/ToastContext"

type WizardStep = "map" | "species" | "assessment"

// Minimal assessment fields needed by the species recommender — fetched once
// after site selection so Step 2 has real data.
interface AssessmentPreview {
  rainfall: number
  aridity: number
  ph?: number | null
  ndvi?: number | null
  health?: number | null
}

const STEP_LABELS: Record<WizardStep, string> = {
  map:        "1. Select Site",
  species:    "2. Species Plan",
  assessment: "3. Review & Create",
}

export const AddProjectWizard: React.FC = () => {
  const router = useRouter()
  const { showToast } = useToast()
  const [step, setStep]           = useState<WizardStep>("map")
  const [site, setSite]           = useState<SelectedSite | null>(null)
  const [preview, setPreview]     = useState<AssessmentPreview | null>(null)
  const [fetching, setFetching]   = useState(false)

  const handleSiteSelected = async (selected: SelectedSite) => {
    setSite(selected)
    // Move to the species step immediately and show a loading panel while the
    // site assessment is fetched, rather than holding on a blank map screen.
    setStep("species")
    setFetching(true)
    try {
      const res = await fetch(`/api/site-assessment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ polygon: selected.polygon }),
      })
      const data = await res.json()
      if (data.available) {
        setPreview({
          rainfall: data.rainfall,
          aridity:  data.aridity,
          ph:       data.ph ?? null,
          ndvi:     data.ndvi ?? null,
          health:   data.health ?? null,
        })
      } else {
        // Fallback preview so species step still renders with eco-region estimates
        setPreview({ rainfall: 80, aridity: 0.85 })
      }
    } catch {
      setPreview({ rainfall: 80, aridity: 0.85 })
    } finally {
      setFetching(false)
    }
  }

  const handleBackToMap = () => {
    setSite(null)
    setPreview(null)
    setStep("map")
  }

  return (
    <div className="space-y-4 animate-[fadeUp_0.35s_ease_both]">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => step === "map" ? router.back() : handleBackToMap()}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-custom hover:text-ink transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {step === "map" ? "Cancel" : "Back to map"}
        </button>

        {/* Step indicator */}
        <div className="flex items-center gap-1.5">
          {(["map", "species", "assessment"] as WizardStep[]).map((s, i) => (
            <React.Fragment key={s}>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full transition-colors ${
                s === step
                  ? "bg-green-custom text-white"
                  : (["map", "species", "assessment"].indexOf(step) > i)
                    ? "bg-green-100 text-green-700"
                    : "bg-ws text-muted-custom"
              }`}>
                {STEP_LABELS[s]}
              </span>
              {i < 2 && <span className="text-muted-custom text-[10px]">›</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div>
        <h1 className="font-sans text-xl font-bold text-ink leading-snug">New Restoration Project</h1>
        <p className="text-xs text-muted-custom mt-1">
          Select a site, review the AI-driven species plan, then create your project.
        </p>
      </div>

      {step === "map" && (
        <SiteSelectionMap onContinue={handleSiteSelected} />
      )}

      {step === "species" && fetching && (
        <div className="bg-white border border-border rounded-xl p-10 flex flex-col items-center text-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-green-custom" />
          <h3 className="font-sans text-sm font-semibold text-ink">Assessing Site Conditions</h3>
          <p className="text-xs text-muted-custom max-w-sm">
            Pulling rainfall, aridity, NDVI, and soil estimates for the selected area to build
            an AI-driven species plan. This usually takes a few seconds.
          </p>
        </div>
      )}

      {step === "species" && site && preview && !fetching && (
        <SpeciesRecommendationStep
          site={site}
          assessment={preview}
          onBack={handleBackToMap}
          onContinue={() => setStep("assessment")}
        />
      )}

      {step === "assessment" && site && (
        <SiteAssessmentSummary
          site={site}
          onBack={() => setStep("species")}
          onCreated={(id) => router.push(`/projects/${id}`)}
          onToast={showToast}
        />
      )}
    </div>
  )
}
