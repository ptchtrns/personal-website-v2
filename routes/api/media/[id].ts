import { define } from "@/utils.ts";
import { updateMediaAlt } from "@/lib/media.ts";
import { redirectTo } from "@/lib/http.ts";

export const handler = define.handlers({
  async POST(ctx) {
    if (!ctx.state.isAdmin) return ctx.redirect("/login");

    const id = Number(ctx.params.id);
    if (!Number.isInteger(id)) {
      return redirectTo(
        "/admin?tab=media&error=" + encodeURIComponent("Invalid id"),
      );
    }

    const formData = await ctx.req.formData();
    const altRaw = formData.get("alt");
    const alt = altRaw && String(altRaw).trim() ? String(altRaw).trim() : null;

    try {
      const updated = await updateMediaAlt(id, alt);
      if (!updated) {
        return redirectTo(
          "/admin?tab=media&error=" + encodeURIComponent("Not found"),
        );
      }
      return redirectTo("/admin?tab=media&ok=Alt+text+saved");
    } catch (error) {
      console.error("Failed to update media", error);
      return redirectTo(
        "/admin?tab=media&error=" +
          encodeURIComponent("Failed to update media"),
      );
    }
  },
});
