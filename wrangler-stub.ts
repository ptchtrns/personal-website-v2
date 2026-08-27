/**
 * `wrangler.toml`'s `[alias]` swaps the real `wrangler` package for this file
 * when `wrangler deploy`/`wrangler dev` bundle `main` (see `wrangler.toml`).
 * `lib/storage-local.ts` imports `wrangler` for local Deno dev only; that
 * branch is dead code once deployed (`IS_WORKERS` is always true there), but
 * esbuild can't prove that statically and tries to bundle the real `wrangler`
 * CLI into the Worker, which fails (it isn't Workers-runtime compatible).
 */
export function getPlatformProxy(): never {
  throw new Error("getPlatformProxy is not available in the Workers runtime");
}
