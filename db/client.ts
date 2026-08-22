import { drizzle } from "drizzle-orm/d1";
import { dbRelations } from "@/db/schema.ts";

/**
 * `d1` is the Worker's `env.DB` D1 binding. Typed structurally off drizzle's
 * own signature so this file never has to import `@cloudflare/workers-types`
 * — that package's ambient `declare global` block for `fetch`/`Response`
 * leaks into every other file in the program the moment anything imports it.
 */
export function createDb(d1: Parameters<typeof drizzle>[0]) {
  return drizzle(d1, { relations: dbRelations });
}

export type Db = ReturnType<typeof createDb>;
