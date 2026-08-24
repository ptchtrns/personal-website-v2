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
import type { MusicItem } from "@/lib/music.ts";

interface MediaTabsProps {
  gallery: GalleryItem[];
  music: MusicItem[];
  error: string | null;
}

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

export default function MediaTabs({ gallery, music, error }: MediaTabsProps) {
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
          : music.length === 0
          ? (
            <div class="text-stone-900 dark:text-stone-100">
              No music found
            </div>
          )
          : (
            <div class="flex flex-col gap-4">
              {music.map((item) => (
                <Card key={item.id}>
                  <CardContent class="pt-6 flex items-center gap-4">
                    {item.coverSrc && (
                      <img
                        src={item.coverSrc}
                        alt=""
                        class="h-16 w-16 object-cover rounded shrink-0"
                      />
                    )}
                    <div class="flex flex-col gap-2 min-w-0 flex-1">
                      <p class="font-medium truncate">{item.title}</p>
                      <audio controls src={item.audioSrc} class="w-full" />
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
