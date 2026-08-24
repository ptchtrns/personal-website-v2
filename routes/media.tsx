import { page } from "fresh";
import { define } from "../utils.ts";
import { MainDisplay } from "@/components/layout/MainDisplay.tsx";
import MediaTabs from "@/islands/MediaTabs.tsx";
import { type GalleryItem, listGallery } from "@/lib/gallery.ts";
import { listReleases, type ReleaseItem } from "@/lib/releases.ts";

interface MediaData {
  gallery: GalleryItem[];
  releases: ReleaseItem[];
  error: string | null;
}

export const handler = define.handlers({
  async GET(): Promise<ReturnType<typeof page<MediaData>>> {
    try {
      const [gallery, releases] = await Promise.all([
        listGallery(),
        listReleases(),
      ]);
      return page({ gallery, releases, error: null });
    } catch (error) {
      console.error("Failed to load media", error);
      return page({
        gallery: [],
        releases: [],
        error: "Failed to load media",
      });
    }
  },
});

export default define.page<typeof handler>(function Media({ data }) {
  return (
    <MainDisplay>
      <div class="flex flex-col gap-6">
        <section class="flex flex-col gap-3">
          <h1 class="text-4xl font-bold dark:text-stone-100">Media</h1>
          <p class="text-lg leading-relaxed text-stone-700 dark:text-stone-300">
            Welcome to the repository of my photos and music.
          </p>
        </section>
        <MediaTabs
          gallery={data.gallery}
          releases={data.releases}
          error={data.error}
        />
      </div>
    </MainDisplay>
  );
});
