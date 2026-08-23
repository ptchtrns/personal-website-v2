import { inArray } from "drizzle-orm";
import { getDb } from "@/db/local-client.ts";
import { technologies } from "@/db/schema.ts";

export type Technology = typeof technologies.$inferSelect;

export async function listTechnologies(): Promise<Technology[]> {
  return await getDb().select().from(technologies).orderBy(technologies.name);
}

/** Finds existing technologies by name and creates any that don't exist yet, returning all of them by id. */
export async function findOrCreateTechnologies(
  names: string[],
): Promise<Technology[]> {
  const trimmed = [
    ...new Set(names.map((name) => name.trim()).filter(Boolean)),
  ];
  if (trimmed.length === 0) return [];

  const db = getDb();
  const existing = await db
    .select()
    .from(technologies)
    .where(inArray(technologies.name, trimmed));

  const existingNames = new Set(existing.map((t) => t.name));
  const missing = trimmed.filter((name) => !existingNames.has(name));
  if (missing.length === 0) return existing;

  const created = await db
    .insert(technologies)
    .values(missing.map((name) => ({ name })))
    .returning();

  return [...existing, ...created];
}
