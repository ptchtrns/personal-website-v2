import { Card, CardContent } from "@/components/ui/card.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import type { GalleryItem } from "@/lib/gallery.ts";

interface MediaTabsProps {
  gallery: GalleryItem[];
  error: string | null;
}

export default function MediaTabs({ gallery, error }: MediaTabsProps) {
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
      <TabsContent value="audio">Audio</TabsContent>
    </Tabs>
  );
}
