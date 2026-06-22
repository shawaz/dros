"use client"

import React from "react"
import { restorationProcessSteps } from "@/data/restoration-process"

interface ProcessStepperProps {
  currentStep: number
  activeStep: number
  onStepSelect: (step: number) => void
}

export const ProcessStepper: React.FC<ProcessStepperProps> = ({
  currentStep,
  activeStep,
  onStepSelect,
}) => {
  return (
    <div className="bg-white border border-border rounded-xl px-5 py-4">
      <div className="relative">
        <div className="absolute top-[18px] left-[6%] right-[6%] h-px bg-border" />
        <div className="relative flex justify-between">
          {restorationProcessSteps.map((step) => {
            const Icon = step.icon
            const isActive = step.step === activeStep
            const isCurrent = step.step === currentStep
            const isCompleted = step.step < currentStep

            return (
              <button
                key={step.step}
                onClick={() => onStepSelect(step.step)}
                className="flex flex-col items-center gap-1.5 px-1 group cursor-pointer"
              >
                <div className="relative">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                      isActive
                        ? "bg-green-custom text-white"
                        : isCompleted
                        ? "bg-green-lt text-green-custom"
                        : "bg-ws text-dim group-hover:text-muted-custom"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {isCurrent && !isActive && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-custom pulse-dot border-2 border-white" />
                  )}
                </div>
                <span
                  className={`text-[10.5px] font-medium text-center leading-tight max-w-[84px] ${
                    isActive
                      ? "text-ink font-semibold"
                      : isCompleted
                      ? "text-ink2"
                      : "text-muted-custom"
                  }`}
                >
                  {step.title}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
