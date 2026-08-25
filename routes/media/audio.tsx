import { page } from "fresh";
import { define } from "../../utils.ts";
import { MainDisplay } from "@/components/layout/MainDisplay.tsx";
import { MediaTabsNav } from "@/components/media/MediaTabsNav.tsx";
import AudioReleases from "@/islands/AudioReleases.tsx";
import { listReleases, type ReleaseItem } from "@/lib/releases.ts";

interface AudioData {
  releases: ReleaseItem[];
  error: string | null;
}

export const handler = define.handlers({
  async GET(): Promise<ReturnType<typeof page<AudioData>>> {
    try {
      const releases = await listReleases();
      return page({ releases, error: null });
    } catch (error) {
      console.error("Failed to load audio", error);
      return page({ releases: [], error: "Failed to load audio" });
    }
  },
});

export default define.page<typeof handler>(function Audio({ data }) {
  return (
    <MainDisplay>
      <div class="flex flex-col gap-6">
        <section class="flex flex-col gap-3">
          <h1 class="text-4xl font-bold dark:text-stone-100">Media</h1>
          <p class="text-lg leading-relaxed text-stone-700 dark:text-stone-300">
            Welcome to the repository of my photos and music.
          </p>
        </section>
        <MediaTabsNav active="audio" />
        {data.error
          ? <div class="text-red-600">{data.error}</div>
          : data.releases.length === 0
          ? (
            <div class="text-stone-900 dark:text-stone-100">
              No music found
            </div>
          )
          : <AudioReleases releases={data.releases} />}
      </div>
    </MainDisplay>
  );
});
