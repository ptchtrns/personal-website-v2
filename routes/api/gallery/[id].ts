import { define } from "@/utils.ts";
import { parseGalleryInput, updateGalleryItem } from "@/lib/gallery.ts";
import { createAdminUpdateHandler } from "@/lib/admin-handlers.ts";

export const handler = define.handlers({
  POST: createAdminUpdateHandler({
    tab: "gallery",
    entityName: "gallery item",
    successMessage: "Photo updated",
    buildInput: (formData) => ({
      imageId: formData.get("imageId"),
      createdAt: formData.get("createdAt"),
    }),
    parseInput: parseGalleryInput,
    updateFn: updateGalleryItem,
  }),
});
