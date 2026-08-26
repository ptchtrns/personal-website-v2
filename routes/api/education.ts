import { define } from "@/utils.ts";
import { createEducation, parseEducationInput } from "@/lib/education.ts";
import { redirectTo } from "@/lib/http.ts";

export const handler = define.handlers({
  async POST(ctx) {
    if (!ctx.state.isAdmin) return ctx.redirect("/login");

    const formData = await ctx.req.formData();
    const parsed = parseEducationInput({
      degreeTitle: formData.get("degreeTitle"),
      degreeType: formData.get("degreeType"),
      educationInstitution: formData.get("educationInstitution"),
      institutionLogoId: formData.get("institutionLogoId"),
      links: formData.get("links"),
      startedAt: formData.get("startedAt"),
      finishedAt: formData.get("finishedAt"),
      description: formData.get("description"),
    });
    if ("error" in parsed) {
      return redirectTo(
        `/admin?tab=education&error=${encodeURIComponent(parsed.error)}`,
      );
    }

    try {
      await createEducation(parsed.value);
      return redirectTo("/admin?tab=education&ok=Education+added");
    } catch (error) {
      console.error("Failed to create education", error);
      return redirectTo(
        "/admin?tab=education&error=" +
          encodeURIComponent("Failed to create education"),
      );
    }
  },
});
