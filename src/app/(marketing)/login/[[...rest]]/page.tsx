import Link from "next/link"
import { SignIn } from "@clerk/nextjs"
import { ArrowLeft, Leaf } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-ws font-sans text-ink flex flex-col">
      <div className="px-6 py-5">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-custom hover:text-ink transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to home
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 pb-16">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex items-center justify-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-green-custom to-[#1a5c38]">
              <Leaf className="h-4.5 w-4.5 text-white" />
            </span>
            <span className="leading-none">
              <span className="block text-sm font-semibold tracking-wide">DROS</span>
              <span className="mt-0.5 block text-[9px] tracking-[0.14em] text-muted-custom">THE LAND OS</span>
            </span>
          </div>

          <div className="flex justify-center">
            <SignIn
              fallbackRedirectUrl="/dashboard"
              signUpFallbackRedirectUrl="/dashboard"
              appearance={{
                variables: {
                  colorPrimary: "#2E8B57",
                  borderRadius: "0.625rem",
                  fontFamily: "Inter, sans-serif",
                },
                elements: {
                  card: "shadow-sm border border-border",
                  headerTitle: "font-sans",
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
