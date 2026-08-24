import { define } from "@/utils.ts";
import {
  createRelease,
  listReleases,
  parseReleaseInput,
} from "@/lib/releases.ts";

export const handler = define.handlers({
  async GET(ctx) {
    if (!ctx.state.isAdmin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      return Response.json(await listReleases());
    } catch (error) {
      console.error("Failed to list releases", error);
      return Response.json({ error: "Failed to list releases" }, {
        status: 500,
      });
    }
  },

  async POST(ctx) {
    if (!ctx.state.isAdmin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await ctx.req.json().catch(() => null);
    const parsed = parseReleaseInput(data);
    if ("error" in parsed) {
      return Response.json({ error: parsed.error }, { status: 400 });
    }

    try {
      const created = await createRelease(parsed.value);
      return Response.json(created, { status: 201 });
    } catch (error) {
      console.error("Failed to create release", error);
      return Response.json({ error: "Failed to create release" }, {
        status: 500,
      });
    }
  },
});
