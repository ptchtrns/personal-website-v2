import { desc, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import { z } from "zod";
import { getDb } from "@/db/local-client.ts";
import { media, workExperience } from "@/db/schema.ts";
import {
  multilineList,
  nullableTrimmedString,
  optionalDate,
  optionalIntId,
  parseWithSchema,
  requiredDate,
  requiredTrimmedString,
} from "@/lib/validation.ts";
import { markdownToHtml } from "@/lib/markdown.ts";

const logo = alias(media, "work_experience_logo");

export type WorkExperienceRow = typeof workExperience.$inferSelect;
export type WorkExperienceInput = typeof workExperience.$inferInsert;
export type WorkExperienceItem = WorkExperienceRow & {
  logoSrc: string | null;
  descriptionHtml: string | null;
};

async function listRows(): Promise<WorkExperienceItem[]> {
  const db = await getDb();
  const rows = await db
    .select({
      id: workExperience.id,
      jobTitle: workExperience.jobTitle,
      companyName: workExperience.companyName,
      companyUrl: workExperience.companyUrl,
      links: workExperience.links,
      companyLogoId: workExperience.companyLogoId,
      logoSrc: logo.src,
      startedAt: workExperience.startedAt,
      finishedAt: workExperience.finishedAt,
      description: workExperience.description,
      createdAt: workExperience.createdAt,
    })
    .from(workExperience)
    .leftJoin(logo, eq(workExperience.companyLogoId, logo.id))
    .orderBy(desc(workExperience.startedAt));
  return rows.map((row) => ({
    ...row,
    descriptionHtml: markdownToHtml(row.description),
  }));
}

export async function listWorkExperience(): Promise<WorkExperienceItem[]> {
  return await listRows();
}

async function withLogo(id: number): Promise<WorkExperienceItem | null> {
  const rows = await listRows();
  return rows.find((row) => row.id === id) ?? null;
}

export async function createWorkExperience(
  input: WorkExperienceInput,
): Promise<WorkExperienceItem> {
  const db = await getDb();
  const [row] = await db.insert(workExperience).values(input)
    .returning();
  const item = await withLogo(row.id);
  if (!item) throw new Error("Failed to load created work experience");
  return item;
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
  if (!row) return null;
  return await withLogo(row.id);
}

export async function deleteWorkExperience(id: number): Promise<void> {
  const db = await getDb();
  await db.delete(workExperience).where(eq(workExperience.id, id));
}

const WorkExperienceInputSchema = z.object({
  jobTitle: requiredTrimmedString("jobTitle is required"),
  companyName: requiredTrimmedString("companyName is required"),
  companyUrl: nullableTrimmedString,
  links: multilineList,
  companyLogoId: optionalIntId("Invalid companyLogoId"),
  startedAt: requiredDate("Invalid or missing startedAt"),
  finishedAt: optionalDate("Invalid finishedAt"),
  description: nullableTrimmedString,
}) satisfies z.ZodType<WorkExperienceInput, z.ZodTypeDef, unknown>;

export function parseWorkExperienceInput(
  data: unknown,
): { value: WorkExperienceInput } | { error: string } {
  return parseWithSchema(WorkExperienceInputSchema, data);
}
