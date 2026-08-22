import { eq } from "drizzle-orm";
import { getDb } from "@/db/local-client.ts";
import { gallery, media } from "@/db/schema.ts";
import { PHOTO_BASE_URL } from "@/lib/config.ts";
import { generatePresignedPutUrl } from "@/lib/storage.ts";

export interface GalleryItem {
  id: number;
  description: string | null;
  src: string;
}

export interface NewGalleryItem {
  description: string;
}

export async function listGallery(): Promise<GalleryItem[]> {
  return await getDb()
    .select({
      id: gallery.id,
      description: gallery.description,
      src: media.src,
    })
    .from(gallery)
    .innerJoin(media, eq(gallery.imageId, media.id));
}

/**
 * Stores the gallery item's media row and returns a presigned URL the client
 * uses to upload the image file straight to S3.
 */
export async function createGalleryItem(
  input: NewGalleryItem,
): Promise<{ presignedUrl: string; item: GalleryItem }> {
  const id = crypto.randomUUID();
  const key = `media/gallery/${id}/original.jpg`;
  const src = `${PHOTO_BASE_URL}/${key}`;
  const presignedUrl = await generatePresignedPutUrl(key, 60);

  const db = getDb();
  const [mediaRow] = await db.insert(media).values({ src, type: "image" })
    .returning();
  const [galleryRow] = await db
    .insert(gallery)
    .values({ description: input.description, imageId: mediaRow.id })
    .returning();

  return {
    presignedUrl,
    item: {
      id: galleryRow.id,
      description: galleryRow.description,
      src: mediaRow.src,
    },
  };
}
