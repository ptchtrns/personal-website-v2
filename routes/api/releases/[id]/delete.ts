import { define } from "@/utils.ts";
import { deleteRelease } from "@/lib/releases.ts";
import { redirectTo } from "@/lib/http.ts";

export const handler = define.handlers({
  async POST(ctx) {
    if (!ctx.state.isAdmin) return ctx.redirect("/login");

    const id = Number(ctx.params.id);
    if (!Number.isInteger(id)) {
      return redirectTo(
        "/admin?tab=music&error=" + encodeURIComponent("Invalid id"),
      );
    }

    try {
      await deleteRelease(id);
      return redirectTo("/admin?tab=music&ok=Release+deleted");
    } catch (error) {
      console.error("Failed to delete release", error);
      return redirectTo(
        "/admin?tab=music&error=" +
          encodeURIComponent("Failed to delete release"),
      );
    }
  },
});
