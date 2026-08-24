import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db/local-client.ts";
import { workExperience } from "@/db/schema.ts";
import {
  multilineList,
  nullableTrimmedString,
  optionalDate,
  parseWithSchema,
  requiredDate,
  requiredTrimmedString,
} from "@/lib/validation.ts";

export type WorkExperienceItem = typeof workExperience.$inferSelect;
export type WorkExperienceInput = typeof workExperience.$inferInsert;

export async function listWorkExperience(): Promise<WorkExperienceItem[]> {
  return await getDb()
    .select()
    .from(workExperience)
    .orderBy(desc(workExperience.startedAt));
}

export async function createWorkExperience(
  input: WorkExperienceInput,
): Promise<WorkExperienceItem> {
  const [row] = await getDb().insert(workExperience).values(input)
    .returning();
  return row;
}

export async function updateWorkExperience(
  id: number,
  input: WorkExperienceInput,
): Promise<WorkExperienceItem | null> {
  const [row] = await getDb()
    .update(workExperience)
    .set(input)
    .where(eq(workExperience.id, id))
    .returning();
  return row ?? null;
}

export async function deleteWorkExperience(id: number): Promise<void> {
  await getDb().delete(workExperience).where(eq(workExperience.id, id));
}

const WorkExperienceInputSchema = z.object({
  jobTitle: requiredTrimmedString("jobTitle is required"),
  companyName: requiredTrimmedString("companyName is required"),
  companyUrl: nullableTrimmedString,
  companyLogoSrc: nullableTrimmedString,
  startedAt: requiredDate("Invalid or missing startedAt"),
  finishedAt: optionalDate("Invalid finishedAt"),
  description: multilineList,
}) satisfies z.ZodType<WorkExperienceInput, z.ZodTypeDef, unknown>;

export function parseWorkExperienceInput(
  data: unknown,
): { value: WorkExperienceInput } | { error: string } {
  return parseWithSchema(WorkExperienceInputSchema, data);
}
