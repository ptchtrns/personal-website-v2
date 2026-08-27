import { dbRelations } from "@/db/schema.ts";
import { createDb } from "@/db/client.ts";
import { IS_WORKERS } from "@/lib/config.ts";
import type { drizzle } from "drizzle-orm/node-sqlite";

export type Db = ReturnType<typeof drizzle<typeof dbRelations>>;

let db: Db | null = null;

/**
 * Deno's `deno serve` runtime has no Cloudflare Worker `env.DB` binding, so
 * local dev talks to the same sqlite file Wrangler's local D1 uses directly.
 * Deployed on Workers, this reaches the real D1 binding via `createDb`
 * instead. Both drivers are configured with the same `dbRelations`, so their
 * query-builder surface is compatible even though the driver-specific
 * return types aren't nominally identical.
 *
 * `drizzle-orm/node-sqlite` and `db/local.ts` (which reads the sqlite file
 * off disk via `node:fs`) only work under Deno, so they're imported lazily
 * here — a static import would drag `node:fs`/`node:sqlite` into the
 * Workers bundle, which has neither.
 */
export async function getDb(): Promise<Db> {
  if (db !== null) return db;

  if (IS_WORKERS) {
    const { env } = await import("cloudflare:workers");
    db = createDb(
      (env as { DB: Parameters<typeof createDb>[0] }).DB,
    ) as unknown as Db;
    return db;
  }

  const { drizzle } = await import("drizzle-orm/node-sqlite");
  const { findLocalD1SqliteFile } = await import("@/db/local.ts");
  const file = findLocalD1SqliteFile();
  if (!file) {
    throw new Error(
      "Local D1 database not found. Run `deno task db:migrate:local` first.",
    );
  }
  db = drizzle({ connection: file, relations: dbRelations });
  return db;
}
