import { getPlatformProxy } from "wrangler";

/**
 * Narrow, locally-defined slice of the R2Bucket API. Deliberately not
 * importing miniflare/workers-types' own `R2Bucket` type here — its
 * `Request`/`Response` ambient globals otherwise leak into every file that
 * imports this module (same reasoning as `db/client.ts`).
 */
export interface LocalR2ObjectBody {
  arrayBuffer(): Promise<ArrayBuffer>;
  httpMetadata?: { contentType?: string };
}

export interface LocalR2Bucket {
  put(
    key: string,
    value:
      | ReadableStream
      | ArrayBuffer
      | ArrayBufferView
      | string
      | Blob
      | null,
  ): Promise<unknown>;
  get(key: string): Promise<LocalR2ObjectBody | null>;
}

interface Env {
  UPLOADS: LocalR2Bucket;
  CDN: LocalR2Bucket;
}

let proxyPromise: ReturnType<typeof getPlatformProxy<Env>> | null = null;

/**
 * Reads bindings straight out of `wrangler.toml`, backed by the same
 * `.wrangler/state/v3` store Wrangler's own local R2 emulation persists to
 * (so objects written here show up under `wrangler r2 object get ... --local`
 * too). No `wrangler dev` process needs to be running for this.
 */
function getProxy() {
  if (proxyPromise === null) {
    proxyPromise = getPlatformProxy<Env>();
  }
  return proxyPromise;
}

export async function getUploadsBucket(): Promise<LocalR2Bucket> {
  return (await getProxy()).env.UPLOADS;
}

export async function getCdnBucket(): Promise<LocalR2Bucket> {
  return (await getProxy()).env.CDN;
}

/**
 * `getPlatformProxy` spawns a `workerd` child process that otherwise keeps
 * the Deno process alive forever. Long-running servers can skip this; one-shot
 * scripts (e.g. `db/seed.ts`) must call it before exiting.
 */
export async function disposeLocalStorage(): Promise<void> {
  if (proxyPromise === null) return;
  await (await proxyPromise).dispose();
}
