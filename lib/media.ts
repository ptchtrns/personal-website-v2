import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db/local-client.ts";
import { media } from "@/db/schema.ts";
import { getConfig } from "@/lib/config.ts";
import { uploadObject } from "@/lib/storage.ts";
import { nullableTrimmedString, parseWithSchema } from "@/lib/validation.ts";

export type MediaType = (typeof media.$inferSelect)["type"];
export type MediaItem = typeof media.$inferSelect;

export const MEDIA_TYPES: MediaType[] = [
  "image",
  "pfp",
  "audio",
  "pdf",
];

export const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
  image: "Image",
  pfp: "Profile picture",
  audio: "Audio",
  pdf: "PDF",
};

export interface MediaFormInput {
  type: MediaType;
  alt: string | null;
}

const MediaFormSchema = z.object({
  type: z.enum(MEDIA_TYPES as [MediaType, ...MediaType[]], {
    error: "Invalid or missing type",
  }),
  alt: nullableTrimmedString,
}) satisfies z.ZodType<MediaFormInput>;

export function parseMediaFormInput(
  data: unknown,
): { value: MediaFormInput } | { error: string } {
  return parseWithSchema(MediaFormSchema, data);
}

const DEFAULT_EXTENSION_BY_TYPE: Record<MediaType, string> = {
  image: ".avif",
  pfp: ".avif",
  pdf: ".pdf",
  audio: ".mp3",
};

/** Exact content-type required per uploadable type; presigned URLs pin this so storage rejects anything else. */
export const ALLOWED_CONTENT_TYPE_BY_TYPE: Record<MediaType, string> = {
  image: "image/avif",
  pfp: "image/avif",
  pdf: "application/pdf",
  audio: "audio/mpeg",
};

/** Max upload size per uploadable type, in bytes. */
export const MAX_BYTES_BY_TYPE: Record<MediaType, number> = {
  image: 10 * 1024 * 1024,
  pfp: 5 * 1024 * 1024,
  pdf: 20 * 1024 * 1024,
  audio: 50 * 1024 * 1024,
};

export interface NewMediaItem {
  type: MediaType;
  alt: string | null;
  contentType: string;
  bytes: Uint8Array;
}

export async function listMedia(type?: MediaType): Promise<MediaItem[]> {
  const db = await getDb();
  const query = db.select().from(media).orderBy(desc(media.id));
  if (!type) return await query;
  return await query.where(eq(media.type, type));
}

/** Uploads the file's bytes to storage (the form posts the file straight to us) and stores the resulting media row. */
export async function createMedia(input: NewMediaItem): Promise<MediaItem> {
  const db = await getDb();

  const id = crypto.randomUUID();
  const ext = DEFAULT_EXTENSION_BY_TYPE[input.type];
  const key = `media/${input.type}/${id}/original${ext}`;
  const { PHOTO_BASE_URL } = await getConfig();
  const src = `${PHOTO_BASE_URL}/${key}`;
  await uploadObject(key, input.bytes, input.contentType);

  const [item] = await db.insert(media).values({
    src,
    type: input.type,
    alt: input.alt,
  }).returning();

  return item;
}

export async function updateMediaAlt(
  id: number,
  alt: string | null,
): Promise<MediaItem | null> {
  const db = await getDb();
  const [item] = await db
    .update(media)
    .set({ alt })
    .where(eq(media.id, id))
    .returning();
  return item ?? null;
}

/** Row-level delete only; the underlying storage object is left in place, matching the other admin resources. */
export async function deleteMedia(id: number): Promise<void> {
  const db = await getDb();
  await db.delete(media).where(eq(media.id, id));
}
