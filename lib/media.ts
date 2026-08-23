import { extname } from "@std/path";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db/local-client.ts";
import { media } from "@/db/schema.ts";
import { PHOTO_BASE_URL } from "@/lib/config.ts";
import { generatePresignedPutUrl } from "@/lib/storage.ts";

export type MediaType = (typeof media.$inferSelect)["type"];
export type MediaItem = typeof media.$inferSelect;

const DEFAULT_EXTENSION_BY_TYPE: Record<MediaType, string> = {
  image: ".jpg",
  pfp: ".jpg",
  pdf: ".pdf",
  audio: ".mp3",
  link: "",
};

export type NewMediaItem =
  & { type: MediaType; alt: string | null }
  & (
    | { type: "link"; src: string }
    | { type: Exclude<MediaType, "link">; filename: string }
  );

export async function listMedia(type?: MediaType): Promise<MediaItem[]> {
  const db = getDb();
  const query = db.select().from(media).orderBy(desc(media.id));
  if (!type) return await query;
  return await query.where(eq(media.type, type));
}

/**
 * For uploadable types, stores the media row and returns a presigned URL
 * the client uses to upload the file straight to storage. Links have no
 * file to upload, so the row is created with the given `src` directly and
 * no presigned URL is returned.
 */
export async function createMedia(
  input: NewMediaItem,
): Promise<{ presignedUrl: string | null; item: MediaItem }> {
  const db = getDb();

  if (input.type === "link") {
    const [item] = await db.insert(media).values({
      src: input.src,
      type: "link",
      alt: input.alt,
    }).returning();
    return { presignedUrl: null, item };
  }

  const id = crypto.randomUUID();
  const ext = extname(input.filename) || DEFAULT_EXTENSION_BY_TYPE[input.type];
  const key = `media/${input.type}/${id}/original${ext}`;
  const src = `${PHOTO_BASE_URL}/${key}`;
  const presignedUrl = await generatePresignedPutUrl(key, 60);

  const [item] = await db.insert(media).values({
    src,
    type: input.type,
    alt: input.alt,
  }).returning();

  return { presignedUrl, item };
}

export async function updateMediaAlt(
  id: number,
  alt: string | null,
): Promise<MediaItem | null> {
  const db = getDb();
  const [item] = await db
    .update(media)
    .set({ alt })
    .where(eq(media.id, id))
    .returning();
  return item ?? null;
}

/** Row-level delete only; the underlying storage object is left in place, matching the other admin resources. */
export async function deleteMedia(id: number): Promise<void> {
  const db = getDb();
  await db.delete(media).where(eq(media.id, id));
}
