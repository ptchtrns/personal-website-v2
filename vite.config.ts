import { defineConfig, type Plugin } from "vite";
import { fresh } from "@fresh/plugin-vite";
import { cloudflare } from "@cloudflare/vite-plugin";
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
  plugins: [externalizeServerDependencies(), fresh(), /* cloudflare(), */ tailwindcss()],
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
