import { define } from "@/utils.ts";
import { createMusic, listMusic, parseMusicInput } from "@/lib/music.ts";

export const handler = define.handlers({
  async GET(ctx) {
    if (!ctx.state.isAdmin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      return Response.json(await listMusic());
    } catch (error) {
      console.error("Failed to list music", error);
      return Response.json({ error: "Failed to list music" }, {
        status: 500,
      });
    }
  },

  async POST(ctx) {
    if (!ctx.state.isAdmin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await ctx.req.json().catch(() => null);
    const parsed = parseMusicInput(data);
    if ("error" in parsed) {
      return Response.json({ error: parsed.error }, { status: 400 });
    }

    try {
      const created = await createMusic(parsed.value);
      return Response.json(created, { status: 201 });
    } catch (error) {
      console.error("Failed to create music item", error);
      return Response.json({ error: "Failed to create music item" }, {
        status: 500,
      });
    }
  },
});
