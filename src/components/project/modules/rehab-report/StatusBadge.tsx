"use client"

import React from "react"

interface StatusBadgeProps {
  status: "ok" | "warn" | "critical" | "info"
}

const LABELS: Record<StatusBadgeProps["status"], string> = {
  ok: "OK",
  warn: "Warning",
  critical: "Critical",
  info: "Info",
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => (
  <span className={`rx-status rx-s-${status}`}>{LABELS[status]}</span>
)
