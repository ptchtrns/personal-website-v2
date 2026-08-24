import { define } from "@/utils.ts";
import { parseReleaseInput, updateRelease } from "@/lib/releases.ts";
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

    const formData = await ctx.req.formData();
    const parsed = parseReleaseInput({
      title: formData.get("title"),
      type: formData.get("type"),
      coverId: formData.get("coverId"),
    });
    if ("error" in parsed) {
      return redirectTo(
        `/admin?tab=music&edit=${id}&error=${encodeURIComponent(parsed.error)}`,
      );
    }

    try {
      const updated = await updateRelease(id, parsed.value);
      if (!updated) {
        return redirectTo(
          "/admin?tab=music&error=" + encodeURIComponent("Not found"),
        );
      }
      return redirectTo("/admin?tab=music&ok=Release+updated");
    } catch (error) {
      console.error("Failed to update release", error);
      return redirectTo(
        `/admin?tab=music&edit=${id}&error=` +
          encodeURIComponent("Failed to update release"),
      );
    }
  },
});
