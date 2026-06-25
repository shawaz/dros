import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import { DashboardShell } from "@/components/layout/DashboardShell"
import type { AuthUser } from "@/lib/auth"

// Auth gate for everything under (app) — /dashboard and /projects. The proxy
// (clerkMiddleware) already blocks unauthenticated requests; this also resolves
// the Clerk user for the shell and is the authoritative server-side check.
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const clerkUser = await currentUser()
  if (!clerkUser) redirect("/login")

  const user: AuthUser = {
    id: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
    name: clerkUser.fullName ?? clerkUser.firstName ?? null,
  }

  return <DashboardShell user={user}>{children}</DashboardShell>
}
