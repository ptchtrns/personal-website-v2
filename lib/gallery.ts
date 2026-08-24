import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db/local-client.ts";
import { gallery, media } from "@/db/schema.ts";
import {
  nullableTrimmedString,
  parseWithSchema,
  requiredIntId,
} from "@/lib/validation.ts";

export type GalleryRow = typeof gallery.$inferSelect;
export interface GalleryItem {
  id: number;
  description: string | null;
  imageId: number;
  src: string;
}

export interface GalleryInput {
  description: string | null;
  imageId: number;
}

export async function listGallery(): Promise<GalleryItem[]> {
  return await getDb()
    .select({
      id: gallery.id,
      description: gallery.description,
      imageId: gallery.imageId,
      src: media.src,
    })
    .from(gallery)
    .innerJoin(media, eq(gallery.imageId, media.id));
}

async function withImage(id: number): Promise<GalleryItem | null> {
  const [row] = await getDb()
    .select({
      id: gallery.id,
      description: gallery.description,
      imageId: gallery.imageId,
      src: media.src,
    })
    .from(gallery)
    .innerJoin(media, eq(gallery.imageId, media.id))
    .where(eq(gallery.id, id));
  return row ?? null;
}

export async function createGalleryItem(
  input: GalleryInput,
): Promise<GalleryItem> {
  const [row] = await getDb().insert(gallery).values(input).returning();
  const item = await withImage(row.id);
  if (!item) throw new Error("Failed to load created gallery item");
  return item;
}

export async function updateGalleryItem(
  id: number,
  input: GalleryInput,
): Promise<GalleryItem | null> {
  const [row] = await getDb()
    .update(gallery)
    .set(input)
    .where(eq(gallery.id, id))
    .returning();
  if (!row) return null;
  return await withImage(row.id);
}

export async function deleteGalleryItem(id: number): Promise<void> {
  await getDb().delete(gallery).where(eq(gallery.id, id));
}

const GalleryInputSchema = z.object({
  description: nullableTrimmedString,
  imageId: requiredIntId("imageId is required"),
}) satisfies z.ZodType<GalleryInput, z.ZodTypeDef, unknown>;

export function parseGalleryInput(
  data: unknown,
): { value: GalleryInput } | { error: string } {
  return parseWithSchema(GalleryInputSchema, data);
}
