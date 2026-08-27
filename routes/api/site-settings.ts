import { define } from "@/utils.ts";
import {
  createSiteSetting,
  parseSiteSettingInput,
} from "@/lib/site-settings.ts";
import { redirectTo } from "@/lib/http.ts";

export const handler = define.handlers({
  async POST(ctx) {
    if (!ctx.state.isAdmin) return ctx.redirect("/login");

    const formData = await ctx.req.formData();
    const parsed = parseSiteSettingInput({
      key: formData.get("key"),
      value: formData.get("value"),
    });
    if ("error" in parsed) {
      return redirectTo(
        `/admin?tab=site-settings&error=${encodeURIComponent(parsed.error)}`,
      );
    }

    try {
      await createSiteSetting(parsed.value);
      return redirectTo("/admin?tab=site-settings&ok=Setting+added");
    } catch (error) {
      console.error("Failed to create site setting", error);
      return redirectTo(
        "/admin?tab=site-settings&error=" +
          encodeURIComponent(
            "Failed to create setting (key may already exist)",
          ),
      );
    }
  },
});
