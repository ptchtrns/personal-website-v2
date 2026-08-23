import { define } from "@/utils.ts";
import {
  createEducation,
  listEducation,
  parseEducationInput,
} from "@/lib/education.ts";

export const handler = define.handlers({
  async GET(ctx) {
    if (!ctx.state.isAdmin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      return Response.json(await listEducation());
    } catch (error) {
      console.error("Failed to list education", error);
      return Response.json({ error: "Failed to list education" }, {
        status: 500,
      });
    }
  },

  async POST(ctx) {
    if (!ctx.state.isAdmin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await ctx.req.json().catch(() => null);
    const parsed = parseEducationInput(data);
    if ("error" in parsed) {
      return Response.json({ error: parsed.error }, { status: 400 });
    }

    try {
      const created = await createEducation(parsed.value);
      return Response.json(created, { status: 201 });
    } catch (error) {
      console.error("Failed to create education", error);
      return Response.json({ error: "Failed to create education" }, {
        status: 500,
      });
    }
  },
});
