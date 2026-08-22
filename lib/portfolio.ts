import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db/local-client.ts";
import { education, media, projects, workExperience } from "@/db/schema.ts";

export type WorkExperienceItem = typeof workExperience.$inferSelect;
export type EducationItem = typeof education.$inferSelect;
export type ProjectItem = typeof projects.$inferSelect;

export async function listWorkExperience(): Promise<WorkExperienceItem[]> {
  return await getDb()
    .select()
    .from(workExperience)
    .orderBy(desc(workExperience.startedAt));
}

export async function listEducation(): Promise<EducationItem[]> {
  return await getDb()
    .select()
    .from(education)
    .orderBy(desc(education.startedAt));
}

export async function listPinnedProjects(): Promise<ProjectItem[]> {
  return await getDb()
    .select()
    .from(projects)
    .where(eq(projects.isPinned, true))
    .orderBy(desc(projects.createdAt));
}

/** Returns the sidebar profile picture's URL, or null if none has been uploaded yet. */
export async function getPfpSrc(): Promise<string | null> {
  const [row] = await getDb()
    .select({ src: media.src })
    .from(media)
    .where(eq(media.type, "pfp"))
    .orderBy(desc(media.id))
    .limit(1);
  return row?.src ?? null;
}
