import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db/local-client.ts";
import { workExperience } from "@/db/schema.ts";

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

export function parseWorkExperienceInput(
  data: unknown,
): { value: WorkExperienceInput } | { error: string } {
  if (data === null || typeof data !== "object") {
    return { error: "Invalid request body" };
  }
  const body = data as Record<string, unknown>;

  const jobTitle = String(body.jobTitle ?? "").trim();
  const companyName = String(body.companyName ?? "").trim();
  if (!jobTitle || !companyName) {
    return { error: "jobTitle and companyName are required" };
  }

  const startedAtRaw = body.startedAt;
  const startedAt = typeof startedAtRaw === "string"
    ? new Date(startedAtRaw)
    : null;
  if (!startedAt || Number.isNaN(startedAt.getTime())) {
    return { error: "Invalid or missing startedAt" };
  }

  const finishedAtRaw = body.finishedAt;
  let finishedAt: Date | null = null;
  if (typeof finishedAtRaw === "string" && finishedAtRaw.trim()) {
    finishedAt = new Date(finishedAtRaw);
    if (Number.isNaN(finishedAt.getTime())) {
      return { error: "Invalid finishedAt" };
    }
  }

  const companyUrl = body.companyUrl ? String(body.companyUrl).trim() : null;
  const companyLogoSrc = body.companyLogoSrc
    ? String(body.companyLogoSrc).trim()
    : null;

  let description: string[] | null = null;
  if (Array.isArray(body.description)) {
    description = body.description.map((line) => String(line).trim())
      .filter(Boolean);
    if (description.length === 0) description = null;
  }

  return {
    value: {
      jobTitle,
      companyName,
      companyUrl,
      companyLogoSrc,
      startedAt,
      finishedAt,
      description,
    },
  };
}
