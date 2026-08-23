import { defineConfig, type Plugin } from "vite";
import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";

/**
 * The AWS SDK is a CommonJS package whose interop breaks once Vite
 * transforms or bundles it. Keeping it external leaves the bare specifier
 * in place so Deno loads it at runtime, which means `deno install` has to
 * run before `deno task start`.
 */
const serverOnlyDependencies = [
  "@aws-sdk/client-s3",
  "@aws-sdk/s3-request-presigner",
  "wrangler",
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
