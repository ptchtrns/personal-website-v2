import { defineRelations, sql } from "drizzle-orm";
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const media = sqliteTable("media", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  src: text("src").notNull(),
  type: text("type", { enum: ["image", "pdf", "audio", "link"] }).notNull(),
});

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description", { mode: "json" }).$type<string[]>(),
  changelog: text("changelog"),
  shortOverview: text("short_overview"),
  logoSrc: text("logo_src"),
  externalUrl: text("external_url"),
  isPinned: integer("is_pinned", { mode: "boolean" }).notNull().default(false),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(
    sql`(unixepoch())`,
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(
    sql`(unixepoch())`,
  ),
});

export const technologies = sqliteTable("technologies", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(
    sql`(unixepoch())`,
  ),
});

export const projectsToTechnologies = sqliteTable(
  "projects_to_technologies",
  {
    projectId: integer("project_id").notNull().references(
      () => projects.id,
      { onDelete: "cascade" },
    ),
    technologyId: integer("technology_id").notNull().references(
      () => technologies.id,
      { onDelete: "cascade" },
    ),
  },
  (t) => [primaryKey({ columns: [t.projectId, t.technologyId] })],
);

export const projectsToMedia = sqliteTable(
  "projects_to_media",
  {
    projectId: integer("project_id").notNull().references(
      () => projects.id,
      { onDelete: "cascade" },
    ),
    mediaId: integer("media_id").notNull().references(
      () => media.id,
      { onDelete: "cascade" },
    ),
  },
  (t) => [primaryKey({ columns: [t.projectId, t.mediaId] })],
);

export const workExperience = sqliteTable("work_experience", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  jobTitle: text("job_title").notNull(),
  companyName: text("company_name").notNull(),
  companyUrl: text("company_url"),
  startedAt: integer("started_at", { mode: "timestamp" }).notNull(),
  finishedAt: integer("finished_at", { mode: "timestamp" }),
  companyLogoSrc: text("company_logo_src"),
  description: text("description", { mode: "json" }).$type<string[]>(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(
    sql`(unixepoch())`,
  ),
});

export const education = sqliteTable("education", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  degreeTitle: text("degree_title").notNull(),
  degreeType: text("degree_type").notNull(),
  educationInstitution: text("education_institution").notNull(),
  institutionLogoSrc: text("institution_logo_src"),
  startedAt: integer("started_at", { mode: "timestamp" }).notNull(),
  finishedAt: integer("finished_at", { mode: "timestamp" }),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(
    sql`(unixepoch())`,
  ),
});

export const gallery = sqliteTable("gallery", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  description: text("description"),
  imageId: integer("image_id").notNull().references(() => media.id, {
    onDelete: "cascade",
  }),
});

export const music = sqliteTable("music", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  audioId: integer("audio_id").notNull().references(() => media.id, {
    onDelete: "cascade",
  }),
  coverId: integer("cover_id").references(() => media.id, {
    onDelete: "set null",
  }),
});

const tables = {
  media,
  projects,
  technologies,
  projectsToTechnologies,
  projectsToMedia,
  workExperience,
  education,
  gallery,
  music,
};

export const dbRelations = defineRelations(tables, (r) => ({
  projects: {
    technologies: r.many.technologies({
      from: r.projects.id.through(r.projectsToTechnologies.projectId),
      to: r.technologies.id.through(r.projectsToTechnologies.technologyId),
    }),
    media: r.many.media({
      from: r.projects.id.through(r.projectsToMedia.projectId),
      to: r.media.id.through(r.projectsToMedia.mediaId),
    }),
  },
  technologies: {
    projects: r.many.projects({
      from: r.technologies.id.through(r.projectsToTechnologies.technologyId),
      to: r.projects.id.through(r.projectsToTechnologies.projectId),
    }),
  },
  media: {
    projects: r.many.projects({
      from: r.media.id.through(r.projectsToMedia.mediaId),
      to: r.projects.id.through(r.projectsToMedia.projectId),
    }),
  },
  gallery: {
    image: r.one.media({
      from: r.gallery.imageId,
      to: r.media.id,
    }),
  },
  music: {
    audio: r.one.media({
      from: r.music.audioId,
      to: r.media.id,
    }),
    cover: r.one.media({
      from: r.music.coverId,
      to: r.media.id,
      optional: true,
    }),
  },
}));
