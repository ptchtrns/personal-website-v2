import { define } from "@/utils.ts";
import { deleteGalleryItem } from "@/lib/gallery.ts";
import { createAdminDeleteHandler } from "@/lib/admin-handlers.ts";

export const handler = define.handlers({
  POST: createAdminDeleteHandler({
    tab: "gallery",
    entityName: "gallery item",
    successMessage: "Photo deleted",
    deleteFn: deleteGalleryItem,
  }),
});
