import { define } from "@/utils.ts";
import { createPhoto, listPhotos } from "@/lib/photos.ts";

export const handler = define.handlers({
  async GET() {
    try {
      return Response.json(await listPhotos());
    } catch (error) {
      console.error("Failed to list photos", error);
      return Response.json({ error: "Failed to list photos" }, { status: 500 });
    }
  },

  async POST(ctx) {
    if (!ctx.state.isAdmin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await ctx.req.json().catch(() => null);
    if (data === null || typeof data !== "object") {
      return Response.json({ error: "Invalid request body" }, { status: 400 });
    }

    const body = data as Record<string, unknown>;
    const title = String(body.title ?? "").trim();
    if (!title) {
      return Response.json({ error: "Title is required" }, { status: 400 });
    }

    try {
      const created = await createPhoto({
        title,
        description: String(body.description ?? ""),
        aspect_ratio: String(body.aspect_ratio ?? ""),
      });

      return Response.json(created, { status: 201 });
    } catch (error) {
      return Response.json({ error: String(error) }, { status: 500 });
    }
  },
});
