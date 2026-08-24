import { define } from "@/utils.ts";
import { deleteProject } from "@/lib/projects.ts";
import { redirectTo } from "@/lib/http.ts";

export const handler = define.handlers({
  async POST(ctx) {
    if (!ctx.state.isAdmin) return ctx.redirect("/login");

    const id = Number(ctx.params.id);
    if (!Number.isInteger(id)) {
      return redirectTo(
        "/admin?tab=projects&error=" + encodeURIComponent("Invalid id"),
      );
    }

    try {
      await deleteProject(id);
      return redirectTo("/admin?tab=projects&ok=Project+deleted");
    } catch (error) {
      console.error("Failed to delete project", error);
      return redirectTo(
        "/admin?tab=projects&error=" +
          encodeURIComponent("Failed to delete project"),
      );
    }
  },
});
