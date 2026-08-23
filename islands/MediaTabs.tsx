import { Card, CardContent } from "@/components/ui/card.tsx";
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

export default function MediaTabs({ gallery, music, error }: MediaTabsProps) {
  return (
    <Tabs defaultValue="photos">
      <TabsList>
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
          : (
            <div class="grid grid-cols-1 gap-4">
              {gallery.map((item) => (
                <Card key={item.id}>
                  <CardContent class="pt-6">
                    <img
                      src={item.src}
                      alt={item.description ?? ""}
                      class="w-full"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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
