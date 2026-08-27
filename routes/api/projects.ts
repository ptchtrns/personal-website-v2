import { define } from "@/utils.ts";
import { createProject, parseProjectInput } from "@/lib/projects.ts";
import { redirectTo } from "@/lib/http.ts";

export const handler = define.handlers({
  async POST(ctx) {
    if (!ctx.state.isAdmin) return ctx.redirect("/login");

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
        `/admin?tab=projects&error=${encodeURIComponent(parsed.error)}`,
      );
    }

    try {
      await createProject(parsed.value);
      return redirectTo("/admin?tab=projects&ok=Project+added");
    } catch (error) {
      console.error("Failed to create project", error);
      return redirectTo(
        "/admin?tab=projects&error=" +
          encodeURIComponent("Failed to create project"),
      );
    }
  },
});
