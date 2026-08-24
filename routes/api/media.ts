import { define } from "@/utils.ts";
import {
  ALLOWED_CONTENT_TYPE_BY_TYPE,
  createMedia,
  MAX_BYTES_BY_TYPE,
  type MediaType,
} from "@/lib/media.ts";
import { redirectTo } from "@/lib/http.ts";

const MEDIA_TYPES: MediaType[] = ["image", "pdf", "audio", "link", "pfp"];

function isMediaType(value: unknown): value is MediaType {
  return typeof value === "string" &&
    (MEDIA_TYPES as string[]).includes(value);
}

function fail(message: string) {
  return redirectTo("/admin?tab=media&error=" + encodeURIComponent(message));
}

export const handler = define.handlers({
  async POST(ctx) {
    if (!ctx.state.isAdmin) return ctx.redirect("/login");

    const formData = await ctx.req.formData();
    const type = formData.get("type");
    if (!isMediaType(type)) return fail("Invalid or missing type");

    const altRaw = formData.get("alt");
    const alt = altRaw && String(altRaw).trim() ? String(altRaw).trim() : null;

    try {
      if (type === "link") {
        const src = String(formData.get("linkUrl") ?? "").trim();
        if (!src) return fail("Missing link URL");
        await createMedia({ type: "link", alt, src });
        return redirectTo("/admin?tab=media&ok=Link+added");
      }

      const file = formData.get("file");
      if (!(file instanceof File) || file.size === 0) {
        return fail("Please choose a file");
      }

      const expectedContentType = ALLOWED_CONTENT_TYPE_BY_TYPE[type];
      if (file.type !== expectedContentType) {
        return fail(
          `Only ${expectedContentType} files are allowed for "${type}"`,
        );
      }
      const maxBytes = MAX_BYTES_BY_TYPE[type];
      if (file.size > maxBytes) {
        return fail(
          `File must be under ${Math.floor(maxBytes / 1024 / 1024)}MB`,
        );
      }

      const bytes = new Uint8Array(await file.arrayBuffer());
      await createMedia({ type, alt, contentType: file.type, bytes });
      return redirectTo("/admin?tab=media&ok=File+uploaded");
    } catch (error) {
      console.error("Failed to create media", error);
      return fail("Failed to save media");
    }
  },
});
