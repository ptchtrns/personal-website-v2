import { eq } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import { getDb } from "@/db/local-client.ts";
import { media, music } from "@/db/schema.ts";

export type MusicRow = typeof music.$inferSelect;
export interface MusicItem {
  id: number;
  title: string;
  audioId: number;
  audioSrc: string;
  coverId: number | null;
  coverSrc: string | null;
}

export interface MusicInput {
  title: string;
  audioId: number;
  coverId: number | null;
}

const cover = alias(media, "cover");

function select() {
  return getDb()
    .select({
      id: music.id,
      title: music.title,
      audioId: music.audioId,
      audioSrc: media.src,
      coverId: music.coverId,
      coverSrc: cover.src,
    })
    .from(music)
    .innerJoin(media, eq(music.audioId, media.id))
    .leftJoin(cover, eq(music.coverId, cover.id));
}

export async function listMusic(): Promise<MusicItem[]> {
  return await select();
}

async function withMedia(id: number): Promise<MusicItem | null> {
  const [row] = await select().where(eq(music.id, id));
  return row ?? null;
}

export async function createMusic(input: MusicInput): Promise<MusicItem> {
  const [row] = await getDb().insert(music).values(input).returning();
  const item = await withMedia(row.id);
  if (!item) throw new Error("Failed to load created music item");
  return item;
}

export async function updateMusic(
  id: number,
  input: MusicInput,
): Promise<MusicItem | null> {
  const [row] = await getDb()
    .update(music)
    .set(input)
    .where(eq(music.id, id))
    .returning();
  if (!row) return null;
  return await withMedia(row.id);
}

export async function deleteMusic(id: number): Promise<void> {
  await getDb().delete(music).where(eq(music.id, id));
}

export function parseMusicInput(
  data: unknown,
): { value: MusicInput } | { error: string } {
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

  let coverId: number | null = null;
  if (
    body.coverId !== null && body.coverId !== undefined && body.coverId !== ""
  ) {
    coverId = Number(body.coverId);
    if (!Number.isInteger(coverId)) {
      return { error: "Invalid coverId" };
    }
  }

  return { value: { title, audioId, coverId } };
}
