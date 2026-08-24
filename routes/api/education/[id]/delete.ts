import { define } from "@/utils.ts";
import { deleteEducation } from "@/lib/education.ts";
import { redirectTo } from "@/lib/http.ts";

export const handler = define.handlers({
  async POST(ctx) {
    if (!ctx.state.isAdmin) return ctx.redirect("/login");

    const id = Number(ctx.params.id);
    if (!Number.isInteger(id)) {
      return redirectTo(
        "/admin?tab=education&error=" + encodeURIComponent("Invalid id"),
      );
    }

    try {
      await deleteEducation(id);
      return redirectTo("/admin?tab=education&ok=Education+deleted");
    } catch (error) {
      console.error("Failed to delete education", error);
      return redirectTo(
        "/admin?tab=education&error=" +
          encodeURIComponent("Failed to delete education"),
      );
    }
  },
});
