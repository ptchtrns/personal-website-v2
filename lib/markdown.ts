import { marked } from "marked";

marked.setOptions({ breaks: true });

/** Content is authored solely by the site admin through the admin form, so this intentionally skips HTML sanitization. */
export function markdownToHtml(markdown: string | null): string | null {
  if (!markdown) return null;
  return marked.parse(markdown, { async: false }) as string;
}
