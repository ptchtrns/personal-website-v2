import { define } from "@/utils.ts";
import {
  createWorkExperience,
  parseWorkExperienceInput,
} from "@/lib/work-experience.ts";
import { redirectTo } from "@/lib/http.ts";

export const handler = define.handlers({
  async POST(ctx) {
    if (!ctx.state.isAdmin) return ctx.redirect("/login");

    const formData = await ctx.req.formData();
    const parsed = parseWorkExperienceInput({
      jobTitle: formData.get("jobTitle"),
      companyName: formData.get("companyName"),
      companyUrl: formData.get("companyUrl"),
      links: formData.get("links"),
      companyLogoId: formData.get("companyLogoId"),
      startedAt: formData.get("startedAt"),
      finishedAt: formData.get("finishedAt"),
      description: formData.get("description"),
    });
    if ("error" in parsed) {
      return redirectTo(
        `/admin?tab=work-experience&error=${encodeURIComponent(parsed.error)}`,
      );
    }

    try {
      await createWorkExperience(parsed.value);
      return redirectTo("/admin?tab=work-experience&ok=Work+experience+added");
    } catch (error) {
      console.error("Failed to create work experience", error);
      return redirectTo(
        "/admin?tab=work-experience&error=" +
          encodeURIComponent("Failed to create work experience"),
      );
    }
  },
});
