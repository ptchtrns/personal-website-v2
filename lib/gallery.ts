import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db/local-client.ts";
import { gallery, media } from "@/db/schema.ts";
import {
  parseWithSchema,
  requiredDate,
  requiredIntId,
} from "@/lib/validation.ts";

export type GalleryRow = typeof gallery.$inferSelect;
export interface GalleryItem {
  id: number;
  alt: string | null;
  imageId: number;
  src: string;
  createdAt: Date;
}

export interface GalleryInput {
  imageId: number;
  createdAt: Date;
}

export async function listGallery(): Promise<GalleryItem[]> {
  const db = await getDb();
  return await db
    .select({
      id: gallery.id,
      alt: media.alt,
      imageId: gallery.imageId,
      src: media.src,
      createdAt: gallery.createdAt,
    })
    .from(gallery)
    .innerJoin(media, eq(gallery.imageId, media.id))
    .orderBy(desc(gallery.createdAt), desc(gallery.id));
}

async function withImage(id: number): Promise<GalleryItem | null> {
  const db = await getDb();
  const [row] = await db
    .select({
      id: gallery.id,
      alt: media.alt,
      imageId: gallery.imageId,
      src: media.src,
      createdAt: gallery.createdAt,
    })
    .from(gallery)
    .innerJoin(media, eq(gallery.imageId, media.id))
    .where(eq(gallery.id, id));
  return row ?? null;
}

export async function createGalleryItem(
  input: GalleryInput,
): Promise<GalleryItem> {
  const db = await getDb();
  const [row] = await db.insert(gallery).values(input).returning();
  const item = await withImage(row.id);
  if (!item) throw new Error("Failed to load created gallery item");
  return item;
}

export async function updateGalleryItem(
  id: number,
  input: GalleryInput,
): Promise<GalleryItem | null> {
  const db = await getDb();
  const [row] = await db
    .update(gallery)
    .set(input)
    .where(eq(gallery.id, id))
    .returning();
  if (!row) return null;
  return await withImage(row.id);
}

export async function deleteGalleryItem(id: number): Promise<void> {
  const db = await getDb();
  await db.delete(gallery).where(eq(gallery.id, id));
}

const GalleryInputSchema = z.object({
  imageId: requiredIntId("imageId is required"),
  createdAt: requiredDate("Invalid or missing createdAt"),
}) satisfies z.ZodType<GalleryInput, z.ZodTypeDef, unknown>;

export function parseGalleryInput(
  data: unknown,
): { value: GalleryInput } | { error: string } {
  return parseWithSchema(GalleryInputSchema, data);
}
