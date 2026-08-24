import { define } from "@/utils.ts";
import {
  ALLOWED_CONTENT_TYPE_BY_TYPE,
  createMedia,
  listMedia,
  MAX_BYTES_BY_TYPE,
  type MediaType,
} from "@/lib/media.ts";

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
        const contentType = String(body.contentType ?? "").trim();
        const size = Number(body.size);
        const expectedContentType = ALLOWED_CONTENT_TYPE_BY_TYPE[body.type];
        if (contentType !== expectedContentType) {
          return Response.json({
            error:
              `Only ${expectedContentType} files are allowed for "${body.type}"`,
          }, { status: 400 });
        }
        const maxBytes = MAX_BYTES_BY_TYPE[body.type];
        if (!Number.isFinite(size) || size <= 0 || size > maxBytes) {
          return Response.json({
            error: `File must be under ${Math.floor(maxBytes / 1024 / 1024)}MB`,
          }, { status: 400 });
        }
        created = await createMedia({
          type: body.type,
          alt,
          contentType,
          size,
        });
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
