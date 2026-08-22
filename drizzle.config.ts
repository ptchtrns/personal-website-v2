import { defineConfig } from "drizzle-kit";
import { findLocalD1SqliteFile } from "./db/local.ts";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: findLocalD1SqliteFile() ?? "./db/migrations/.local-placeholder.sqlite",
  },
});
