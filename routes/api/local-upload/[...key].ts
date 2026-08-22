import { define } from "@/utils.ts";
import { LOCAL_DEV } from "@/lib/config.ts";
import { getUploadsBucket } from "@/lib/storage-local.ts";

export const handler = define.handlers({
  async PUT(ctx) {
    if (!LOCAL_DEV) {
      return new Response("Not found", { status: 404 });
    }

    const key = ctx.params.key;
    if (!key || !ctx.req.body) {
      return new Response("Bad request", { status: 400 });
    }

    // R2's `put` needs a stream of known length; buffer the body to get one.
    const body = await ctx.req.arrayBuffer();

    const bucket = await getUploadsBucket();
    await bucket.put(key, body);

    return new Response(null, { status: 200 });
  },
});
