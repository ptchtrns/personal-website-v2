import { define } from "@/utils.ts";
import {
  parseWorkExperienceInput,
  updateWorkExperience,
} from "@/lib/work-experience.ts";
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

    const formData = await ctx.req.formData();
    const parsed = parseWorkExperienceInput({
      jobTitle: formData.get("jobTitle"),
      companyName: formData.get("companyName"),
      companyUrl: formData.get("companyUrl"),
      companyLogoSrc: formData.get("companyLogoSrc"),
      startedAt: formData.get("startedAt"),
      finishedAt: formData.get("finishedAt"),
      description: formData.get("description"),
    });
    if ("error" in parsed) {
      return redirectTo(
        `/admin?tab=work-experience&edit=${id}&error=${
          encodeURIComponent(parsed.error)
        }`,
      );
    }

    try {
      const updated = await updateWorkExperience(id, parsed.value);
      if (!updated) {
        return redirectTo(
          "/admin?tab=work-experience&error=" + encodeURIComponent("Not found"),
        );
      }
      return redirectTo(
        "/admin?tab=work-experience&ok=Work+experience+updated",
      );
    } catch (error) {
      console.error("Failed to update work experience", error);
      return redirectTo(
        `/admin?tab=work-experience&edit=${id}&error=` +
          encodeURIComponent("Failed to update work experience"),
      );
    }
  },
});
