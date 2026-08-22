import { page } from "fresh";
import { define } from "../utils.ts";
import { MainDisplay } from "@/components/layout/MainDisplay.tsx";
import MediaTabs from "@/islands/MediaTabs.tsx";
import { type GalleryItem, listGallery } from "@/lib/gallery.ts";

interface MediaData {
  gallery: GalleryItem[];
  error: string | null;
}

export const handler = define.handlers({
  async GET(): Promise<ReturnType<typeof page<MediaData>>> {
    try {
      return page({ gallery: await listGallery(), error: null });
    } catch (error) {
      console.error("Failed to load gallery", error);
      return page({ gallery: [], error: "Failed to load gallery" });
    }
  },
});

export default define.page<typeof handler>(function Media({ data }) {
  return (
    <MainDisplay>
      <div class="flex flex-col gap-8">
        <section class="flex flex-col gap-3">
          <h1 class="text-4xl font-bold dark:text-stone-100">Media</h1>
          <p class="text-lg leading-relaxed text-stone-700 dark:text-stone-300">
            Welcome to the repository of my photos and music.
          </p>
        </section>
        <MediaTabs gallery={data.gallery} error={data.error} />
      </div>
    </MainDisplay>
  );
});
