import { define } from "@/utils.ts";
import { deleteProject } from "@/lib/projects.ts";
import { createAdminDeleteHandler } from "@/lib/admin-handlers.ts";

export const handler = define.handlers({
  POST: createAdminDeleteHandler({
    tab: "projects",
    entityName: "project",
    successMessage: "Project deleted",
    deleteFn: deleteProject,
  }),
});
