import { desc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/db/local-client.ts";
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

export type ProjectRow = typeof projects.$inferSelect;
export type ProjectItem = ProjectRow & {
  technologies: Technology[];
  media: MediaItem[];
};

export interface ProjectInput {
  name: string;
  description: string[] | null;
  changelog: string | null;
  shortOverview: string | null;
  externalUrl: string | null;
  isPinned: boolean;
  isActive: boolean;
  technologyNames: string[];
  mediaIds: number[];
}

/** Attaches each project's linked technologies and media, fetched in bulk and grouped in memory to avoid N+1 queries. */
async function withRelations(rows: ProjectRow[]): Promise<ProjectItem[]> {
  if (rows.length === 0) return [];
  const db = getDb();
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
  }));
}

export async function listAllProjects(): Promise<ProjectItem[]> {
  const rows = await getDb().select().from(projects).orderBy(
    desc(projects.createdAt),
  );
  return await withRelations(rows);
}

export async function listPinnedProjects(): Promise<ProjectRow[]> {
  return await getDb()
    .select()
    .from(projects)
    .where(eq(projects.isPinned, true))
    .orderBy(desc(projects.createdAt));
}

async function syncProjectLinks(
  db: ReturnType<typeof getDb>,
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
  const db = getDb();
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
  const db = getDb();
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
  await getDb().delete(projects).where(eq(projects.id, id));
}

export function parseProjectInput(
  data: unknown,
): { value: ProjectInput } | { error: string } {
  if (data === null || typeof data !== "object") {
    return { error: "Invalid request body" };
  }
  const body = data as Record<string, unknown>;

  const name = String(body.name ?? "").trim();
  if (!name) {
    return { error: "name is required" };
  }

  let description: string[] | null = null;
  if (Array.isArray(body.description)) {
    description = body.description.map((line) => String(line).trim())
      .filter(Boolean);
    if (description.length === 0) description = null;
  }

  const changelog = body.changelog ? String(body.changelog).trim() : null;
  const shortOverview = body.shortOverview
    ? String(body.shortOverview).trim()
    : null;
  const externalUrl = body.externalUrl ? String(body.externalUrl).trim() : null;
  const isPinned = Boolean(body.isPinned);
  const isActive = body.isActive === undefined ? true : Boolean(body.isActive);

  const technologyNames = Array.isArray(body.technologyNames)
    ? body.technologyNames.map((n) => String(n))
    : [];

  const mediaIds = Array.isArray(body.mediaIds)
    ? body.mediaIds.map((n) => Number(n)).filter((n) => Number.isInteger(n))
    : [];

  return {
    value: {
      name,
      description,
      changelog,
      shortOverview,
      externalUrl,
      isPinned,
      isActive,
      technologyNames,
      mediaIds,
    },
  };
}
