import { defineConfig, type Plugin } from "vite";
import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";

/**
 * `wrangler` is Deno-only tooling (local R2/D1 emulation, see
 * `lib/storage-local.ts` / `db/local.ts`) and `cloudflare:workers` only
 * resolves inside a deployed Worker's runtime. Both are reached exclusively
 * through runtime-guarded dynamic `import()`s, so Vite must never try to
 * eagerly resolve or bundle them itself — that would drag Deno-only or
 * Workers-only code into the wrong build.
 */
const serverOnlyDependencies = [
  "wrangler",
  "cloudflare:workers",
];

function externalizeServerDependencies(): Plugin {
  return {
    name: "externalize-server-dependencies",
    enforce: "pre",
    resolveId(id) {
      if (serverOnlyDependencies.includes(id)) {
        return { id, external: true };
      }
    },
  };
}

export default defineConfig({
  /**
   * No `@cloudflare/vite-plugin` here: dev already has its own D1/R2
   * emulation (`lib/storage-local.ts`'s `getPlatformProxy`, `db/local.ts`'s
   * sqlite file), and `wrangler deploy` bundles `main` from `wrangler.toml`
   * itself, independent of any Vite worker-environment build. Adding the
   * plugin creates a second `build.ssr` environment alongside Fresh's own
   * `ssr` one; Fresh's route/CSS build hooks apply to any server-consumer
   * environment, so they fire for both and corrupt each other's output
   * (regardless of build order, and regardless of whether the Cloudflare
   * environment is separate or reused via `viteEnvironment`).
   */
  plugins: [externalizeServerDependencies(), fresh(), tailwindcss()],
  environments: {
    ssr: {
      resolve: {
        external: serverOnlyDependencies,
      },
    },
  },
  server: {
    watch: {
      // Local D1/R2 emulation (Miniflare/Wrangler) writes here on every
      // dev-mode database or upload mutation; without this, each write
      // trips Vite's watcher and forces a full page reload mid-request.
      ignored: ["**/.wrangler/**"],
    },
  },
});
