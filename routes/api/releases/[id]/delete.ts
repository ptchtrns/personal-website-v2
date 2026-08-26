import { define } from "@/utils.ts";
import { deleteRelease } from "@/lib/releases.ts";
import { createAdminDeleteHandler } from "@/lib/admin-handlers.ts";

export const handler = define.handlers({
  POST: createAdminDeleteHandler({
    tab: "music",
    entityName: "release",
    successMessage: "Release deleted",
    deleteFn: deleteRelease,
  }),
});
