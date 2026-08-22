import { define } from "@/utils.ts";
import { createGalleryItem, listGallery } from "@/lib/gallery.ts";

export const handler = define.handlers({
  async GET() {
    try {
      return Response.json(await listGallery());
    } catch (error) {
      console.error("Failed to list gallery", error);
      return Response.json({ error: "Failed to list gallery" }, {
        status: 500,
      });
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
    const description = String(body.description ?? "").trim();

    try {
      const created = await createGalleryItem({ description });
      return Response.json(created, { status: 201 });
    } catch (error) {
      return Response.json({ error: String(error) }, { status: 500 });
    }
  },
});
