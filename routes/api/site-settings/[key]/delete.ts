import { define } from "@/utils.ts";
import { deleteSiteSetting } from "@/lib/site-settings.ts";
import { redirectTo } from "@/lib/http.ts";

export const handler = define.handlers({
  async POST(ctx) {
    if (!ctx.state.isAdmin) return ctx.redirect("/login");

    try {
      await deleteSiteSetting(ctx.params.key);
      return redirectTo("/admin?tab=site-settings&ok=Setting+deleted");
    } catch (error) {
      console.error("Failed to delete site setting", error);
      return redirectTo(
        `/admin?tab=site-settings&error=${
          encodeURIComponent("Failed to delete setting")
        }`,
      );
    }
  },
});
