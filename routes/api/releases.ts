import { define } from "@/utils.ts";
import { createRelease, parseReleaseInput } from "@/lib/releases.ts";
import { redirectTo } from "@/lib/http.ts";

export const handler = define.handlers({
  async POST(ctx) {
    if (!ctx.state.isAdmin) return ctx.redirect("/login");

    const formData = await ctx.req.formData();
    const parsed = parseReleaseInput({
      title: formData.get("title"),
      type: formData.get("type"),
      coverId: formData.get("coverId"),
    });
    if ("error" in parsed) {
      return redirectTo(
        `/admin?tab=music&error=${encodeURIComponent(parsed.error)}`,
      );
    }

    try {
      await createRelease(parsed.value);
      return redirectTo("/admin?tab=music&ok=Release+added");
    } catch (error) {
      console.error("Failed to create release", error);
      return redirectTo(
        "/admin?tab=music&error=" +
          encodeURIComponent("Failed to create release"),
      );
    }
  },
});
