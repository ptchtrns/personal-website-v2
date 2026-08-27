import { desc, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import {
  coercedBoolean,
  intIdArray,
  multilineList,
  nullableTrimmedString,
  parseWithSchema,
  requiredTrimmedString,
  stringArray,
} from "@/lib/validation.ts";
import { type Db, getDb } from "@/db/local-client.ts";
import {
  media,
  projects,
  projectsToMedia,
  projectsToTechnologies,
  technologies,
} from "@/db/schema.ts";
import {
  findOrCreateTechnologies,
  type Technology,
} from "@/lib/technologies.ts";
import type { MediaItem } from "@/lib/media.ts";
import { markdownToHtml } from "@/lib/markdown.ts";

export type ProjectRow = typeof projects.$inferSelect;
export type ProjectItem = ProjectRow & {
  technologies: Technology[];
  media: MediaItem[];
  descriptionHtml: string | null;
};

export interface ProjectInput {
  name: string;
  description: string | null;
  changelog: string | null;
  shortOverview: string | null;
  externalUrl: string | null;
  links: string[] | null;
  isPinned: boolean;
  isActive: boolean;
  technologyNames: string[];
  mediaIds: number[];
}

/** Attaches each project's linked technologies and media, fetched in bulk and grouped in memory to avoid N+1 queries. */
async function withRelations(rows: ProjectRow[]): Promise<ProjectItem[]> {
  if (rows.length === 0) return [];
  const db = await getDb();
  const ids = rows.map((r) => r.id);

  const techRows = await db
    .select({ projectId: projectsToTechnologies.projectId, tech: technologies })
    .from(projectsToTechnologies)
    .innerJoin(
      technologies,
      eq(projectsToTechnologies.technologyId, technologies.id),
    )
    .where(inArray(projectsToTechnologies.projectId, ids));

  const mediaRows = await db
    .select({ projectId: projectsToMedia.projectId, media })
    .from(projectsToMedia)
    .innerJoin(media, eq(projectsToMedia.mediaId, media.id))
    .where(inArray(projectsToMedia.projectId, ids));

  const techByProject = new Map<number, Technology[]>();
  for (const row of techRows) {
    const list = techByProject.get(row.projectId) ?? [];
    list.push(row.tech);
    techByProject.set(row.projectId, list);
  }

  const mediaByProject = new Map<number, MediaItem[]>();
  for (const row of mediaRows) {
    const list = mediaByProject.get(row.projectId) ?? [];
    list.push(row.media);
    mediaByProject.set(row.projectId, list);
  }

  return rows.map((row) => ({
    ...row,
    technologies: techByProject.get(row.id) ?? [],
    media: mediaByProject.get(row.id) ?? [],
    descriptionHtml: markdownToHtml(row.description),
  }));
}

export async function listAllProjects(): Promise<ProjectItem[]> {
  const db = await getDb();
  const rows = await db.select().from(projects).orderBy(
    desc(projects.isPinned),
    desc(projects.createdAt),
  );
  return await withRelations(rows);
}

async function syncProjectLinks(
  db: Db,
  projectId: number,
  technologyNames: string[],
  mediaIds: number[],
) {
  await db.delete(projectsToTechnologies).where(
    eq(projectsToTechnologies.projectId, projectId),
  );
  await db.delete(projectsToMedia).where(
    eq(projectsToMedia.projectId, projectId),
  );

  const techs = await findOrCreateTechnologies(technologyNames);
  if (techs.length > 0) {
    await db.insert(projectsToTechnologies).values(
      techs.map((tech) => ({ projectId, technologyId: tech.id })),
    );
  }

  if (mediaIds.length > 0) {
    await db.insert(projectsToMedia).values(
      mediaIds.map((mediaId) => ({ projectId, mediaId })),
    );
  }
}

export async function createProject(
  input: ProjectInput,
): Promise<ProjectItem> {
  const { technologyNames, mediaIds, ...row } = input;
  const db = await getDb();
  const [project] = await db.insert(projects).values(row).returning();
  await syncProjectLinks(db, project.id, technologyNames, mediaIds);
  const [item] = await withRelations([project]);
  return item;
}

export async function updateProject(
  id: number,
  input: ProjectInput,
): Promise<ProjectItem | null> {
  const { technologyNames, mediaIds, ...row } = input;
  const db = await getDb();
  const [project] = await db
    .update(projects)
    .set({ ...row, updatedAt: new Date() })
    .where(eq(projects.id, id))
    .returning();
  if (!project) return null;

  await syncProjectLinks(db, project.id, technologyNames, mediaIds);
  const [item] = await withRelations([project]);
  return item;
}

export async function deleteProject(id: number): Promise<void> {
  const db = await getDb();
  await db.delete(projects).where(eq(projects.id, id));
}

const ProjectInputSchema = z.object({
  name: requiredTrimmedString("name is required"),
  description: nullableTrimmedString,
  changelog: nullableTrimmedString,
  shortOverview: nullableTrimmedString,
  externalUrl: nullableTrimmedString,
  links: multilineList,
  isPinned: coercedBoolean,
  isActive: z.preprocess(
    (v) => (v === undefined ? true : Boolean(v)),
    z.boolean(),
  ),
  technologyNames: stringArray,
  mediaIds: intIdArray,
}) satisfies z.ZodType<ProjectInput, z.ZodTypeDef, unknown>;

export function parseProjectInput(
  data: unknown,
): { value: ProjectInput } | { error: string } {
  return parseWithSchema(ProjectInputSchema, data);
}
