import { define } from "@/utils.ts";
import { deleteTrack } from "@/lib/releases.ts";
import { createAdminDeleteHandler } from "@/lib/admin-handlers.ts";

export const handler = define.handlers({
  POST: createAdminDeleteHandler({
    tab: "music",
    entityName: "track",
    successMessage: "Track deleted",
    deleteFn: deleteTrack,
  }),
});
