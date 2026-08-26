import { define } from "@/utils.ts";
import { parseReleaseInput, updateRelease } from "@/lib/releases.ts";
import { createAdminUpdateHandler } from "@/lib/admin-handlers.ts";

export const handler = define.handlers({
  POST: createAdminUpdateHandler({
    tab: "music",
    entityName: "release",
    successMessage: "Release updated",
    buildInput: (formData) => ({
      title: formData.get("title"),
      type: formData.get("type"),
      coverId: formData.get("coverId"),
      links: formData.get("links"),
    }),
    parseInput: parseReleaseInput,
    updateFn: updateRelease,
  }),
});
