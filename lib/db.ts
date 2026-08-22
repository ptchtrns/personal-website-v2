import { type Collection, MongoClient } from "mongodb";
import { MONGO_DB, MONGO_URI, PHOTOS_COLLECTION } from "@/lib/config.ts";
import type { PhotoDocument } from "@/lib/photos.ts";

let client: MongoClient | null = null;

export function getClient(): MongoClient {
  if (client === null) {
    client = new MongoClient(MONGO_URI);
  }
  return client;
}

export function getPhotosCollection(): Collection<PhotoDocument> {
  return getClient().db(MONGO_DB).collection<PhotoDocument>(PHOTOS_COLLECTION);
}

export async function closeClient() {
  if (client !== null) {
    await client.close();
    client = null;
  }
}
