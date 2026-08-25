import { page } from "fresh";
import { define } from "../../utils.ts";
import { MainDisplay } from "@/components/layout/MainDisplay.tsx";
import { MediaTabsNav } from "@/components/media/MediaTabsNav.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  getLinkLabel,
  listReleases,
  type ReleaseItem,
} from "@/lib/releases.ts";

interface AudioData {
  releases: ReleaseItem[];
  error: string | null;
}

const RELEASE_TYPE_LABEL: Record<ReleaseItem["type"], string> = {
  album: "Album",
  ep: "EP",
  single: "Single",
};

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
          : (
            <div class="flex flex-col gap-4">
              {data.releases.map((release) => (
                <Card key={release.id}>
                  <CardContent class="pt-6 flex flex-col sm:flex-row gap-4">
                    {release.coverSrc && (
                      <img
                        src={release.coverSrc}
                        alt=""
                        class="h-32 w-32 object-cover rounded shrink-0 self-start"
                      />
                    )}
                    <div class="flex flex-col gap-3 min-w-0 flex-1">
                      <div class="flex items-baseline gap-2 min-w-0">
                        <p class="font-medium truncate">{release.title}</p>
                        <span class="text-xs uppercase text-stone-500 shrink-0">
                          {RELEASE_TYPE_LABEL[release.type]}
                        </span>
                      </div>
                      {release.links && release.links.length > 0 && (
                        <div class="flex flex-wrap gap-2">
                          {release.links.map((link) => (
                            <Button
                              key={link}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              size="sm"
                              variant="outline"
                            >
                              {getLinkLabel(link)}
                            </Button>
                          ))}
                        </div>
                      )}
                      <div class="flex flex-col gap-2">
                        {release.tracks.map((track) => (
                          <div key={track.id} class="flex flex-col gap-1">
                            <p class="text-sm text-stone-700 dark:text-stone-300 truncate">
                              {track.title}
                            </p>
                            <audio
                              controls
                              src={track.audioSrc}
                              class="w-full"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
      </div>
    </MainDisplay>
  );
});
