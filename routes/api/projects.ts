import { define } from "@/utils.ts";
import {
  createProject,
  listAllProjects,
  parseProjectInput,
} from "@/lib/projects.ts";

export const handler = define.handlers({
  async GET(ctx) {
    if (!ctx.state.isAdmin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      return Response.json(await listAllProjects());
    } catch (error) {
      console.error("Failed to list projects", error);
      return Response.json({ error: "Failed to list projects" }, {
        status: 500,
      });
    }
  },

  async POST(ctx) {
    if (!ctx.state.isAdmin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await ctx.req.json().catch(() => null);
    const parsed = parseProjectInput(data);
    if ("error" in parsed) {
      return Response.json({ error: parsed.error }, { status: 400 });
    }

    try {
      const created = await createProject(parsed.value);
      return Response.json(created, { status: 201 });
    } catch (error) {
      console.error("Failed to create project", error);
      return Response.json({ error: "Failed to create project" }, {
        status: 500,
      });
    }
  },
});
