import { z } from "zod";

/** No `Deno` global exists once this runs as a deployed Cloudflare Worker. */
export const IS_WORKERS = typeof Deno === "undefined";

/**
 * `@std/dotenv/load` reads `.env` via `Deno.readTextFileSync`, so it must
 * stay out of the static import graph entirely — a top-level `import` runs
 * before `IS_WORKERS` above is even assigned, crashing the Worker on
 * `Deno is not defined` before any of our own runtime checks get a say.
 */
if (!IS_WORKERS) {
  await import("@std/dotenv/load");
}

/**
 * `ADMIN_PASSWORD`, `JWT_SECRET` and `RESEND_API_KEY` are allowed to be
 * empty — that's how login/email sending get intentionally disabled (see
 * `routes/api/login.ts` and `routes/api/contact.ts`) — so they're plain
 * strings rather than `.min(1)`.
 */
const ConfigSchema = z.object({
  ADMIN_PASSWORD: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRY_HOURS: z.coerce.number({
    invalid_type_error: "JWT_EXPIRY_HOURS must be a number",
  }).int().positive(),
  RESEND_API_KEY: z.string(),
  CONTACT_TO_EMAIL: z.string().email(
    "CONTACT_TO_EMAIL must be a valid email address",
  ),
  PHOTO_BASE_URL: z.string().refine(
    (v) => v === "" || /^https?:\/\//.test(v),
    "PHOTO_BASE_URL must be empty or an absolute http(s) URL",
  ),
});

export type Config = z.infer<typeof ConfigSchema>;

/** Local dev reads `Deno.env`; on Workers, vars/secrets only exist on the per-request `env` binding, reached via `cloudflare:workers`'s importable `env`. */
async function readEnv(key: string, fallback: string): Promise<string> {
  if (IS_WORKERS) {
    const { env } = await import("cloudflare:workers");
    return (env as Record<string, string>)[key] ?? fallback;
  }
  return Deno.env.get(key) ?? fallback;
}

let configPromise: Promise<Config> | null = null;

/** Reads and validates env config once, caching the (or rejected) result for the life of the process/Worker. */
export function getConfig(): Promise<Config> {
  if (configPromise === null) {
    configPromise = (async () => {
      const raw = {
        ADMIN_PASSWORD: await readEnv("ADMIN_PASSWORD", ""),
        JWT_SECRET: await readEnv(
          "JWT_SECRET",
          "your-secret-key-change-in-production",
        ),
        JWT_EXPIRY_HOURS: await readEnv("JWT_EXPIRY_HOURS", "24"),
        RESEND_API_KEY: await readEnv("RESEND_API_KEY", ""),
        CONTACT_TO_EMAIL: await readEnv(
          "CONTACT_TO_EMAIL",
          "ptchtrns@gmail.com",
        ),
        PHOTO_BASE_URL: await readEnv(
          "PHOTO_BASE_URL",
          IS_WORKERS ? "https://ptchtrns.com" : "",
        ),
      };

      const result = ConfigSchema.safeParse(raw);
      if (!result.success) {
        const issues = result.error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join("; ");
        throw new Error(`Invalid environment configuration: ${issues}`);
      }
      return result.data;
    })();
  }
  return configPromise;
}
