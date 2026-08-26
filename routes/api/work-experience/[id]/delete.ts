import { define } from "@/utils.ts";
import { deleteWorkExperience } from "@/lib/work-experience.ts";
import { createAdminDeleteHandler } from "@/lib/admin-handlers.ts";

export const handler = define.handlers({
  POST: createAdminDeleteHandler({
    tab: "work-experience",
    entityName: "work experience",
    successMessage: "Work experience deleted",
    deleteFn: deleteWorkExperience,
  }),
});
