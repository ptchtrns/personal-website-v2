import { define } from "@/utils.ts";
import { parseProjectInput, updateProject } from "@/lib/projects.ts";
import { createAdminUpdateHandler } from "@/lib/admin-handlers.ts";

export const handler = define.handlers({
  POST: createAdminUpdateHandler({
    tab: "projects",
    entityName: "project",
    successMessage: "Project updated",
    buildInput: (formData) => ({
      name: formData.get("name"),
      description: formData.get("description"),
      changelog: formData.get("changelog"),
      shortOverview: formData.get("shortOverview"),
      externalUrl: formData.get("externalUrl"),
      links: formData.get("links"),
      isPinned: formData.get("isPinned") === "on",
      isActive: formData.get("isActive") === "on",
      technologyNames: formData.get("technologyNames"),
      mediaIds: formData.getAll("mediaIds"),
    }),
    parseInput: parseProjectInput,
    updateFn: updateProject,
  }),
});
