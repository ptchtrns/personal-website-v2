import { define } from "@/utils.ts";
import { deleteGalleryItem } from "@/lib/gallery.ts";
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

    try {
      await deleteGalleryItem(id);
      return redirectTo("/admin?tab=gallery&ok=Photo+deleted");
    } catch (error) {
      console.error("Failed to delete gallery item", error);
      return redirectTo(
        "/admin?tab=gallery&error=" +
          encodeURIComponent("Failed to delete gallery item"),
      );
    }
  },
});
