import { drizzle } from "drizzle-orm/node-sqlite";
import { dbRelations } from "@/db/schema.ts";
import { findLocalD1SqliteFile } from "@/db/local.ts";

let db: ReturnType<typeof drizzle<typeof dbRelations>> | null = null;

/**
 * Deno's `deno serve` runtime has no Cloudflare Worker `env.DB` binding, so
 * local dev talks to the same sqlite file Wrangler's local D1 uses directly.
 */
export function getDb() {
  if (db === null) {
    const file = findLocalD1SqliteFile();
    if (!file) {
      throw new Error(
        "Local D1 database not found. Run `deno task db:migrate:local` first.",
      );
    }
    db = drizzle({ connection: file, relations: dbRelations });
  }
  return db;
}
