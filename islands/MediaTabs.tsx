import { Card, CardContent } from "@/components/ui/card.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import type { Photo } from "@/lib/photos.ts";

interface MediaTabsProps {
  photos: Photo[];
  error: string | null;
}

export default function MediaTabs({ photos, error }: MediaTabsProps) {
  return (
    <Tabs defaultValue="photos">
      <TabsList>
        <TabsTrigger value="photos">Photos</TabsTrigger>
        <TabsTrigger value="audio">Audio</TabsTrigger>
      </TabsList>
      <TabsContent value="photos">
        {error
          ? <div class="text-red-600">{error}</div>
          : photos.length === 0
          ? (
            <div class="text-stone-900 dark:text-stone-100">
              No photos found
            </div>
          )
          : (
            <div class="grid grid-cols-1 gap-4">
              {photos.map((photo) => (
                <Card key={photo._id}>
                  <CardContent class="pt-6">
                    <img
                      src={photo.image.original}
                      alt={photo.title}
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
