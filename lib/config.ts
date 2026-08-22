import "@std/dotenv/load";

function env(key: string, fallback: string): string {
  return Deno.env.get(key) ?? fallback;
}

export const MONGO_URI = env("MONGO_URI", "mongodb://localhost:27017");
export const MONGO_DB = env("MONGO_DB", "personal-website");
export const PHOTOS_COLLECTION = env("PHOTOS_COLLECTION", "photos");

export const S3_BUCKET = env("S3_BUCKET", "");
export const AWS_REGION = env("AWS_REGION", "eu-north-1");

export const ADMIN_PASSWORD = env("ADMIN_PASSWORD", "");
export const JWT_SECRET = env(
  "JWT_SECRET",
  "your-secret-key-change-in-production",
);
export const JWT_EXPIRY_HOURS = Number(env("JWT_EXPIRY_HOURS", "24"));

export const PHOTO_BASE_URL = env("PHOTO_BASE_URL", "https://ptchtrns.com");
