import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formats a Date (or ISO date string) as `yyyy-mm-dd` for `<input type="date">`. */
export function toDateInputValue(value: Date | string | null): string {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

/** Resolves the admin form's `?edit=<id>` query param to the matching item, or null. */
export function findById<T extends { id: number }>(
  items: T[],
  id: number | null,
): T | null {
  return id !== null ? items.find((item) => item.id === id) ?? null : null;
}
