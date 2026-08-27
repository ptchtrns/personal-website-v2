import { define } from "@/utils.ts";
import { parseTrackInput, updateTrack } from "@/lib/releases.ts";
import { createAdminUpdateHandler } from "@/lib/admin-handlers.ts";

export const handler = define.handlers({
  POST: createAdminUpdateHandler({
    tab: "music",
    editParam: "trackEdit",
    entityName: "track",
    successMessage: "Track updated",
    buildInput: (formData) => ({
      title: formData.get("title"),
      audioId: formData.get("audioId"),
      releaseId: formData.get("releaseId"),
    }),
    parseInput: parseTrackInput,
    updateFn: updateTrack,
  }),
});
