import { defineConfig } from "drizzle-kit"

const isTurso = Boolean(process.env.TURSO_DATABASE_URL)

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: isTurso
    ? {
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN,
      }
    : {
        url: "file:./data/dros.db",
      },
})
