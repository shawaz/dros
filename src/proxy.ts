import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

// Next.js 16 renamed `middleware.ts` to `proxy.ts`; Clerk's clerkMiddleware
// works unchanged here. Protects the app routes; the marketing site (/) and
// /login stay public.
const isProtected = createRouteMatcher(["/dashboard(.*)", "/projects(.*)"])

export default clerkMiddleware(async (auth, req) => {
  if (isProtected(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next internals and static files, run on everything else
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ico|woff2?|ttf|map)).*)",
    "/(api|trpc)(.*)",
  ],
}
