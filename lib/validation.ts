import { z } from "zod";

/** Coerces any FormData/JSON value to a trimmed string, treating null/undefined as "". */
export const trimmedString = z.preprocess(
  (v) => (v == null ? "" : String(v).trim()),
  z.string(),
);

export function requiredTrimmedString(message: string) {
  return z.preprocess(
    (v) => (v == null ? "" : String(v).trim()),
    z.string().min(1, message),
  );
}

/** Trims and collapses "" to null, matching the optional-text-field convention used across admin forms. */
export const nullableTrimmedString = z.preprocess(
  (v) => (v ? String(v).trim() : ""),
  z.string(),
).transform((s) => s || null);

/** Splits an array or newline-delimited string into trimmed non-empty lines, or null if none remain. */
export const multilineList = z.preprocess((v) => {
  if (Array.isArray(v)) return v.map((line) => String(line).trim());
  if (typeof v === "string") return v.split("\n").map((line) => line.trim());
  return [];
}, z.array(z.string())).transform((lines) => {
  const filtered = lines.filter(Boolean);
  return filtered.length > 0 ? filtered : null;
});

export const coercedBoolean = z.preprocess((v) => Boolean(v), z.boolean());

/** Query-string flag: true only when the param is exactly "1". */
export const queryFlag = z.preprocess((v) => v === "1", z.boolean());

export function requiredDate(message: string) {
  return z.preprocess(
    (v) => (typeof v === "string" ? new Date(v) : v),
    z.date({ invalid_type_error: message }),
  ).refine((d) => !isNaN(d.getTime()), message);
}

/** Empty/missing string becomes null; a non-empty string must parse to a valid date. */
export function optionalDate(message: string) {
  return z.preprocess((v) => {
    if (typeof v !== "string" || !v.trim()) return null;
    return new Date(v);
  }, z.date().nullable()).refine(
    (d) => d === null || !isNaN(d.getTime()),
    message,
  );
}

export function requiredIntId(message: string) {
  return z.preprocess((v) => Number(v), z.number()).refine(
    (n) => Number.isInteger(n),
    message,
  );
}

/** Missing/empty value becomes null; a present value must be an integer. */
export function optionalIntId(message: string) {
  return z.preprocess((v) => {
    if (v === null || v === undefined || v === "") return null;
    return Number(v);
  }, z.number().nullable()).refine(
    (n) => n === null || Number.isInteger(n),
    message,
  );
}

export const intIdArray = z.preprocess((v) => {
  if (!Array.isArray(v)) return [];
  return v.map((n) => Number(n)).filter((n) => Number.isInteger(n));
}, z.array(z.number().int()));

export const stringArray = z.preprocess((v) => {
  if (Array.isArray(v)) return v.map((n) => String(n));
  if (typeof v === "string") {
    return v.split(",").map((n) => n.trim()).filter(Boolean);
  }
  return [];
}, z.array(z.string()));

/** Runs a zod schema against a plain object, mapping the first issue (if any) to the project's { value } | { error } convention. */
export function parseWithSchema<S extends z.ZodTypeAny>(
  schema: S,
  data: unknown,
): { value: z.infer<S> } | { error: string } {
  if (data === null || typeof data !== "object") {
    return { error: "Invalid request body" };
  }
  const result = schema.safeParse(data);
  if (!result.success) {
    return { error: result.error.issues[0]?.message ?? "Invalid request body" };
  }
  return { value: result.data };
}
