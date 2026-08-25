import { extname } from "@std/path";
import { contentType } from "@std/media-types";
import { define } from "@/utils.ts";
import { getObject } from "@/lib/storage.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const key = ctx.params.key;
    if (!key) {
      return new Response("Bad request", { status: 400 });
    }

    const object = await getObject(`media/${key}`);
    if (!object) {
      return new Response("Not found", { status: 404 });
    }

    const type = object.httpMetadata?.contentType ??
      contentType(extname(key)) ?? "application/octet-stream";

    return new Response(await object.arrayBuffer(), {
      headers: {
        "content-type": type,
        // Keys are per-upload UUIDs, so a given URL's bytes never change.
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  },
});
