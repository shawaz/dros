import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { activityFeedData, type Project } from "@/data/projects"
import { AlertTriangle, CheckCircle, Info } from "lucide-react"
import { useToast } from "@/context/ToastContext"

interface OverviewTabProps {
  projects: Project[]
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ projects }) => {
  const router = useRouter()
  const { showToast } = useToast()
  return (
    <div className="space-y-[22px] animate-[fadeUp_0.35s_ease_both]">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* KPI 1 */}
        <div className="bg-white border border-border rounded-xl p-4 hover:shadow-md transition-shadow">
          <div className="text-[11px] font-semibold text-muted-custom tracking-wider uppercase mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-[2px]" style={{ backgroundColor: "#3A9E8F" }} />
            Total Area
          </div>
          <div className="font-sans text-2xl font-bold text-ink tracking-tight">67.8K</div>
          <div className="font-mono text-[10px] text-muted-custom mt-1">HECTARES</div>
          <div className="text-[11px] mt-1.5 flex items-center gap-1 text-green-custom">
            <span>↑ +1,109 ha this month</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-border rounded-xl p-4 hover:shadow-md transition-shadow">
          <div className="text-[11px] font-semibold text-muted-custom tracking-wider uppercase mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-[2px] bg-amber-custom" />
            Portfolio Budget
          </div>
          <div className="font-sans text-2xl font-bold text-ink tracking-tight">829M</div>
          <div className="font-mono text-[10px] text-muted-custom mt-1">SAR COMMITTED</div>
          <div className="text-[11px] mt-1.5 flex items-center gap-1 text-amber-custom">
            <span>⚠ 2 parcels unbudgeted</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-border rounded-xl p-4 hover:shadow-md transition-shadow">
          <div className="text-[11px] font-semibold text-muted-custom tracking-wider uppercase mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-[2px] bg-green-custom" />
            Carbon Potential
          </div>
          <div className="font-sans text-2xl font-bold text-ink tracking-tight">203K</div>
          <div className="font-mono text-[10px] text-muted-custom mt-1">tCO₂/YR</div>
          <div className="text-[11px] mt-1.5 flex items-center gap-1 text-green-custom">
            <span>↑ At full maturity</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-border rounded-xl p-4 hover:shadow-md transition-shadow">
          <div className="text-[11px] font-semibold text-muted-custom tracking-wider uppercase mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-[2px] bg-red-custom" />
            Avg. Health Score
          </div>
          <div className="font-sans text-2xl font-bold text-ink tracking-tight">48.7</div>
          <div className="font-mono text-[10px] text-muted-custom mt-1">OUT OF 100</div>
          <div className="text-[11px] mt-1.5 flex items-center gap-1 text-red-custom">
            <span>↓ 2 critical parcels</span>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="bg-white border border-border rounded-xl p-4 hover:shadow-md transition-shadow">
          <div className="text-[11px] font-semibold text-muted-custom tracking-wider uppercase mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-[2px] bg-blue-custom" />
            Active Sites
          </div>
          <div className="font-sans text-2xl font-bold text-ink tracking-tight">
            1 <span className="text-sm text-muted-custom font-normal">/ 3</span>
          </div>
          <div className="font-mono text-[10px] text-muted-custom mt-1">PROJECTS</div>
          <div className="text-[11px] mt-1.5 flex items-center gap-1 text-amber-custom">
            <span>2 in planning phase</span>
          </div>
        </div>
      </div>

      {/* Two-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
        {/* Project Portfolio Table */}
        <div className="bg-white border border-border rounded-xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-sans text-sm font-semibold text-ink">Project Portfolio</h2>
            <Link
              href="/dashboard?tab=projects"
              className="text-xs text-green-custom font-semibold hover:underline cursor-pointer"
            >
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-ws border-b border-border">
                  <th className="text-[10px] font-semibold tracking-wider uppercase text-muted-custom py-2.5 px-5">
                    Project
                  </th>
                  <th className="text-[10px] font-semibold tracking-wider uppercase text-muted-custom py-2.5 px-5">
                    Status
                  </th>
                  <th className="text-[10px] font-semibold tracking-wider uppercase text-muted-custom py-2.5 px-5">
                    Health
                  </th>
                  <th className="text-[10px] font-semibold tracking-wider uppercase text-muted-custom py-2.5 px-5">
                    NDVI
                  </th>
                  <th className="text-[10px] font-semibold tracking-wider uppercase text-muted-custom py-2.5 px-5">
                    Budget
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr
                    key={project.id}
                    onClick={() => router.push(`/projects/${project.id}`)}
                    className="border-b border-border hover:bg-[#fafcfa] transition-colors cursor-pointer last:border-b-0"
                  >
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-1 h-8 rounded shrink-0"
                          style={{
                            background: project.status === "active"
                              ? "linear-gradient(180deg,#2E8B57,#4CAF72)"
                              : project.id === "DROS-01"
                              ? "linear-gradient(180deg,#C0392B,#E05C3A)"
                              : "linear-gradient(180deg,#C9841A,#F0A830)",
                          }}
                        />
                        <div>
                          <div className="font-semibold text-ink text-[13px]">{project.name}</div>
                          <div className="text-xs text-muted-custom font-mono mt-0.5">{project.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-[13px]">
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            project.status === "active" ? "bg-green-custom pulse-dot" : "bg-amber-custom"
                          }`}
                        />
                        <span
                          className={project.status === "active" ? "text-green-custom" : "text-amber-custom"}
                        >
                          {project.status === "active" ? "Active" : "Planning"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <div
                        className={`inline-flex items-center justify-center w-9 h-9 rounded-full font-mono text-[11px] font-semibold border-2 ${
                          project.health < 40
                            ? "text-red-custom border-red-custom"
                            : project.health < 70
                            ? "text-amber-custom border-amber-custom"
                            : "text-green-custom border-green-custom"
                        }`}
                      >
                        {project.health}
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      {project.ndvi !== null ? (
                        <>
                          <div className="font-mono text-xs">{project.ndvi.toFixed(3)}</div>
                          <div className="w-[60px] h-1.5 bg-ws rounded-full overflow-hidden mt-1">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${project.ndvi * 100}%`,
                                backgroundColor: project.ndvi > 0.3 ? "var(--green-custom)" : "var(--red-custom)",
                              }}
                            />
                          </div>
                        </>
                      ) : (
                        <span className="text-xs text-dim">Pending</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-[12px] text-muted-custom font-mono">
                      {project.status === "active" ? (
                        <span className="text-green-custom font-semibold">2.4M SAR</span>
                      ) : (
                        "Not set"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white border border-border rounded-xl flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-sans text-sm font-semibold text-ink">Activity</h2>
            <button
              onClick={() => showToast("Marking all activities as read")}
              className="text-xs text-green-custom font-semibold hover:underline cursor-pointer"
            >
              Mark all read
            </button>
          </div>
          <div className="flex-1 divide-y divide-border">
            {activityFeedData.map((item) => (
              <div key={item.id} className="flex gap-3 p-4">
                <div
                  className={`w-7.5 h-7.5 rounded-full flex items-center justify-center shrink-0 ${
                    item.type === "success"
                      ? "bg-green-lt text-green-custom"
                      : item.type === "warn"
                      ? "bg-amber-lt text-amber-custom"
                      : item.type === "danger"
                      ? "bg-red-lt text-red-custom"
                      : "bg-blue-lt text-blue-custom"
                  }`}
                >
                  {item.type === "success" && <CheckCircle className="w-4 h-4" />}
                  {item.type === "warn" && <AlertTriangle className="w-4 h-4" />}
                  {item.type === "danger" && <AlertTriangle className="w-4 h-4" />}
                  {item.type === "info" && <Info className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <div className="text-[12px] text-ink2 leading-relaxed">
                    <strong className="text-ink font-semibold">{item.projId}</strong> {item.text}
                  </div>
                  <div className="text-[10px] text-dim font-mono mt-0.5">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mini Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* NDVI Trend Card */}
        <div className="bg-white border border-border rounded-xl p-5 flex flex-col">
          <h3 className="font-sans text-sm font-semibold text-ink">NDVI Trend — DROS-03</h3>
          <p className="text-xs text-muted-custom mb-3.5">Vegetation index over 12 months</p>
          <div className="mt-auto">
            <svg width="100%" height="80" viewBox="0 0 280 80" preserveAspectRatio="none" className="overflow-visible">
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2E8B57" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2E8B57" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 72 L23 68 L46 64 L69 60 L92 55 L115 48 L138 42 L161 36 L184 30 L207 25 L230 20 L253 14 L276 10 L280 9 L280 80 L0 80Z"
                fill="url(#g1)"
              />
              <path
                d="M0 72 L23 68 L46 64 L69 60 L92 55 L115 48 L138 42 L161 36 L184 30 L207 25 L230 20 L253 14 L276 10"
                stroke="#2E8B57"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx="276" cy="10" r="4" fill="#2E8B57" />
              <text x="276" y="6" fontSize="10" fill="#2E8B57" fontFamily="var(--font-mono)" textAnchor="middle">
                0.47
              </text>
            </svg>
          </div>
        </div>

        {/* Budget Allocation Card */}
        <div className="bg-white border border-border rounded-xl p-5 flex flex-col">
          <h3 className="font-sans text-sm font-semibold text-ink">Budget Allocation</h3>
          <p className="text-xs text-muted-custom mb-3.5">By category across all projects</p>
          <div className="mt-auto">
            <svg width="100%" height="80" viewBox="0 0 280 80">
              <rect x="0" y="10" width="90" height="16" rx="3" fill="#185FA5" />
              <text x="96" y="22" fontSize="10" fill="var(--muted-foreground)" fontFamily="var(--font-sans)">
                Water infra
              </text>
              <text x="220" y="22" fontSize="10" fill="var(--foreground)" fontFamily="var(--font-mono)" fontWeight="500">
                40%
              </text>

              <rect x="0" y="32" width="60" height="16" rx="3" fill="#0F6E56" />
              <text x="66" y="44" fontSize="10" fill="var(--muted-foreground)" fontFamily="var(--font-sans)">
                Soil treatment
              </text>
              <text x="220" y="44" fontSize="10" fill="var(--foreground)" fontFamily="var(--font-mono)" fontWeight="500">
                27%
              </text>

              <rect x="0" y="54" width="45" height="16" rx="3" fill="#639922" />
              <text x="51" y="66" fontSize="10" fill="var(--muted-foreground)" fontFamily="var(--font-sans)">
                Planting ops
              </text>
              <text x="220" y="66" fontSize="10" fill="var(--foreground)" fontFamily="var(--font-mono)" fontWeight="500">
                20%
              </text>
            </svg>
          </div>
        </div>

        {/* Health Distribution Card */}
        <div className="bg-white border border-border rounded-xl p-5 flex flex-col">
          <h3 className="font-sans text-sm font-semibold text-ink">Health Distribution</h3>
          <p className="text-xs text-muted-custom mb-3.5">Scores across portfolio</p>
          <div className="mt-auto flex items-end gap-3 h-[60px]">
            {/* D-01 */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 bg-red-custom rounded-t-[4px] h-[38px]" />
              <div className="fontSize-[10px] text-muted-custom font-mono">31</div>
              <div className="fontSize-[9px] text-dim">D-01</div>
            </div>
            {/* D-02 */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 bg-red-custom rounded-t-[4px] h-[30px]" />
              <div className="fontSize-[10px] text-muted-custom font-mono">24</div>
              <div className="fontSize-[9px] text-dim">D-02</div>
            </div>
            {/* D-03 */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 bg-green-custom rounded-t-[4px] h-[52px]" />
              <div className="fontSize-[10px] text-muted-custom font-mono">91</div>
              <div className="fontSize-[9px] text-dim">D-03</div>
            </div>

            <div className="flex-1" />
            <div className="text-right pb-1">
              <div className="text-[10px] text-muted-custom">Portfolio avg</div>
              <div className="font-sans text-2xl font-bold text-amber-custom">48.7</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
