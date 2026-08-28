import { desc, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import { z } from "zod";
import { getDb } from "@/db/local-client.ts";
import { education, media } from "@/db/schema.ts";
import {
  multilineList,
  nullableTrimmedString,
  optionalDate,
  optionalIntId,
  parseWithSchema,
  requiredDate,
  requiredTrimmedString,
} from "@/lib/validation.ts";

const logo = alias(media, "education_logo");

export type EducationRow = typeof education.$inferSelect;
export type EducationInput = typeof education.$inferInsert;
export type EducationItem = EducationRow & { logoSrc: string | null };

async function listRows(): Promise<EducationItem[]> {
  const db = await getDb();
  return await db
    .select({
      id: education.id,
      degreeTitle: education.degreeTitle,
      degreeType: education.degreeType,
      educationInstitution: education.educationInstitution,
      institutionLogoId: education.institutionLogoId,
      logoSrc: logo.src,
      links: education.links,
      startedAt: education.startedAt,
      finishedAt: education.finishedAt,
      description: education.description,
      createdAt: education.createdAt,
    })
    .from(education)
    .leftJoin(logo, eq(education.institutionLogoId, logo.id))
    .orderBy(desc(education.startedAt));
}

export async function listEducation(): Promise<EducationItem[]> {
  return await listRows();
}

async function withLogo(id: number): Promise<EducationItem | null> {
  const rows = await listRows();
  return rows.find((row) => row.id === id) ?? null;
}

export async function createEducation(
  input: EducationInput,
): Promise<EducationItem> {
  const db = await getDb();
  const [row] = await db.insert(education).values(input).returning();
  const item = await withLogo(row.id);
  if (!item) throw new Error("Failed to load created education");
  return item;
}

export async function updateEducation(
  id: number,
  input: EducationInput,
): Promise<EducationItem | null> {
  const db = await getDb();
  const [row] = await db
    .update(education)
    .set(input)
    .where(eq(education.id, id))
    .returning();
  if (!row) return null;
  return await withLogo(row.id);
}

export async function deleteEducation(id: number): Promise<void> {
  const db = await getDb();
  await db.delete(education).where(eq(education.id, id));
}

const EducationInputSchema = z.object({
  degreeTitle: requiredTrimmedString("degreeTitle is required"),
  degreeType: requiredTrimmedString("degreeType is required"),
  educationInstitution: requiredTrimmedString(
    "educationInstitution is required",
  ),
  institutionLogoId: optionalIntId("Invalid institutionLogoId"),
  links: multilineList,
  startedAt: requiredDate("Invalid or missing startedAt"),
  finishedAt: optionalDate("Invalid finishedAt"),
  description: nullableTrimmedString,
}) satisfies z.ZodType<EducationInput>;

export function parseEducationInput(
  data: unknown,
): { value: EducationInput } | { error: string } {
  return parseWithSchema(EducationInputSchema, data);
}
