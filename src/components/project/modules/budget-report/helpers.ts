import type { BudgetColor, BudgetStatus } from "@/data/budget-report"

export const colorClass = (c: BudgetColor): string => `bx-c-${c}`

export const rowClass = (s: BudgetStatus): string => `bx-row-${s}`

export const fmt = (n: number): string => n.toLocaleString("en-US")
