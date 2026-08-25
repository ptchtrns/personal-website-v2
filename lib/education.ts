import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db/local-client.ts";
import { education } from "@/db/schema.ts";
import {
  nullableTrimmedString,
  optionalDate,
  parseWithSchema,
  requiredDate,
  requiredTrimmedString,
} from "@/lib/validation.ts";

export type EducationItem = typeof education.$inferSelect;
export type EducationInput = typeof education.$inferInsert;

export async function listEducation(): Promise<EducationItem[]> {
  const db = await getDb();
  return await db
    .select()
    .from(education)
    .orderBy(desc(education.startedAt));
}

export async function createEducation(
  input: EducationInput,
): Promise<EducationItem> {
  const db = await getDb();
  const [row] = await db.insert(education).values(input).returning();
  return row;
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
  return row ?? null;
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
  institutionLogoSrc: nullableTrimmedString,
  startedAt: requiredDate("Invalid or missing startedAt"),
  finishedAt: optionalDate("Invalid finishedAt"),
  description: nullableTrimmedString,
}) satisfies z.ZodType<EducationInput, z.ZodTypeDef, unknown>;

export function parseEducationInput(
  data: unknown,
): { value: EducationInput } | { error: string } {
  return parseWithSchema(EducationInputSchema, data);
}
