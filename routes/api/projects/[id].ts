import { define } from "@/utils.ts";
import { parseProjectInput, updateProject } from "@/lib/projects.ts";
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

    const formData = await ctx.req.formData();
    const parsed = parseProjectInput({
      name: formData.get("name"),
      description: formData.get("description"),
      changelog: formData.get("changelog"),
      shortOverview: formData.get("shortOverview"),
      externalUrl: formData.get("externalUrl"),
      links: formData.get("links"),
      isPinned: formData.get("isPinned") === "on",
      isActive: formData.get("isActive") === "on",
      technologyNames: formData.get("technologyNames"),
      mediaIds: formData.getAll("mediaIds"),
    });
    if ("error" in parsed) {
      return redirectTo(
        `/admin?tab=projects&edit=${id}&error=${
          encodeURIComponent(parsed.error)
        }`,
      );
    }

    try {
      const updated = await updateProject(id, parsed.value);
      if (!updated) {
        return redirectTo(
          "/admin?tab=projects&error=" + encodeURIComponent("Not found"),
        );
      }
      return redirectTo("/admin?tab=projects&ok=Project+updated");
    } catch (error) {
      console.error("Failed to update project", error);
      return redirectTo(
        `/admin?tab=projects&edit=${id}&error=` +
          encodeURIComponent("Failed to update project"),
      );
    }
  },
});
