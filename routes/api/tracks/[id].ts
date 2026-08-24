import { define } from "@/utils.ts";
import { parseTrackInput, updateTrack } from "@/lib/releases.ts";
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
    const parsed = parseTrackInput({
      title: formData.get("title"),
      audioId: formData.get("audioId"),
      releaseId: formData.get("releaseId"),
    });
    if ("error" in parsed) {
      return redirectTo(
        `/admin?tab=music&trackEdit=${id}&error=${
          encodeURIComponent(parsed.error)
        }`,
      );
    }

    try {
      const updated = await updateTrack(id, parsed.value);
      if (!updated) {
        return redirectTo(
          "/admin?tab=music&error=" + encodeURIComponent("Not found"),
        );
      }
      return redirectTo("/admin?tab=music&ok=Track+updated");
    } catch (error) {
      console.error("Failed to update track", error);
      return redirectTo(
        `/admin?tab=music&trackEdit=${id}&error=` +
          encodeURIComponent("Failed to update track"),
      );
    }
  },
});
