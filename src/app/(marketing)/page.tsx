import Link from "next/link"
import type { Metadata } from "next"
import {
  Satellite,
  Leaf,
  Plane,
  LineChart,
  FileText,
  ShieldCheck,
  ArrowRight,
  MapPin,
} from "lucide-react"

export const metadata: Metadata = {
  title: "DROS — The Land OS for desert restoration",
  description:
    "Draw a site, assess it from satellite and soil data, get an AI species plan, and track restoration through to verified carbon. DROS is the operating system for desert land restoration.",
}

const capabilities = [
  {
    icon: Satellite,
    title: "Satellite assessment",
    body: "Real Sentinel-2 NDVI and soil-moisture, a 10-year vegetation history, and rainfall and soil chemistry pulled for any polygon you draw.",
  },
  {
    icon: Leaf,
    title: "AI species & strategy",
    body: "Sixty-plus native species ranked for your exact conditions, with a restoration strategy validated by an AI agronomist.",
  },
  {
    icon: Plane,
    title: "Drone 3D survey",
    body: "Topographic point clouds, elevation, hydrological flow, and erosion-risk layers from your field flights.",
  },
  {
    icon: LineChart,
    title: "Carbon & dMRV",
    body: "Biomass tracking and a digital MRV trail wired to Verra and Gold Standard registry milestones.",
  },
  {
    icon: FileText,
    title: "Budget & field reports",
    body: "Cost models and field-execution protocols generated per project, ready to hand to a crew.",
  },
  {
    icon: ShieldCheck,
    title: "Works without keys",
    body: "Every data source degrades gracefully. Missing a provider key just falls back to modelled estimates instead of failing.",
  },
]

const steps = [
  {
    n: "1",
    title: "Draw the site",
    body: "Drop boundary points on the map to outline your project area anywhere in the Kingdom.",
  },
  {
    n: "2",
    title: "Assess the land",
    body: "DROS samples satellite, rainfall, and soil data for the polygon and scores its restoration potential.",
  },
  {
    n: "3",
    title: "Plan and track",
    body: "Get a species plan and budget, then run the project through survey, execution, and carbon verification.",
  },
]

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-surface text-ink font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-surface/85 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-custom to-[#1a5c38] flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </span>
            <span className="leading-none">
              <span className="block font-semibold tracking-wide text-sm">DROS</span>
              <span className="block text-[9px] tracking-[0.14em] text-muted-custom mt-0.5">THE LAND OS</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-7 text-sm text-ink2">
            <a href="#capabilities" className="hover:text-ink transition-colors">Capabilities</a>
            <a href="#how" className="hover:text-ink transition-colors">How it works</a>
          </nav>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-lg bg-green-custom px-4 py-2 text-sm font-semibold text-white hover:bg-[#257a4a] transition-colors"
          >
            Sign in
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-sb text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)",
            backgroundSize: "26px 26px",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
            <MapPin className="w-3.5 h-3.5 text-green-mid" />
            Built for Saudi Arabia’s degraded drylands
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight text-balance">
            The operating system for restoring desert land.
          </h1>
          <p className="mt-6 max-w-xl text-base md:text-lg leading-relaxed text-white/70 text-pretty">
            Outline a site on the map and DROS reads it from orbit, scores its potential, designs a
            native-species plan, and tracks the work through to verified carbon.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-green-custom px-5 py-3 text-sm font-semibold text-white hover:bg-[#2f9c61] transition-colors"
            >
              Get started <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#how"
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-5 py-3 text-sm font-semibold text-white/85 hover:bg-white/5 transition-colors"
            >
              See how it works
            </a>
          </div>

          <dl className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-8 max-w-2xl border-t border-white/10 pt-8">
            {[
              ["60+", "native species ranked"],
              ["10 yr", "satellite NDVI history"],
              ["6", "analysis modules"],
              ["dMRV", "carbon registry trail"],
            ].map(([stat, label]) => (
              <div key={label}>
                <dt className="text-2xl font-bold tracking-tight">{stat}</dt>
                <dd className="mt-1 text-xs text-white/55 leading-snug">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Capabilities */}
      <section id="capabilities" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-balance">
            Every stage of a restoration project, in one place.
          </h2>
          <p className="mt-3 text-ink2 leading-relaxed">
            From the first satellite read to the carbon credit, DROS runs the analysis so your team
            can make the call.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-surface p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green-lt text-green-custom">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink2">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-y border-border bg-ws">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <h2 className="max-w-2xl text-2xl md:text-3xl font-bold tracking-tight text-balance">
            From a polygon to a planted, verified site.
          </h2>
          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map(({ n, title, body }) => (
              <li key={n} className="relative">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-custom text-sm font-bold text-white">
                  {n}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink2">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="rounded-3xl bg-sb px-8 py-14 text-center md:px-16">
          <h2 className="mx-auto max-w-2xl text-3xl md:text-4xl font-bold tracking-tight text-white text-balance">
            Put your next restoration site on the map.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-white/65">
            Sign in with your email. No password to remember, no setup.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-green-custom px-6 py-3 text-sm font-semibold text-white hover:bg-[#2f9c61] transition-colors"
          >
            Get started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-custom">
          <span>DROS — The Land OS</span>
          <span>Desert restoration, instrumented.</span>
        </div>
      </footer>
    </div>
  )
}
