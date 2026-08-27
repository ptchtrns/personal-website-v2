import { define } from "@/utils.ts";
import { createGalleryItem, parseGalleryInput } from "@/lib/gallery.ts";
import { redirectTo } from "@/lib/http.ts";

export const handler = define.handlers({
  async POST(ctx) {
    if (!ctx.state.isAdmin) return ctx.redirect("/login");

    const formData = await ctx.req.formData();
    const parsed = parseGalleryInput({
      imageId: formData.get("imageId"),
    });
    if ("error" in parsed) {
      return redirectTo(
        `/admin?tab=gallery&error=${encodeURIComponent(parsed.error)}`,
      );
    }

    try {
      await createGalleryItem(parsed.value);
      return redirectTo("/admin?tab=gallery&ok=Photo+added");
    } catch (error) {
      console.error("Failed to create gallery item", error);
      return redirectTo(
        "/admin?tab=gallery&error=" +
          encodeURIComponent("Failed to create gallery item"),
      );
    }
  },
});
