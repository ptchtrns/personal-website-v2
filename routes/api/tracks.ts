import { define } from "@/utils.ts";
import { createTrack, parseTrackInput } from "@/lib/releases.ts";

export const handler = define.handlers({
  async POST(ctx) {
    if (!ctx.state.isAdmin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await ctx.req.json().catch(() => null);
    const parsed = parseTrackInput(data);
    if ("error" in parsed) {
      return Response.json({ error: parsed.error }, { status: 400 });
    }

    try {
      const created = await createTrack(parsed.value);
      return Response.json(created, { status: 201 });
    } catch (error) {
      console.error("Failed to create track", error);
      return Response.json({ error: "Failed to create track" }, {
        status: 500,
      });
    }
  },
});
