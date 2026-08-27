import { define } from "@/utils.ts";
import { parseEducationInput, updateEducation } from "@/lib/education.ts";
import { createAdminUpdateHandler } from "@/lib/admin-handlers.ts";

export const handler = define.handlers({
  POST: createAdminUpdateHandler({
    tab: "education",
    entityName: "education",
    successMessage: "Education updated",
    buildInput: (formData) => ({
      degreeTitle: formData.get("degreeTitle"),
      degreeType: formData.get("degreeType"),
      educationInstitution: formData.get("educationInstitution"),
      institutionLogoId: formData.get("institutionLogoId"),
      links: formData.get("links"),
      startedAt: formData.get("startedAt"),
      finishedAt: formData.get("finishedAt"),
      description: formData.get("description"),
    }),
    parseInput: parseEducationInput,
    updateFn: updateEducation,
  }),
});
