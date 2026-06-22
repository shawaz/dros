"use client"

import React from "react"
import { ProcurementItem } from "@/data/rehabilitation-report"

interface ProcurementSectionProps {
  procurement: ProcurementItem[]
  procurementTotalLow: number
  procurementTotalHigh: number
}

function formatRange(low: number, high: number): string {
  return `${Math.round(low).toLocaleString("en-US")}–${Math.round(high).toLocaleString("en-US")} SAR`
}

export const ProcurementSection: React.FC<ProcurementSectionProps> = ({
  procurement,
  procurementTotalLow,
  procurementTotalHigh,
}) => (
  <section className="rx-section">
    <div className="rx-section-num">08</div>
    <h2 className="rx-section-title">Procurement List</h2>
    <p className="rx-section-intro">Materials, amendments, and equipment required to execute this plan.</p>

    <table className="rx-data-table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Specification</th>
          <th>Qty</th>
          <th>Est. Cost</th>
          <th>Source</th>
        </tr>
      </thead>
      <tbody>
        {procurement.map((item) => (
          <tr key={item.item}>
            <td>{item.item}</td>
            <td>{item.spec}</td>
            <td className="rx-mono-cell">{item.qty}</td>
            <td className="rx-mono-cell">{formatRange(item.costLow, item.costHigh)}</td>
            <td>{item.source}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <div className="rx-proc-total">
      <span className="rx-proc-total-label">Procurement Total (Est. Range)</span>
      <span className="rx-proc-total-value">{formatRange(procurementTotalLow, procurementTotalHigh)}</span>
    </div>
  </section>
)
