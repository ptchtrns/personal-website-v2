import { defineConfig, type Plugin } from "vite";
import { fresh } from "@fresh/plugin-vite";
import tailwindcss from "@tailwindcss/vite";

/**
 * The MongoDB driver and the AWS SDK are CommonJS packages whose interop
 * breaks once Vite transforms or bundles them. Keeping them external leaves
 * the bare specifiers in place so Deno loads them at runtime, which means
 * `deno install` has to run before `deno task start`.
 */
const serverOnlyDependencies = [
  "mongodb",
  "@aws-sdk/client-s3",
  "@aws-sdk/s3-request-presigner",
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
});
