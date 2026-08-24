import { define } from "@/utils.ts";
import { parseEducationInput, updateEducation } from "@/lib/education.ts";
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

    const formData = await ctx.req.formData();
    const parsed = parseEducationInput({
      degreeTitle: formData.get("degreeTitle"),
      degreeType: formData.get("degreeType"),
      educationInstitution: formData.get("educationInstitution"),
      institutionLogoSrc: formData.get("institutionLogoSrc"),
      startedAt: formData.get("startedAt"),
      finishedAt: formData.get("finishedAt"),
      description: formData.get("description"),
    });
    if ("error" in parsed) {
      return redirectTo(
        `/admin?tab=education&edit=${id}&error=${
          encodeURIComponent(parsed.error)
        }`,
      );
    }

    try {
      const updated = await updateEducation(id, parsed.value);
      if (!updated) {
        return redirectTo(
          "/admin?tab=education&error=" + encodeURIComponent("Not found"),
        );
      }
      return redirectTo("/admin?tab=education&ok=Education+updated");
    } catch (error) {
      console.error("Failed to update education", error);
      return redirectTo(
        `/admin?tab=education&edit=${id}&error=` +
          encodeURIComponent("Failed to update education"),
      );
    }
  },
});
