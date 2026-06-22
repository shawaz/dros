"use client"

import React from "react"
import type { Status4 } from "@/data/rehabilitation-report"

const STYLES: Record<Status4, string> = {
  ok: "bg-green-lt text-green-custom",
  warn: "bg-amber-lt text-amber-custom",
  critical: "bg-red-lt text-red-custom",
  info: "bg-blue-lt text-blue-custom",
}

const LABELS: Record<Status4, string> = {
  ok: "OK",
  warn: "Warning",
  critical: "Critical",
  info: "Info",
}

export const StatusPill: React.FC<{ status: Status4 }> = ({ status }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold whitespace-nowrap ${STYLES[status]}`}>
    {LABELS[status]}
  </span>
)
