import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db/local-client.ts";
import { siteSettings } from "@/db/schema.ts";
import { parseWithSchema, requiredTrimmedString } from "@/lib/validation.ts";

export type SiteSetting = typeof siteSettings.$inferSelect;
export type SiteSettingInput = typeof siteSettings.$inferInsert;

export async function listSiteSettings(): Promise<SiteSetting[]> {
  const db = await getDb();
  return await db.select().from(siteSettings).orderBy(siteSettings.key);
}

export async function getSiteSetting(key: string): Promise<string | null> {
  const db = await getDb();
  const [row] = await db.select().from(siteSettings).where(
    eq(siteSettings.key, key),
  );
  return row?.value ?? null;
}

export async function createSiteSetting(
  input: SiteSettingInput,
): Promise<SiteSetting> {
  const db = await getDb();
  const [row] = await db.insert(siteSettings).values(input).returning();
  return row;
}

export async function updateSiteSetting(
  key: string,
  value: string,
): Promise<SiteSetting | null> {
  const db = await getDb();
  const [row] = await db
    .update(siteSettings)
    .set({ value, updatedAt: new Date() })
    .where(eq(siteSettings.key, key))
    .returning();
  return row ?? null;
}

export async function deleteSiteSetting(key: string): Promise<void> {
  const db = await getDb();
  await db.delete(siteSettings).where(eq(siteSettings.key, key));
}

const SiteSettingInputSchema = z.object({
  key: requiredTrimmedString("key is required"),
  value: requiredTrimmedString("value is required"),
}) satisfies z.ZodType<SiteSettingInput>;

export function parseSiteSettingInput(
  data: unknown,
): { value: SiteSettingInput } | { error: string } {
  return parseWithSchema(SiteSettingInputSchema, data);
}

const SiteSettingValueSchema = z.object({
  value: requiredTrimmedString("value is required"),
});

export function parseSiteSettingValue(
  data: unknown,
): { value: string } | { error: string } {
  const parsed = parseWithSchema(SiteSettingValueSchema, data);
  if ("error" in parsed) return parsed;
  return { value: parsed.value.value };
}
