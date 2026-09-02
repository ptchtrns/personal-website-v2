import { page } from "fresh";
import { define } from "../../utils.ts";
import { MainDisplay } from "@/components/layout/MainDisplay.tsx";
import AudioReleases from "@/islands/AudioReleases.tsx";
import { listReleases, type ReleaseItem } from "@/lib/releases.ts";

interface MusicData {
  releases: ReleaseItem[];
  error: string | null;
}

export const handler = define.handlers({
  async GET(): Promise<ReturnType<typeof page<MusicData>>> {
    try {
      const releases = await listReleases();
      return page({ releases, error: null });
    } catch (error) {
      console.error("Failed to load music", error);
      return page({ releases: [], error: "Failed to load music" });
    }
  },
});

export default define.page<typeof handler>(function Music({ data }) {
  return (
    <MainDisplay>
      <div class="flex flex-col gap-6">
        <section class="flex flex-col gap-3">
          <h1 class="text-4xl font-bold dark:text-zinc-100">Music</h1>
          <p class="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
            A repository of music I have made.
          </p>
        </section>
        {data.error
          ? <div class="text-red-600">{data.error}</div>
          : data.releases.length === 0
          ? (
            <div class="text-zinc-900 dark:text-zinc-100">
              No music found
            </div>
          )
          : <AudioReleases releases={data.releases} />}
      </div>
    </MainDisplay>
  );
});
