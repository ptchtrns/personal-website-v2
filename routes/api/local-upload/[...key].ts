import { define } from "@/utils.ts";
import { LOCAL_DEV } from "@/lib/config.ts";
import { getCdnBucket } from "@/lib/storage-local.ts";

export const handler = define.handlers({
  async PUT(ctx) {
    if (!LOCAL_DEV) {
      return new Response("Not found", { status: 404 });
    }
    if (!ctx.state.isAdmin) {
      return new Response("Unauthorized", { status: 401 });
    }

    const key = ctx.params.key;
    if (!key || !ctx.req.body) {
      return new Response("Bad request", { status: 400 });
    }

    // Mirrors the ContentType/ContentLength pinned into real presigned S3
    // URLs (see `lib/storage.ts`), since there's no signature here to
    // enforce it for us.
    const url = new URL(ctx.req.url);
    const expectedContentType = url.searchParams.get("contentType");
    const expectedSize = Number(url.searchParams.get("size"));
    const actualContentType = ctx.req.headers.get("content-type");
    if (
      !expectedContentType || !Number.isFinite(expectedSize) ||
      actualContentType !== expectedContentType
    ) {
      return new Response("Content-Type mismatch", { status: 400 });
    }

    // R2's `put` needs a stream of known length; buffer the body to get one.
    const body = await ctx.req.arrayBuffer();
    if (body.byteLength !== expectedSize) {
      return new Response("Content-Length mismatch", { status: 400 });
    }

    // Same bucket `routes/media/[...key].ts` serves from — production has
    // only one real bucket, so local dev shouldn't split reads and writes
    // across two.
    const bucket = await getCdnBucket();
    await bucket.put(key, body);

    return new Response(null, { status: 200 });
  },
});
