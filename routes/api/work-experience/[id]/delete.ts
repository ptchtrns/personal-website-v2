import { define } from "@/utils.ts";
import { deleteWorkExperience } from "@/lib/work-experience.ts";
import { redirectTo } from "@/lib/http.ts";

export const handler = define.handlers({
  async POST(ctx) {
    if (!ctx.state.isAdmin) return ctx.redirect("/login");

    const id = Number(ctx.params.id);
    if (!Number.isInteger(id)) {
      return redirectTo(
        "/admin?tab=work-experience&error=" + encodeURIComponent("Invalid id"),
      );
    }

    try {
      await deleteWorkExperience(id);
      return redirectTo(
        "/admin?tab=work-experience&ok=Work+experience+deleted",
      );
    } catch (error) {
      console.error("Failed to delete work experience", error);
      return redirectTo(
        "/admin?tab=work-experience&error=" +
          encodeURIComponent("Failed to delete work experience"),
      );
    }
  },
});
