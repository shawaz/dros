// Auth is provided by Clerk (see ClerkProvider in src/app/layout.tsx and the
// gate in src/app/(app)/layout.tsx). This is the minimal user shape the
// dashboard shell/sidebar consume, mapped from the Clerk user.
export interface AuthUser {
  id: string
  email: string
  name: string | null
}
