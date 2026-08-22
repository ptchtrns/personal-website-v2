import { page } from "fresh";
import { define } from "../utils.ts";
import { MainDisplay } from "@/components/layout/MainDisplay.tsx";
import MediaTabs from "@/islands/MediaTabs.tsx";
import { listPhotos, type Photo } from "@/lib/photos.ts";

interface MediaData {
  photos: Photo[];
  error: string | null;
}

export const handler = define.handlers({
  async GET(): Promise<ReturnType<typeof page<MediaData>>> {
    try {
      return page({ photos: await listPhotos(), error: null });
    } catch (error) {
      console.error("Failed to load photos", error);
      return page({ photos: [], error: "Failed to load photos" });
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
        <MediaTabs photos={data.photos} error={data.error} />
      </div>
    </MainDisplay>
  );
});
