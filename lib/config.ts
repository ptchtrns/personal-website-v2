import "@std/dotenv/load";

function env(key: string, fallback: string): string {
  return Deno.env.get(key) ?? fallback;
}

export const S3_BUCKET = env("S3_BUCKET", "");
export const AWS_REGION = env("AWS_REGION", "eu-north-1");

/** No real S3/R2 endpoint to presign against in dev, so uploads route through Miniflare's local R2 emulation instead. */
export const LOCAL_DEV = env("LOCAL_DEV", "true") === "true";

export const ADMIN_PASSWORD = env("ADMIN_PASSWORD", "");
export const JWT_SECRET = env(
  "JWT_SECRET",
  "your-secret-key-change-in-production",
);
export const JWT_EXPIRY_HOURS = Number(env("JWT_EXPIRY_HOURS", "24"));

/** No real CDN domain fronting R2 in dev, so media URLs stay same-origin and are served by `routes/media/[...key].ts` off Miniflare's local R2 emulation instead. */
export const PHOTO_BASE_URL = env(
  "PHOTO_BASE_URL",
  LOCAL_DEV ? "" : "https://ptchtrns.com",
);
