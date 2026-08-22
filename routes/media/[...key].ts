import { extname } from "@std/path";
import { contentType } from "@std/media-types";
import { define } from "@/utils.ts";
import { LOCAL_DEV } from "@/lib/config.ts";
import { getCdnBucket } from "@/lib/storage-local.ts";

export const handler = define.handlers({
  async GET(ctx) {
    if (!LOCAL_DEV) {
      return new Response("Not found", { status: 404 });
    }

    const key = ctx.params.key;
    if (!key) {
      return new Response("Bad request", { status: 400 });
    }

    const bucket = await getCdnBucket();
    const object = await bucket.get(`media/${key}`);
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
