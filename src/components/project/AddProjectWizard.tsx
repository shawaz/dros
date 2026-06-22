"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { SiteSelectionMap, type SelectedSite } from "./SiteSelectionMap"
import { SiteAssessmentSummary } from "./SiteAssessmentSummary"
import { useToast } from "@/context/ToastContext"

export const AddProjectWizard: React.FC = () => {
  const router = useRouter()
  const { showToast } = useToast()
  const [site, setSite] = useState<SelectedSite | null>(null)

  return (
    <div className="space-y-4 animate-[fadeUp_0.35s_ease_both]">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-custom hover:text-ink transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Cancel
      </button>

      <div>
        <h1 className="font-sans text-xl font-bold text-ink leading-snug">New Project</h1>
        <p className="text-xs text-muted-custom mt-1">
          Pick a candidate restoration site and review real site data before creating the project.
        </p>
      </div>

      {!site ? (
        <SiteSelectionMap onContinue={setSite} />
      ) : (
        <SiteAssessmentSummary
          site={site}
          onBack={() => setSite(null)}
          onCreated={(id) => router.push(`/projects/${id}`)}
          onToast={showToast}
        />
      )}
    </div>
  )
}
