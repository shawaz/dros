import React from "react"
import type { BudgetLineItem } from "@/data/budget-report"

interface Props {
  title: string
  items: BudgetLineItem[]
}

export const BudgetLineItemTable: React.FC<Props> = ({ title, items }) => {
  const total = items.reduce((s, i) => s + i.subtotal, 0)
  return (
    <div>
      <h2 className="rx-section-title">{title}</h2>
      <table className="rx-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Specification</th>
            <th>Quantity</th>
            <th>Unit Cost</th>
            <th className="text-right">Subtotal (SAR)</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} style={item.rowColor ? { backgroundColor: item.rowColor } : undefined}>
              <td className="font-medium">{item.item}</td>
              <td className="text-xs text-muted-custom">{item.detail}</td>
              <td className="font-mono text-xs">{item.qty}</td>
              <td className="font-mono text-xs">{item.unitCost}</td>
              <td className="text-right font-mono font-semibold">{item.subtotal.toLocaleString()}</td>
            </tr>
          ))}
          <tr className="font-bold bg-gray-50">
            <td colSpan={4}>Total</td>
            <td className="text-right font-mono">{total.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
