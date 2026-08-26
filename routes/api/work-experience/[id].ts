import { define } from "@/utils.ts";
import {
  parseWorkExperienceInput,
  updateWorkExperience,
} from "@/lib/work-experience.ts";
import { createAdminUpdateHandler } from "@/lib/admin-handlers.ts";

export const handler = define.handlers({
  POST: createAdminUpdateHandler({
    tab: "work-experience",
    entityName: "work experience",
    successMessage: "Work experience updated",
    buildInput: (formData) => ({
      jobTitle: formData.get("jobTitle"),
      companyName: formData.get("companyName"),
      companyUrl: formData.get("companyUrl"),
      links: formData.get("links"),
      companyLogoId: formData.get("companyLogoId"),
      startedAt: formData.get("startedAt"),
      finishedAt: formData.get("finishedAt"),
      description: formData.get("description"),
    }),
    parseInput: parseWorkExperienceInput,
    updateFn: updateWorkExperience,
  }),
});
