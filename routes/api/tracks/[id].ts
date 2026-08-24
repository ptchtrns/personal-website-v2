import { define } from "@/utils.ts";
import { deleteTrack, parseTrackInput, updateTrack } from "@/lib/releases.ts";

export const handler = define.handlers({
  async PUT(ctx) {
    if (!ctx.state.isAdmin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = Number(ctx.params.id);
    if (!Number.isInteger(id)) {
      return Response.json({ error: "Invalid id" }, { status: 400 });
    }

    const data = await ctx.req.json().catch(() => null);
    const parsed = parseTrackInput(data);
    if ("error" in parsed) {
      return Response.json({ error: parsed.error }, { status: 400 });
    }

    try {
      const updated = await updateTrack(id, parsed.value);
      if (!updated) {
        return Response.json({ error: "Not found" }, { status: 404 });
      }
      return Response.json(updated);
    } catch (error) {
      console.error("Failed to update track", error);
      return Response.json({ error: "Failed to update track" }, {
        status: 500,
      });
    }
  },

  async DELETE(ctx) {
    if (!ctx.state.isAdmin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = Number(ctx.params.id);
    if (!Number.isInteger(id)) {
      return Response.json({ error: "Invalid id" }, { status: 400 });
    }

    try {
      await deleteTrack(id);
      return new Response(null, { status: 204 });
    } catch (error) {
      console.error("Failed to delete track", error);
      return Response.json({ error: "Failed to delete track" }, {
        status: 500,
      });
    }
  },
});
