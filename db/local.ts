import fs from "node:fs";
import path from "node:path";

/** Locates the sqlite file Wrangler's local D1 emulation persists to disk. */
export function findLocalD1SqliteFile(): string | undefined {
  const basePath = path.resolve(".wrangler/state/v3/d1");
  if (!fs.existsSync(basePath)) return undefined;
  const dbFile = fs
    .readdirSync(basePath, { encoding: "utf-8", recursive: true })
    .find((f) => f.endsWith(".sqlite"));
  if (!dbFile) return undefined;
  return path.resolve(basePath, dbFile);
}
