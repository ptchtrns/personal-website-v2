import { define } from "@/utils.ts";
import { markdownToHtml } from "@/lib/markdown.ts";

export const handler = define.handlers({
  async POST(ctx) {
    if (!ctx.state.isAdmin) return ctx.redirect("/login");

    const body = await ctx.req.json().catch(() => null);
    const markdown = typeof body?.markdown === "string" ? body.markdown : "";
    return Response.json({ html: markdownToHtml(markdown) ?? "" });
  },
});
