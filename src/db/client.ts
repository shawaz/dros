import fs from "fs"
import path from "path"
import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
import { migrate } from "drizzle-orm/better-sqlite3/migrator"
import * as schema from "./schema"

const dataDir = path.join(process.cwd(), "data")
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const sqlite = new Database(path.join(dataDir, "dros.db"))
sqlite.pragma("journal_mode = WAL")

export const db = drizzle(sqlite, { schema })

const migrationsFolder = path.join(process.cwd(), "drizzle")
if (fs.existsSync(migrationsFolder)) {
  migrate(db, { migrationsFolder })
}
