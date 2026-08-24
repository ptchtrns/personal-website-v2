import { useState } from "preact/hooks";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Dialog, DialogContent } from "@/components/ui/dialog.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import type { GalleryItem } from "@/lib/gallery.ts";
import type { ReleaseItem } from "@/lib/releases.ts";

interface MediaTabsProps {
  gallery: GalleryItem[];
  releases: ReleaseItem[];
  error: string | null;
}

const RELEASE_TYPE_LABEL: Record<ReleaseItem["type"], string> = {
  album: "Album",
  ep: "EP",
  single: "Single",
};

function GalleryMasonry({ gallery }: { gallery: GalleryItem[] }) {
  const [active, setActive] = useState<GalleryItem | null>(null);

  return (
    <>
      <div class="columns-1 sm:columns-2 lg:columns-3 gap-4 [&>*]:mb-4">
        {gallery.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => setActive(item)}
            class="block w-full break-inside-avoid text-left"
          >
            <Card class="overflow-hidden py-0 gap-0 hover:opacity-90 transition-opacity">
              <img
                src={item.src}
                alt={item.description ?? ""}
                class="w-full"
                loading="lazy"
              />
            </Card>
          </button>
        ))}
      </div>

      <Dialog open={active !== null} onOpenChange={() => setActive(null)}>
        {active && (
          <DialogContent>
            <img
              src={active.src}
              alt={active.description ?? ""}
              class="w-full rounded-lg"
            />
            {active.description && (
              <p class="text-stone-700 dark:text-stone-300">
                {active.description}
              </p>
            )}
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}

export default function MediaTabs(
  { gallery, releases, error }: MediaTabsProps,
) {
  return (
    <Tabs defaultValue="photos">
      <TabsList class="gap-1">
        <TabsTrigger value="photos">Photos</TabsTrigger>
        <TabsTrigger value="audio">Audio</TabsTrigger>
      </TabsList>
      <TabsContent value="photos">
        {error
          ? <div class="text-red-600">{error}</div>
          : gallery.length === 0
          ? (
            <div class="text-stone-900 dark:text-stone-100">
              No photos found
            </div>
          )
          : <GalleryMasonry gallery={gallery} />}
      </TabsContent>
      <TabsContent value="audio">
        {error
          ? <div class="text-red-600">{error}</div>
          : releases.length === 0
          ? (
            <div class="text-stone-900 dark:text-stone-100">
              No music found
            </div>
          )
          : (
            <div class="flex flex-col gap-4">
              {releases.map((release) => (
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
                      <div class="flex flex-col gap-2">
                        {release.tracks.map((track) => (
                          <div
                            key={track.id}
                            class="flex flex-col gap-1"
                          >
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
      </TabsContent>
    </Tabs>
  );
}
