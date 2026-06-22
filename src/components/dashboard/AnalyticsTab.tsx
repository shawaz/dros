import React from "react"

export const AnalyticsTab: React.FC = () => {
  return (
    <div className="space-y-[22px] animate-[fadeUp_0.35s_ease_both]">
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: Health Scores */}
        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <div className="p-5">
            <h3 className="font-sans text-sm font-semibold text-ink">Portfolio Health Scores</h3>
            <p className="text-xs text-muted-custom mb-4">Health vs Degradation per project</p>
            <div className="flex justify-center">
              <svg width="100%" height="180" viewBox="0 0 380 180" className="max-w-[380px]">
                {/* Y axis */}
                <line x1="50" y1="10" x2="50" y2="150" stroke="var(--border-theme)" strokeWidth="1" />
                <line x1="50" y1="150" x2="370" y2="150" stroke="var(--border-theme)" strokeWidth="1" />
                {/* Grid */}
                <line x1="50" y1="50" x2="370" y2="50" stroke="var(--border-theme)" strokeWidth="0.5" strokeDasharray="4 3" />
                <line x1="50" y1="90" x2="370" y2="90" stroke="var(--border-theme)" strokeWidth="0.5" strokeDasharray="4 3" />
                <line x1="50" y1="130" x2="370" y2="130" stroke="var(--border-theme)" strokeWidth="0.5" strokeDasharray="4 3" />

                <text x="42" y="54" fontSize="9" fill="var(--muted-foreground)" textAnchor="end" fontFamily="var(--font-sans)">75</text>
                <text x="42" y="94" fontSize="9" fill="var(--muted-foreground)" textAnchor="end" fontFamily="var(--font-sans)">50</text>
                <text x="42" y="134" fontSize="9" fill="var(--muted-foreground)" textAnchor="end" fontFamily="var(--font-sans)">25</text>

                {/* DROS-01 Health */}
                <rect x="70" y="103" width="28" height="47" rx="3" fill="#C0392B" opacity="0.85" />
                {/* DROS-01 Degrad */}
                <rect x="100" y="57" width="28" height="93" rx="3" fill="#E05C3A" opacity="0.4" />

                {/* DROS-02 Health */}
                <rect x="170" y="114" width="28" height="36" rx="3" fill="#C0392B" opacity="0.85" />
                {/* DROS-02 Degrad */}
                <rect x="200" y="43" width="28" height="107" rx="3" fill="#E05C3A" opacity="0.4" />

                {/* DROS-03 Health */}
                <rect x="270" y="14" width="28" height="136" rx="3" fill="#2E8B57" opacity="0.85" />
                {/* DROS-03 Degrad */}
                <rect x="300" y="137" width="28" height="13" rx="3" fill="#4CAF72" opacity="0.4" />

                {/* Labels */}
                <text x="99" y="165" fontSize="9" fill="var(--muted-foreground)" textAnchor="middle" fontFamily="var(--font-sans)">DROS-01</text>
                <text x="199" y="165" fontSize="9" fill="var(--muted-foreground)" textAnchor="middle" fontFamily="var(--font-sans)">DROS-02</text>
                <text x="299" y="165" fontSize="9" fill="var(--muted-foreground)" textAnchor="middle" fontFamily="var(--font-sans)">DROS-03</text>

                {/* Legend */}
                <rect x="55" y="170" width="8" height="8" rx="2" fill="#C0392B" />
                <text x="67" y="177" fontSize="9" fill="var(--muted-foreground)" fontFamily="var(--font-sans)">Health</text>
                <rect x="110" y="170" width="8" height="8" rx="2" fill="#E05C3A" opacity="0.5" />
                <text x="122" y="177" fontSize="9" fill="var(--muted-foreground)" fontFamily="var(--font-sans)">Degradation</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Chart 2: Budget Distribution */}
        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <div className="p-5">
            <h3 className="font-sans text-sm font-semibold text-ink">Budget Distribution</h3>
            <p className="text-xs text-muted-custom mb-4">SAR allocation by treatment category</p>
            <div className="flex justify-center">
              <svg width="100%" height="180" viewBox="0 0 380 180" className="max-w-[380px]">
                <circle cx="120" cy="90" r="70" fill="none" stroke="var(--border-theme)" strokeWidth="1" />
                {/* Pie segments approximated */}
                <path d="M120 90 L120 20 A70 70 0 0 1 179 55 Z" fill="#185FA5" opacity="0.85" />
                <path d="M120 90 L179 55 A70 70 0 0 1 162 156 Z" fill="#0F6E56" opacity="0.85" />
                <path d="M120 90 L162 156 A70 70 0 0 1 74 152 Z" fill="#639922" opacity="0.85" />
                <path d="M120 90 L74 152 A70 70 0 0 1 58 38 Z" fill="#BA7517" opacity="0.85" />
                <path d="M120 90 L58 38 A70 70 0 0 1 120 20 Z" fill="#888780" opacity="0.85" />
                <circle cx="120" cy="90" r="40" fill="white" />
                <text x="120" y="87" fontSize="16" fontWeight="700" fill="var(--foreground)" textAnchor="middle" fontFamily="var(--font-sans)">829M</text>
                <text x="120" y="100" fontSize="9" fill="var(--muted-foreground)" textAnchor="middle" fontFamily="var(--font-sans)">SAR total</text>
                
                {/* Legend */}
                <rect x="205" y="25" width="10" height="10" rx="2" fill="#185FA5" />
                <text x="220" y="34" fontSize="10" fill="var(--color-ink2)" fontFamily="var(--font-sans)">Water infra · 40%</text>
                <rect x="205" y="45" width="10" height="10" rx="2" fill="#0F6E56" />
                <text x="220" y="54" fontSize="10" fill="var(--color-ink2)" fontFamily="var(--font-sans)">Soil treatment · 27%</text>
                <rect x="205" y="65" width="10" height="10" rx="2" fill="#639922" />
                <text x="220" y="74" fontSize="10" fill="var(--color-ink2)" fontFamily="var(--font-sans)">Planting · 20%</text>
                <rect x="205" y="85" width="10" height="10" rx="2" fill="#BA7517" />
                <text x="220" y="94" fontSize="10" fill="var(--color-ink2)" fontFamily="var(--font-sans)">Monitoring · 8%</text>
                <rect x="205" y="105" width="10" height="10" rx="2" fill="#888780" />
                <text x="220" y="114" fontSize="10" fill="var(--color-ink2)" fontFamily="var(--font-sans)">Contingency · 5%</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Chart 3: Rainfall vs Aridity */}
        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <div className="p-5">
            <h3 className="font-sans text-sm font-semibold text-ink">Rainfall vs Aridity</h3>
            <p className="text-xs text-muted-custom mb-5">Key restoration difficulty drivers</p>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1.5 text-xs">
                  <span className="text-muted-custom">DROS-01 · 114 mm/yr</span>
                  <span className="font-mono text-amber-custom font-semibold">Aridity 0.05</span>
                </div>
                <div className="w-full h-2 bg-ws rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-custom to-[#E0A840]" style={{ width: "32%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1.5 text-xs">
                  <span className="text-muted-custom">DROS-02 · 24 mm/yr</span>
                  <span className="font-mono text-red-custom font-semibold">Aridity 0.01</span>
                </div>
                <div className="w-full h-2 bg-ws rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-custom to-[#E05C3A]" style={{ width: "7%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1.5 text-xs">
                  <span className="text-muted-custom">DROS-03 · 359 mm/yr</span>
                  <span className="font-mono text-green-custom font-semibold">Aridity 0.23</span>
                </div>
                <div className="w-full h-2 bg-ws rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-custom to-[#4CAF72]" style={{ width: "100%" }} />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-[11px] text-muted-custom leading-relaxed">
                  DROS-02 has the most critical water deficit. Groundwater survey must precede all other work.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 4: Carbon Sequestration Forecast */}
        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <div className="p-5">
            <h3 className="font-sans text-sm font-semibold text-ink">Carbon Sequestration Forecast</h3>
            <p className="text-xs text-muted-custom mb-4">Projected tCO₂/yr at full maturity</p>
            <div className="flex justify-center">
              <svg width="100%" height="180" viewBox="0 0 380 180" className="max-w-[380px]">
                <defs>
                  <linearGradient id="gcarbon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2E8B57" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#2E8B57" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <line x1="40" y1="10" x2="40" y2="140" stroke="var(--border-theme)" strokeWidth="1" />
                <line x1="40" y1="140" x2="370" y2="140" stroke="var(--border-theme)" strokeWidth="1" />
                <line x1="40" y1="50" x2="370" y2="50" stroke="var(--border-theme)" strokeWidth="0.5" strokeDasharray="4 3" />
                <line x1="40" y1="95" x2="370" y2="95" stroke="var(--border-theme)" strokeWidth="0.5" strokeDasharray="4 3" />
                
                <text x="32" y="53" fontSize="9" fill="var(--muted-foreground)" textAnchor="end" fontFamily="var(--font-sans)">150K</text>
                <text x="32" y="98" fontSize="9" fill="var(--muted-foreground)" textAnchor="end" fontFamily="var(--font-sans)">75K</text>
                <text x="32" y="143" fontSize="9" fill="var(--muted-foreground)" textAnchor="end" fontFamily="var(--font-sans)">0</text>
                
                {/* Area */}
                <path d="M55 138 L100 135 L150 128 L200 115 L250 95 L300 65 L350 32 L360 28 L360 140 L55 140Z" fill="url(#gcarbon)" />
                <path d="M55 138 L100 135 L150 128 L200 115 L250 95 L300 65 L350 32" stroke="#2E8B57" strokeWidth="2" fill="none" strokeLinecap="round" />
                <circle cx="350" cy="32" r="4" fill="#2E8B57" />
                <text x="350" y="24" fontSize="10" fill="#2E8B57" textAnchor="middle" fontFamily="var(--font-mono)">203K</text>
                
                {/* Year labels */}
                <text x="55" y="155" fontSize="9" fill="var(--color-dim)" fontFamily="var(--font-sans)" textAnchor="middle">Y1</text>
                <text x="150" y="155" fontSize="9" fill="var(--color-dim)" fontFamily="var(--font-sans)" textAnchor="middle">Y3</text>
                <text x="250" y="155" fontSize="9" fill="var(--color-dim)" fontFamily="var(--font-sans)" textAnchor="middle">Y5</text>
                <text x="350" y="155" fontSize="9" fill="var(--color-dim)" fontFamily="var(--font-sans)" textAnchor="middle">Y8</text>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Chart 5: Cost per ha comparison */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="p-5">
          <h3 className="font-sans text-sm font-semibold text-ink">Cost per Hectare — Cross-parcel Comparison</h3>
          <p className="text-xs text-muted-custom mb-5">SAR/ha · Lower is better · Driven by water infrastructure needs</p>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between items-center mb-1.5 text-sm">
                <span className="font-semibold text-ink">DROS-03 · Riyadh North Greening</span>
                <span className="font-mono text-green-custom font-bold">12,000 SAR/ha</span>
              </div>
              <div className="w-full h-3 bg-ws rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-custom to-[#4CAF72] rounded-full" style={{ width: "50%" }} />
              </div>
              <p className="text-[11px] text-muted-custom mt-1">Healthy soil · 359mm rainfall · No remediation needed</p>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5 text-sm">
                <span className="font-semibold text-ink">DROS-01 · New Land 1</span>
                <span className="font-mono text-amber-custom font-bold">15,300 SAR/ha</span>
              </div>
              <div className="w-full h-3 bg-ws rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-custom to-[#F0A830] rounded-full" style={{ width: "64%" }} />
              </div>
              <p className="text-[11px] text-muted-custom mt-1">Moderate arid · Soil treatment + irrigation required</p>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5 text-sm">
                <span className="font-semibold text-ink">DROS-02 · Al Kharj Farmland</span>
                <span className="font-mono text-red-custom font-bold">23,800 SAR/ha</span>
              </div>
              <div className="w-full h-3 bg-ws rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-custom to-[#E05C3A] rounded-full" style={{ width: "100%" }} />
              </div>
              <p className="text-[11px] text-muted-custom mt-1">Hyper-arid 0.01 · Full artificial water supply · pH amendment · 56% cost premium</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
