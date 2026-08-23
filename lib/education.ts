import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db/local-client.ts";
import { education } from "@/db/schema.ts";

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

export function parseEducationInput(
  data: unknown,
): { value: EducationInput } | { error: string } {
  if (data === null || typeof data !== "object") {
    return { error: "Invalid request body" };
  }
  const body = data as Record<string, unknown>;

  const degreeTitle = String(body.degreeTitle ?? "").trim();
  const degreeType = String(body.degreeType ?? "").trim();
  const educationInstitution = String(body.educationInstitution ?? "").trim();
  if (!degreeTitle || !degreeType || !educationInstitution) {
    return {
      error: "degreeTitle, degreeType and educationInstitution are required",
    };
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

  const institutionLogoSrc = body.institutionLogoSrc
    ? String(body.institutionLogoSrc).trim()
    : null;
  const description = body.description ? String(body.description).trim() : null;

  return {
    value: {
      degreeTitle,
      degreeType,
      educationInstitution,
      institutionLogoSrc,
      startedAt,
      finishedAt,
      description,
    },
  };
}
