import { extname } from "@std/path";
import { contentType } from "@std/media-types";
import { define } from "@/utils.ts";
import { getObject } from "@/lib/storage.ts";
import { IS_WORKERS } from "@/lib/config.ts";

export const handler = define.handlers({
  async GET(ctx) {
    // Prod serves media straight off the R2 custom domain (see
    // `PHOTO_BASE_URL`); this route only exists so local dev, which has no
    // such domain, can serve the same `/media/...` keys off the Worker.
    if (IS_WORKERS) {
      return new Response("Not found", { status: 404 });
    }

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
    const headers = {
      "content-type": type,
      "accept-ranges": "bytes",
      // Keys are per-upload UUIDs, so a given URL's bytes never change.
      "cache-control": "public, max-age=31536000, immutable",
    };

    const buffer = await object.arrayBuffer();

    // Browsers (Chrome in particular) need Range support to seek near the
    // end of VBR audio and compute a correct duration; without it they fall
    // back to a rough, often wrong, estimate.
    const range = ctx.req.headers.get("range");
    const match = range?.match(/^bytes=(\d*)-(\d*)$/);
    if (!match) {
      return new Response(buffer, { headers });
    }

    const size = buffer.byteLength;
    const start = match[1] ? Number(match[1]) : 0;
    const end = match[2] ? Number(match[2]) : size - 1;
    if (
      Number.isNaN(start) || Number.isNaN(end) || start > end || start >= size
    ) {
      return new Response("Range not satisfiable", {
        status: 416,
        headers: { ...headers, "content-range": `bytes */${size}` },
      });
    }

    const slice = buffer.slice(start, Math.min(end, size - 1) + 1);
    return new Response(slice, {
      status: 206,
      headers: {
        ...headers,
        "content-range": `bytes ${start}-${
          start + slice.byteLength - 1
        }/${size}`,
      },
    });
  },
});
