import { IS_WORKERS } from "@/lib/config.ts";

export interface StoredObject {
  arrayBuffer(): Promise<ArrayBuffer>;
  httpMetadata?: { contentType?: string };
}

/**
 * Narrow slice of the real Workers `R2Bucket` API, deliberately hand-rolled
 * rather than importing `@cloudflare/workers-types` (same reasoning as
 * `db/client.ts`'s D1 type — that package's ambient globals leak everywhere).
 */
interface R2Bucket {
  put(
    key: string,
    value: Uint8Array,
    options?: { httpMetadata?: { contentType?: string } },
  ): Promise<unknown>;
  get(key: string): Promise<StoredObject | null>;
}

/**
 * Both branches import lazily so Vite never has to eagerly bundle a module
 * that's only valid in the *other* runtime: `storage-local.ts` pulls in
 * `wrangler` (Deno-only), and `cloudflare:workers` only resolves once
 * actually deployed as a Worker.
 */
async function getBucket(): Promise<R2Bucket> {
  if (!IS_WORKERS) {
    const { getCdnBucket } = await import("@/lib/storage-local.ts");
    return await getCdnBucket();
  }
  const { env } = await import("cloudflare:workers");
  return (env as { CDN: R2Bucket }).CDN;
}

/**
 * Uploads a file's bytes to the CDN bucket under `key` (forms post the file
 * to us directly, no client-side JS to talk to R2 itself). Local dev writes
 * to Miniflare's local R2 emulation; deployed on Workers, this writes to the
 * real `CDN` binding.
 */
export async function uploadObject(
  key: string,
  body: Uint8Array,
  contentType: string,
): Promise<void> {
  const bucket = await getBucket();
  await bucket.put(key, body, { httpMetadata: { contentType } });
}

/** Reads an object back out of the CDN bucket, or null if it doesn't exist. */
export async function getObject(key: string): Promise<StoredObject | null> {
  const bucket = await getBucket();
  return await bucket.get(key);
}
