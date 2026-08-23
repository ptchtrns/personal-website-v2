import { define } from "@/utils.ts";
import {
  deleteWorkExperience,
  parseWorkExperienceInput,
  updateWorkExperience,
} from "@/lib/work-experience.ts";

export const handler = define.handlers({
  async PUT(ctx) {
    if (!ctx.state.isAdmin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = Number(ctx.params.id);
    if (!Number.isInteger(id)) {
      return Response.json({ error: "Invalid id" }, { status: 400 });
    }

    const data = await ctx.req.json().catch(() => null);
    const parsed = parseWorkExperienceInput(data);
    if ("error" in parsed) {
      return Response.json({ error: parsed.error }, { status: 400 });
    }

    try {
      const updated = await updateWorkExperience(id, parsed.value);
      if (!updated) {
        return Response.json({ error: "Not found" }, { status: 404 });
      }
      return Response.json(updated);
    } catch (error) {
      console.error("Failed to update work experience", error);
      return Response.json({ error: "Failed to update work experience" }, {
        status: 500,
      });
    }
  },

  async DELETE(ctx) {
    if (!ctx.state.isAdmin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = Number(ctx.params.id);
    if (!Number.isInteger(id)) {
      return Response.json({ error: "Invalid id" }, { status: 400 });
    }

    try {
      await deleteWorkExperience(id);
      return new Response(null, { status: 204 });
    } catch (error) {
      console.error("Failed to delete work experience", error);
      return Response.json({ error: "Failed to delete work experience" }, {
        status: 500,
      });
    }
  },
});
