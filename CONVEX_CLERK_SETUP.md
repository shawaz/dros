# Convex + Clerk setup

DROS auth now runs on **Clerk** and the backend is migrating to **Convex**. Both
are hosted services that require accounts and API keys. These steps are yours to
do (account creation and CLI login can't be automated).

## 1. Clerk

1. Create an application at https://dashboard.clerk.com.
2. **API keys** → copy the Publishable key and Secret key into `.env.local`:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
3. **Configure → JWT Templates → New template → Convex.** Save it. Copy the
   **Issuer** URL (looks like `https://your-app.clerk.accounts.dev`).
4. Put that issuer in `.env.local` as `CLERK_JWT_ISSUER_DOMAIN`.

## 2. Convex

1. `npx convex dev`
   - On first run it prompts you to log in and create a project, then writes
     `CONVEX_DEPLOYMENT` to `.env.local`, prints `NEXT_PUBLIC_CONVEX_URL`, and
     generates `convex/_generated/` (required for the backend to typecheck).
   - Leave it running; it pushes `convex/schema.ts` + functions and watches.
2. Add the Clerk issuer to the **Convex** environment too:
   - Convex dashboard → Settings → Environment Variables → add
     `CLERK_JWT_ISSUER_DOMAIN` = the same issuer URL.
   (This is what `convex/auth.config.ts` reads so `ctx.auth.getUserIdentity()` works.)

## 3. Run the app

```
npx convex dev      # terminal 1 (keep running)
npm run dev         # terminal 2
```

Copy `.env.example` → `.env.local` and fill in the values above.

## What's wired now (increment 1)

- Auth is fully on Clerk: `<ClerkProvider>` + `<ConvexClientProvider>` in
  `src/app/layout.tsx`, `clerkMiddleware` in `src/proxy.ts`, the `(app)` layout
  gates with Clerk `currentUser()`, `/login` renders Clerk `<SignIn>`, and the
  sidebar signs out via Clerk.
- Convex backend is scaffolded: `convex/schema.ts`, `convex/projects.ts`
  (list / getByProjectId / create / report mutations), `convex/auth.config.ts`.

## Still on the old Drizzle backend (to migrate next)

The dashboard's data still reads/writes through the existing Next API routes and
Drizzle so the app stays coherent until Convex is live:

- `src/context/ProjectsContext.tsx` → switch to `useQuery(api.projects.list)`
- project create flow in `SiteAssessmentSummary.tsx` → `api.projects.create`
- the 7 server pages calling `getProject` → Convex `fetchQuery`
- report-generation routes (`/api/projects/[id]/*-report`) and external-data
  routes (`site-assessment`, `predict/*`, satellite, geocode) → Convex actions
- seed `src/data/projects.ts` into Convex, then remove Drizzle/Turso

See the project memory note `project-convex-clerk-migration` for the full plan.
