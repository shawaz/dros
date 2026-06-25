import { type AuthConfig } from "convex/server"

// Points Convex at your Clerk instance so ctx.auth.getUserIdentity() works
// inside queries/mutations/actions. CLERK_JWT_ISSUER_DOMAIN is set in the
// Convex dashboard env (Settings → Environment Variables), e.g.
// https://your-app.clerk.accounts.dev — it is the issuer of the "convex" JWT
// template you create in the Clerk dashboard.
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig
