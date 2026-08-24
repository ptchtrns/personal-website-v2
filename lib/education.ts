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
  return await getDb()
    .select()
    .from(education)
    .orderBy(desc(education.startedAt));
}

export async function createEducation(
  input: EducationInput,
): Promise<EducationItem> {
  const [row] = await getDb().insert(education).values(input).returning();
  return row;
}

export async function updateEducation(
  id: number,
  input: EducationInput,
): Promise<EducationItem | null> {
  const [row] = await getDb()
    .update(education)
    .set(input)
    .where(eq(education.id, id))
    .returning();
  return row ?? null;
}

export async function deleteEducation(id: number): Promise<void> {
  await getDb().delete(education).where(eq(education.id, id));
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
