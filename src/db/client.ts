import path from "path"
import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"
import * as schema from "./schema"

const url =
  process.env.TURSO_DATABASE_URL ??
  `file:${path.join(process.cwd(), "data/dros.db")}`

const client = createClient({
  url,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

export const db = drizzle(client, { schema })
