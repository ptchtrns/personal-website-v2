import { define } from "@/utils.ts";
import { createTrack, parseTrackInput } from "@/lib/releases.ts";
import { redirectTo } from "@/lib/http.ts";

export const handler = define.handlers({
  async POST(ctx) {
    if (!ctx.state.isAdmin) return ctx.redirect("/login");

    const formData = await ctx.req.formData();
    const parsed = parseTrackInput({
      title: formData.get("title"),
      audioId: formData.get("audioId"),
      releaseId: formData.get("releaseId"),
    });
    if ("error" in parsed) {
      return redirectTo(
        `/admin?tab=music&error=${encodeURIComponent(parsed.error)}`,
      );
    }

    try {
      await createTrack(parsed.value);
      return redirectTo("/admin?tab=music&ok=Track+added");
    } catch (error) {
      console.error("Failed to create track", error);
      return redirectTo(
        "/admin?tab=music&error=" +
          encodeURIComponent("Failed to create track"),
      );
    }
  },
});
