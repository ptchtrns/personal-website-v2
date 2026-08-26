import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db/local-client.ts";
import { workExperience } from "@/db/schema.ts";
import {
  nullableTrimmedString,
  optionalDate,
  parseWithSchema,
  requiredDate,
  requiredTrimmedString,
} from "@/lib/validation.ts";
import { markdownToHtml } from "@/lib/markdown.ts";

export type WorkExperienceItem = typeof workExperience.$inferSelect;
export type WorkExperienceInput = typeof workExperience.$inferInsert;
export type WorkExperienceListItem = WorkExperienceItem & {
  descriptionHtml: string | null;
};

export async function listWorkExperience(): Promise<WorkExperienceListItem[]> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(workExperience)
    .orderBy(desc(workExperience.startedAt));
  return rows.map((row) => ({
    ...row,
    descriptionHtml: markdownToHtml(row.description),
  }));
}

export async function createWorkExperience(
  input: WorkExperienceInput,
): Promise<WorkExperienceItem> {
  const db = await getDb();
  const [row] = await db.insert(workExperience).values(input)
    .returning();
  return row;
}

export async function updateWorkExperience(
  id: number,
  input: WorkExperienceInput,
): Promise<WorkExperienceItem | null> {
  const db = await getDb();
  const [row] = await db
    .update(workExperience)
    .set(input)
    .where(eq(workExperience.id, id))
    .returning();
  return row ?? null;
}

export async function deleteWorkExperience(id: number): Promise<void> {
  const db = await getDb();
  await db.delete(workExperience).where(eq(workExperience.id, id));
}

const WorkExperienceInputSchema = z.object({
  jobTitle: requiredTrimmedString("jobTitle is required"),
  companyName: requiredTrimmedString("companyName is required"),
  companyUrl: nullableTrimmedString,
  companyLogoSrc: nullableTrimmedString,
  startedAt: requiredDate("Invalid or missing startedAt"),
  finishedAt: optionalDate("Invalid finishedAt"),
  description: nullableTrimmedString,
}) satisfies z.ZodType<WorkExperienceInput, z.ZodTypeDef, unknown>;

export function parseWorkExperienceInput(
  data: unknown,
): { value: WorkExperienceInput } | { error: string } {
  return parseWithSchema(WorkExperienceInputSchema, data);
}
