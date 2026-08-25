import { eq, inArray } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import { z } from "zod";
import { getDb } from "@/db/local-client.ts";
import { media, releases, tracks } from "@/db/schema.ts";
import {
  multilineList,
  nullableTrimmedString,
  optionalIntId,
  parseWithSchema,
  requiredIntId,
  requiredTrimmedString,
} from "@/lib/validation.ts";

const cover = alias(media, "cover");

export type ReleaseRow = typeof releases.$inferSelect;
export type ReleaseType = "album" | "ep" | "single";
export const RELEASE_TYPES: ReleaseType[] = ["album", "ep", "single"];

export interface TrackItem {
  id: number;
  title: string;
  audioId: number;
  audioSrc: string;
  releaseId: number;
}

export interface ReleaseItem {
  id: number;
  title: string;
  type: ReleaseType;
  coverId: number | null;
  coverSrc: string | null;
  description: string | null;
  links: string[] | null;
  tracks: TrackItem[];
}

export interface ReleaseInput {
  title: string;
  type: ReleaseType;
  coverId: number | null;
  description: string | null;
  links: string[] | null;
}

export interface TrackInput {
  title: string;
  audioId: number;
  releaseId: number;
}

const LINK_LABELS_BY_HOSTNAME: Record<string, string> = {
  "open.spotify.com": "Spotify",
  "geo.music.apple.com": "Apple Music",
  "music.apple.com": "Apple Music",
  "www.tidal.com": "Tidal",
  "tidal.com": "Tidal",
  "www.youtube.com": "YouTube",
  "music.youtube.com": "YouTube Music",
  "bandcamp.com": "Bandcamp",
  "www.deezer.com": "Deezer",
  "deezer.com": "Deezer",
  "music.amazon.com": "Amazon Music",
  "pandora.app.link": "Pandora",
  "www.pandora.com": "Pandora",
};

/** Maps a streaming link's hostname to a human-readable platform name, falling back to the hostname itself. */
export function getLinkLabel(url: string): string {
  try {
    const { hostname } = new URL(url);
    if (LINK_LABELS_BY_HOSTNAME[hostname]) {
      return LINK_LABELS_BY_HOSTNAME[hostname];
    }
    if (hostname.endsWith(".bandcamp.com")) return "Bandcamp";
    return hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

async function tracksByReleaseIds(
  releaseIds: number[],
): Promise<Map<number, TrackItem[]>> {
  const byRelease = new Map<number, TrackItem[]>();
  if (releaseIds.length === 0) return byRelease;

  const db = await getDb();
  const rows = await db
    .select({
      id: tracks.id,
      title: tracks.title,
      audioId: tracks.audioId,
      audioSrc: media.src,
      releaseId: tracks.releaseId,
    })
    .from(tracks)
    .innerJoin(media, eq(tracks.audioId, media.id))
    .where(inArray(tracks.releaseId, releaseIds));

  for (const row of rows) {
    const list = byRelease.get(row.releaseId);
    if (list) list.push(row);
    else byRelease.set(row.releaseId, [row]);
  }
  return byRelease;
}

export async function listReleases(): Promise<ReleaseItem[]> {
  const db = await getDb();
  const rows = await db
    .select({
      id: releases.id,
      title: releases.title,
      type: releases.type,
      coverId: releases.coverId,
      coverSrc: cover.src,
      description: releases.description,
      links: releases.links,
    })
    .from(releases)
    .leftJoin(cover, eq(releases.coverId, cover.id));

  const tracksByRelease = await tracksByReleaseIds(rows.map((r) => r.id));

  return rows.map((row) => ({
    ...row,
    type: row.type as ReleaseType,
    tracks: tracksByRelease.get(row.id) ?? [],
  }));
}

async function withTracks(id: number): Promise<ReleaseItem | null> {
  const releaseRows = await listReleases();
  return releaseRows.find((r) => r.id === id) ?? null;
}

export async function createRelease(
  input: ReleaseInput,
): Promise<ReleaseItem> {
  const db = await getDb();
  const [row] = await db.insert(releases).values(input).returning();
  const item = await withTracks(row.id);
  if (!item) throw new Error("Failed to load created release");
  return item;
}

export async function updateRelease(
  id: number,
  input: ReleaseInput,
): Promise<ReleaseItem | null> {
  const db = await getDb();
  const [row] = await db
    .update(releases)
    .set(input)
    .where(eq(releases.id, id))
    .returning();
  if (!row) return null;
  return await withTracks(row.id);
}

export async function deleteRelease(id: number): Promise<void> {
  const db = await getDb();
  await db.delete(releases).where(eq(releases.id, id));
}

const ReleaseInputSchema = z.object({
  title: requiredTrimmedString("title is required"),
  type: z.preprocess(
    (v) => String(v ?? ""),
    z.enum(RELEASE_TYPES as [ReleaseType, ...ReleaseType[]], {
      errorMap: () => ({ message: "type must be one of album, ep, single" }),
    }),
  ),
  coverId: optionalIntId("Invalid coverId"),
  description: nullableTrimmedString,
  links: multilineList,
}) satisfies z.ZodType<ReleaseInput, z.ZodTypeDef, unknown>;

export function parseReleaseInput(
  data: unknown,
): { value: ReleaseInput } | { error: string } {
  return parseWithSchema(ReleaseInputSchema, data);
}

async function trackWithMedia(id: number): Promise<TrackItem | null> {
  const db = await getDb();
  const [row] = await db
    .select({
      id: tracks.id,
      title: tracks.title,
      audioId: tracks.audioId,
      audioSrc: media.src,
      releaseId: tracks.releaseId,
    })
    .from(tracks)
    .innerJoin(media, eq(tracks.audioId, media.id))
    .where(eq(tracks.id, id));
  return row ?? null;
}

export async function createTrack(input: TrackInput): Promise<TrackItem> {
  const db = await getDb();
  const [row] = await db.insert(tracks).values(input).returning();
  const item = await trackWithMedia(row.id);
  if (!item) throw new Error("Failed to load created track");
  return item;
}

export async function updateTrack(
  id: number,
  input: TrackInput,
): Promise<TrackItem | null> {
  const db = await getDb();
  const [row] = await db
    .update(tracks)
    .set(input)
    .where(eq(tracks.id, id))
    .returning();
  if (!row) return null;
  return await trackWithMedia(row.id);
}

export async function deleteTrack(id: number): Promise<void> {
  const db = await getDb();
  await db.delete(tracks).where(eq(tracks.id, id));
}

const TrackInputSchema = z.object({
  title: requiredTrimmedString("title is required"),
  audioId: requiredIntId("audioId is required"),
  releaseId: requiredIntId("releaseId is required"),
}) satisfies z.ZodType<TrackInput, z.ZodTypeDef, unknown>;

export function parseTrackInput(
  data: unknown,
): { value: TrackInput } | { error: string } {
  return parseWithSchema(TrackInputSchema, data);
}
