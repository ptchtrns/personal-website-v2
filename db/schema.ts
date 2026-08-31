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
  type: text("type", { enum: ["image", "pdf", "audio", "pfp"] })
    .notNull(),
  alt: text("alt"),
});

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  changelog: text("changelog"),
  shortOverview: text("short_overview"),
  externalUrl: text("external_url"),
  links: text("links", { mode: "json" }).$type<string[]>(),
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
    order: integer("order").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.projectId, t.mediaId] })],
);

export const gallery = sqliteTable("gallery", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  imageId: integer("image_id").notNull().references(() => media.id, {
    onDelete: "cascade",
  }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(
    sql`(unixepoch())`,
  ),
});

export const releases = sqliteTable("releases", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  type: text("type", { enum: ["album", "ep", "single"] }).notNull(),
  coverId: integer("cover_id").references(() => media.id, {
    onDelete: "set null",
  }),
  description: text("description"),
  links: text("links", { mode: "json" }).$type<string[]>(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(
    sql`(unixepoch())`,
  ),
});

export const tracks = sqliteTable("tracks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  audioId: integer("audio_id").notNull().references(() => media.id, {
    onDelete: "cascade",
  }),
  releaseId: integer("release_id").notNull().references(() => releases.id, {
    onDelete: "cascade",
  }),
});

export const siteSettings = sqliteTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(
    sql`(unixepoch())`,
  ),
});

const tables = {
  media,
  projects,
  technologies,
  projectsToTechnologies,
  projectsToMedia,
  gallery,
  releases,
  tracks,
  siteSettings,
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
  releases: {
    cover: r.one.media({
      from: r.releases.coverId,
      to: r.media.id,
      optional: true,
    }),
    tracks: r.many.tracks({
      from: r.releases.id,
      to: r.tracks.releaseId,
    }),
  },
  tracks: {
    audio: r.one.media({
      from: r.tracks.audioId,
      to: r.media.id,
    }),
    release: r.one.releases({
      from: r.tracks.releaseId,
      to: r.releases.id,
    }),
  },
}));
