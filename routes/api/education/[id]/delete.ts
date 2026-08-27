import { define } from "@/utils.ts";
import { deleteEducation } from "@/lib/education.ts";
import { createAdminDeleteHandler } from "@/lib/admin-handlers.ts";

export const handler = define.handlers({
  POST: createAdminDeleteHandler({
    tab: "education",
    entityName: "education",
    successMessage: "Education deleted",
    deleteFn: deleteEducation,
  }),
});
