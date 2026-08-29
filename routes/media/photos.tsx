import { page } from "fresh";
import { define } from "../../utils.ts";
import { MainDisplay } from "@/components/layout/MainDisplay.tsx";
import { MediaTabsNav } from "@/components/media/MediaTabsNav.tsx";
import PhotoGallery from "@/islands/PhotoGallery.tsx";
import { type GalleryItem, listGallery } from "@/lib/gallery.ts";

interface PhotosData {
  gallery: GalleryItem[];
  error: string | null;
}

export const handler = define.handlers({
  async GET(): Promise<ReturnType<typeof page<PhotosData>>> {
    try {
      const gallery = await listGallery();
      return page({ gallery, error: null });
    } catch (error) {
      console.error("Failed to load photos", error);
      return page({ gallery: [], error: "Failed to load photos" });
    }
  },
});

export default define.page<typeof handler>(function Photos({ data }) {
  return (
    <MainDisplay>
      <div class="flex flex-col gap-6">
        <section class="flex flex-col gap-3">
          <h1 class="text-4xl font-bold dark:text-zinc-100">Media</h1>
          <p class="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
            Welcome to the repository of my photos and music.
          </p>
        </section>
        <MediaTabsNav active="photos" />
        {data.error
          ? <div class="text-red-600">{data.error}</div>
          : data.gallery.length === 0
          ? (
            <div class="text-zinc-900 dark:text-zinc-100">
              No photos found
            </div>
          )
          : <PhotoGallery gallery={data.gallery} />}
      </div>
    </MainDisplay>
  );
});
