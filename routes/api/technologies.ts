import { define } from "@/utils.ts";
import { listTechnologies } from "@/lib/technologies.ts";

export const handler = define.handlers({
  async GET(ctx) {
    if (!ctx.state.isAdmin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      return Response.json(await listTechnologies());
    } catch (error) {
      console.error("Failed to list technologies", error);
      return Response.json({ error: "Failed to list technologies" }, {
        status: 500,
      });
    }
  },
});
