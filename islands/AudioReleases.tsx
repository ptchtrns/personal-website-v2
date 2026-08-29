import { useState } from "preact/hooks";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Dialog, DialogContent } from "@/components/ui/dialog.tsx";
import {
  faArrowUpRightFromSquare,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { FaIcon } from "@/components/icon.tsx";
import { cn } from "@/lib/utils.ts";
import { getLinkLabel, type ReleaseItem } from "@/lib/releases.shared.ts";
import {
  currentTrack,
  isPlaying,
  type PlayerTrack,
  playTrack,
} from "@/lib/player-store.ts";

const RELEASE_TYPE_LABEL: Record<ReleaseItem["type"], string> = {
  album: "Album",
  ep: "EP",
  single: "Single",
};

export default function AudioReleases({
  releases,
}: {
  releases: ReleaseItem[];
}) {
  const [linksOpenId, setLinksOpenId] = useState<number | null>(null);
  const linksRelease = releases.find((release) => release.id === linksOpenId) ??
    null;

  return (
    <div class="flex flex-col gap-4">
      {releases.map((release) => (
        <Card key={release.id} class="overflow-hidden py-0">
          <CardContent class="p-6 flex flex-col sm:flex-row gap-6">
            {release.coverSrc && (
              <img
                src={release.coverSrc}
                alt=""
                class="w-48 aspect-square object-cover shrink-0 self-start rounded-lg"
              />
            )}
            <div class="flex flex-col gap-4 min-w-0 flex-1">
              <div class="flex flex-col gap-2">
                <div class="flex items-center gap-2 min-w-0">
                  <h2 class="text-xl font-semibold truncate">
                    {release.title}
                  </h2>
                  <Badge variant="secondary">
                    {RELEASE_TYPE_LABEL[release.type]}
                  </Badge>
                </div>
                {release.description && (
                  <p class="text-sm text-zinc-600 dark:text-zinc-400">
                    {release.description}
                  </p>
                )}
              </div>

              {release.links && release.links.length > 0 && (
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setLinksOpenId(release.id)}
                  >
                    Streaming links
                    <FaIcon icon={faArrowUpRightFromSquare} class="text-xs" />
                  </Button>
                </div>
              )}

              <div class="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-700">
                {release.tracks.map((track, index) => {
                  const isActive = currentTrack.value?.id === track.id;
                  const playerTracks: PlayerTrack[] = release.tracks.map((
                    t,
                  ) => ({
                    id: t.id,
                    title: t.title,
                    audioSrc: t.audioSrc,
                    releaseTitle: release.title,
                    coverSrc: release.coverSrc,
                  }));

                  return (
                    <div key={track.id} class="flex items-center gap-3 py-2.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={isActive && isPlaying.value
                          ? `Pause ${track.title}`
                          : `Play ${track.title}`}
                        onClick={() =>
                          playTrack(playerTracks, index)}
                      >
                        <FaIcon
                          icon={isActive && isPlaying.value ? faPause : faPlay}
                          class="text-xs"
                        />
                      </Button>
                      <span class="text-xs text-zinc-400 dark:text-zinc-500 w-5 shrink-0 text-right">
                        {index + 1}
                      </span>
                      <p
                        class={cn(
                          "text-sm font-medium truncate min-w-0 flex-1",
                          isActive && "text-zinc-950 dark:text-white",
                        )}
                      >
                        {track.title}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog
        open={linksRelease !== null}
        onOpenChange={() => setLinksOpenId(null)}
      >
        {linksRelease && (
          <DialogContent class="max-w-sm">
            <h2 class="font-semibold">{linksRelease.title}</h2>
            <div class="flex flex-col gap-2">
              {(linksRelease.links ?? []).map((link) => (
                <Button
                  key={link}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  class="justify-between"
                >
                  {getLinkLabel(link)}
                  <FaIcon icon={faArrowUpRightFromSquare} class="text-xs" />
                </Button>
              ))}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
