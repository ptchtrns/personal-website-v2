import { define } from "@/utils.ts";
import { deleteMedia } from "@/lib/media.ts";
import { createAdminDeleteHandler } from "@/lib/admin-handlers.ts";

export const handler = define.handlers({
  POST: createAdminDeleteHandler({
    tab: "media",
    entityName: "media",
    successMessage: "Media deleted",
    deleteFn: deleteMedia,
  }),
});
