import { define } from "@/utils.ts";
import { deleteMedia, updateMediaAlt } from "@/lib/media.ts";

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
    if (data === null || typeof data !== "object") {
      return Response.json({ error: "Invalid request body" }, { status: 400 });
    }

    const body = data as Record<string, unknown>;
    const alt = body.alt ? String(body.alt).trim() : null;

    try {
      const updated = await updateMediaAlt(id, alt);
      if (!updated) {
        return Response.json({ error: "Not found" }, { status: 404 });
      }
      return Response.json(updated);
    } catch (error) {
      console.error("Failed to update media", error);
      return Response.json({ error: "Failed to update media" }, {
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
      await deleteMedia(id);
      return new Response(null, { status: 204 });
    } catch (error) {
      console.error("Failed to delete media", error);
      return Response.json({ error: "Failed to delete media" }, {
        status: 500,
      });
    }
  },
});
