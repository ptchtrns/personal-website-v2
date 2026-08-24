import { eq, inArray } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import { getDb } from "@/db/local-client.ts";
import { media, releases, tracks } from "@/db/schema.ts";

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
  tracks: TrackItem[];
}

export interface ReleaseInput {
  title: string;
  type: ReleaseType;
  coverId: number | null;
}

export interface TrackInput {
  title: string;
  audioId: number;
  releaseId: number;
}

async function tracksByReleaseIds(
  releaseIds: number[],
): Promise<Map<number, TrackItem[]>> {
  const byRelease = new Map<number, TrackItem[]>();
  if (releaseIds.length === 0) return byRelease;

  const rows = await getDb()
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
  const rows = await getDb()
    .select({
      id: releases.id,
      title: releases.title,
      type: releases.type,
      coverId: releases.coverId,
      coverSrc: cover.src,
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
  const [row] = await getDb().insert(releases).values(input).returning();
  const item = await withTracks(row.id);
  if (!item) throw new Error("Failed to load created release");
  return item;
}

export async function updateRelease(
  id: number,
  input: ReleaseInput,
): Promise<ReleaseItem | null> {
  const [row] = await getDb()
    .update(releases)
    .set(input)
    .where(eq(releases.id, id))
    .returning();
  if (!row) return null;
  return await withTracks(row.id);
}

export async function deleteRelease(id: number): Promise<void> {
  await getDb().delete(releases).where(eq(releases.id, id));
}

export function parseReleaseInput(
  data: unknown,
): { value: ReleaseInput } | { error: string } {
  if (data === null || typeof data !== "object") {
    return { error: "Invalid request body" };
  }
  const body = data as Record<string, unknown>;

  const title = String(body.title ?? "").trim();
  if (!title) {
    return { error: "title is required" };
  }

  const type = String(body.type ?? "");
  if (!RELEASE_TYPES.includes(type as ReleaseType)) {
    return { error: "type must be one of album, ep, single" };
  }

  let coverId: number | null = null;
  if (
    body.coverId !== null && body.coverId !== undefined && body.coverId !== ""
  ) {
    coverId = Number(body.coverId);
    if (!Number.isInteger(coverId)) {
      return { error: "Invalid coverId" };
    }
  }

  return { value: { title, type: type as ReleaseType, coverId } };
}

async function trackWithMedia(id: number): Promise<TrackItem | null> {
  const [row] = await getDb()
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
  const [row] = await getDb().insert(tracks).values(input).returning();
  const item = await trackWithMedia(row.id);
  if (!item) throw new Error("Failed to load created track");
  return item;
}

export async function updateTrack(
  id: number,
  input: TrackInput,
): Promise<TrackItem | null> {
  const [row] = await getDb()
    .update(tracks)
    .set(input)
    .where(eq(tracks.id, id))
    .returning();
  if (!row) return null;
  return await trackWithMedia(row.id);
}

export async function deleteTrack(id: number): Promise<void> {
  await getDb().delete(tracks).where(eq(tracks.id, id));
}

export function parseTrackInput(
  data: unknown,
): { value: TrackInput } | { error: string } {
  if (data === null || typeof data !== "object") {
    return { error: "Invalid request body" };
  }
  const body = data as Record<string, unknown>;

  const title = String(body.title ?? "").trim();
  if (!title) {
    return { error: "title is required" };
  }

  const audioId = Number(body.audioId);
  if (!Number.isInteger(audioId)) {
    return { error: "audioId is required" };
  }

  const releaseId = Number(body.releaseId);
  if (!Number.isInteger(releaseId)) {
    return { error: "releaseId is required" };
  }

  return { value: { title, audioId, releaseId } };
}
