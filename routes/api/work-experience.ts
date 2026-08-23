import { define } from "@/utils.ts";
import {
  createWorkExperience,
  listWorkExperience,
  parseWorkExperienceInput,
} from "@/lib/work-experience.ts";

export const handler = define.handlers({
  async GET(ctx) {
    if (!ctx.state.isAdmin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      return Response.json(await listWorkExperience());
    } catch (error) {
      console.error("Failed to list work experience", error);
      return Response.json({ error: "Failed to list work experience" }, {
        status: 500,
      });
    }
  },

  async POST(ctx) {
    if (!ctx.state.isAdmin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await ctx.req.json().catch(() => null);
    const parsed = parseWorkExperienceInput(data);
    if ("error" in parsed) {
      return Response.json({ error: parsed.error }, { status: 400 });
    }

    try {
      const created = await createWorkExperience(parsed.value);
      return Response.json(created, { status: 201 });
    } catch (error) {
      console.error("Failed to create work experience", error);
      return Response.json({ error: "Failed to create work experience" }, {
        status: 500,
      });
    }
  },
});
