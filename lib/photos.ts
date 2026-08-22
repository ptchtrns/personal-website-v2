import { PHOTO_BASE_URL } from "@/lib/config.ts";
import { getPhotosCollection } from "@/lib/db.ts";
import { generatePresignedPutUrl } from "@/lib/storage.ts";

export interface PhotoImage {
  original: string;
  full: string;
  "400": string;
}

export interface PhotoDocument {
  id: string;
  title: string;
  description: string;
  aspect_ratio: string;
  image: PhotoImage;
  created_at: Date;
  updated_at: Date;
}

/** A photo as sent to the client: MongoDB's ObjectId rendered as a string. */
export interface Photo
  extends Omit<PhotoDocument, "created_at" | "updated_at"> {
  _id: string;
  created_at: string;
  updated_at: string;
}

export interface NewPhoto {
  title: string;
  description: string;
  aspect_ratio: string;
}

export async function listPhotos(): Promise<Photo[]> {
  const documents = await getPhotosCollection().find({}).toArray();

  return documents.map((doc) => ({
    ...doc,
    _id: doc._id.toString(),
    created_at: doc.created_at.toISOString(),
    updated_at: doc.updated_at.toISOString(),
  }));
}

/**
 * Stores the photo metadata and returns a presigned URL the client uses to
 * upload the original file straight to S3.
 */
export async function createPhoto(input: NewPhoto): Promise<{
  id: string;
  presigned_url: string;
  photo: Photo;
}> {
  const photoId = crypto.randomUUID();
  const s3Key = `media/photos/${photoId}/original.jpg`;
  const presignedUrl = await generatePresignedPutUrl(s3Key, 60);

  const now = new Date();
  const photo: PhotoDocument = {
    id: photoId,
    title: input.title,
    description: input.description,
    aspect_ratio: input.aspect_ratio,
    image: {
      original: `${PHOTO_BASE_URL}/media/photos/${photoId}/original.jpg`,
      full: `${PHOTO_BASE_URL}/media/photos/${photoId}/full.jpg`,
      "400": `${PHOTO_BASE_URL}/media/photos/${photoId}/400.jpg`,
    },
    created_at: now,
    updated_at: now,
  };

  const result = await getPhotosCollection().insertOne(photo);

  return {
    id: result.insertedId.toString(),
    presigned_url: presignedUrl,
    photo: {
      ...photo,
      _id: result.insertedId.toString(),
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    },
  };
}
