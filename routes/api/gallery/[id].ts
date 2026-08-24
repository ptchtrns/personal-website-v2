import { define } from "@/utils.ts";
import { parseGalleryInput, updateGalleryItem } from "@/lib/gallery.ts";
import { redirectTo } from "@/lib/http.ts";

export const handler = define.handlers({
  async POST(ctx) {
    if (!ctx.state.isAdmin) return ctx.redirect("/login");

    const id = Number(ctx.params.id);
    if (!Number.isInteger(id)) {
      return redirectTo(
        "/admin?tab=gallery&error=" + encodeURIComponent("Invalid id"),
      );
    }

    const formData = await ctx.req.formData();
    const parsed = parseGalleryInput({
      description: formData.get("description"),
      imageId: formData.get("imageId"),
    });
    if ("error" in parsed) {
      return redirectTo(
        `/admin?tab=gallery&edit=${id}&error=${
          encodeURIComponent(parsed.error)
        }`,
      );
    }

    try {
      const updated = await updateGalleryItem(id, parsed.value);
      if (!updated) {
        return redirectTo(
          "/admin?tab=gallery&error=" + encodeURIComponent("Not found"),
        );
      }
      return redirectTo("/admin?tab=gallery&ok=Photo+updated");
    } catch (error) {
      console.error("Failed to update gallery item", error);
      return redirectTo(
        `/admin?tab=gallery&edit=${id}&error=` +
          encodeURIComponent("Failed to update gallery item"),
      );
    }
  },
});
