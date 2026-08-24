import { define } from "@/utils.ts";
import { deleteMedia } from "@/lib/media.ts";
import { redirectTo } from "@/lib/http.ts";

export const handler = define.handlers({
  async POST(ctx) {
    if (!ctx.state.isAdmin) return ctx.redirect("/login");

    const id = Number(ctx.params.id);
    if (!Number.isInteger(id)) {
      return redirectTo(
        "/admin?tab=media&error=" + encodeURIComponent("Invalid id"),
      );
    }

    try {
      await deleteMedia(id);
      return redirectTo("/admin?tab=media&ok=Media+deleted");
    } catch (error) {
      console.error("Failed to delete media", error);
      return redirectTo(
        "/admin?tab=media&error=" +
          encodeURIComponent("Failed to delete media"),
      );
    }
  },
});
