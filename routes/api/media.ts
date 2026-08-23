import { define } from "@/utils.ts";
import { createMedia, listMedia, type MediaType } from "@/lib/media.ts";

const MEDIA_TYPES: MediaType[] = ["image", "pdf", "audio", "link", "pfp"];

function isMediaType(value: unknown): value is MediaType {
  return typeof value === "string" &&
    (MEDIA_TYPES as string[]).includes(value);
}

export const handler = define.handlers({
  async GET(ctx) {
    if (!ctx.state.isAdmin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const typeParam = new URL(ctx.req.url).searchParams.get("type");
    if (typeParam !== null && !isMediaType(typeParam)) {
      return Response.json({ error: "Invalid type" }, { status: 400 });
    }

    try {
      return Response.json(await listMedia(typeParam ?? undefined));
    } catch (error) {
      console.error("Failed to list media", error);
      return Response.json({ error: "Failed to list media" }, {
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
    if (!isMediaType(body.type)) {
      return Response.json({ error: "Invalid or missing type" }, {
        status: 400,
      });
    }
    const alt = body.alt ? String(body.alt).trim() : null;

    try {
      let created;
      if (body.type === "link") {
        const src = String(body.src ?? "").trim();
        if (!src) {
          return Response.json({ error: "Missing link URL" }, {
            status: 400,
          });
        }
        created = await createMedia({ type: "link", alt, src });
      } else {
        const filename = String(body.filename ?? "").trim();
        if (!filename) {
          return Response.json({ error: "Missing filename" }, {
            status: 400,
          });
        }
        created = await createMedia({ type: body.type, alt, filename });
      }
      return Response.json(created, { status: 201 });
    } catch (error) {
      console.error("Failed to create media", error);
      return Response.json({ error: "Failed to create media" }, {
        status: 500,
      });
    }
  },
});
