import { define } from "@/utils.ts";
import {
  parseSiteSettingValue,
  updateSiteSetting,
} from "@/lib/site-settings.ts";
import { redirectTo } from "@/lib/http.ts";

export const handler = define.handlers({
  async POST(ctx) {
    if (!ctx.state.isAdmin) return ctx.redirect("/login");

    const key = ctx.params.key;
    const formData = await ctx.req.formData();
    const parsed = parseSiteSettingValue({ value: formData.get("value") });
    if ("error" in parsed) {
      return redirectTo(
        `/admin?tab=site-settings&settingsEdit=${
          encodeURIComponent(key)
        }&error=${encodeURIComponent(parsed.error)}`,
      );
    }

    try {
      const updated = await updateSiteSetting(key, parsed.value);
      if (!updated) {
        return redirectTo(
          `/admin?tab=site-settings&error=${encodeURIComponent("Not found")}`,
        );
      }
      return redirectTo("/admin?tab=site-settings&ok=Setting+updated");
    } catch (error) {
      console.error("Failed to update site setting", error);
      return redirectTo(
        `/admin?tab=site-settings&settingsEdit=${
          encodeURIComponent(key)
        }&error=${encodeURIComponent("Failed to update setting")}`,
      );
    }
  },
});
