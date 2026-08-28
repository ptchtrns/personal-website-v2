import { useState } from "preact/hooks";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Dialog, DialogContent } from "@/components/ui/dialog.tsx";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FaIcon } from "@/components/icon.tsx";
import { getLinkLabel, type ReleaseItem } from "@/lib/releases.shared.ts";

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
                  <p class="text-sm text-stone-600 dark:text-stone-400">
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

              <div class="flex flex-col divide-y divide-stone-200 dark:divide-stone-700">
                {release.tracks.map((track, index) => (
                  <div key={track.id} class="flex items-center gap-3 py-2.5">
                    <span class="text-xs text-stone-400 dark:text-stone-500 w-5 shrink-0 text-right">
                      {index + 1}
                    </span>
                    <div class="flex flex-col gap-1 min-w-0 flex-1">
                      <p class="text-sm font-medium truncate">
                        {track.title}
                      </p>
                      <audio controls src={track.audioSrc} class="w-full" />
                    </div>
                  </div>
                ))}
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
