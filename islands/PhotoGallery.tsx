import { useState } from "preact/hooks";
import { Card } from "@/components/ui/card.tsx";
import { Dialog, DialogContent } from "@/components/ui/dialog.tsx";
import type { GalleryItem } from "@/lib/gallery.ts";

export default function PhotoGallery({ gallery }: { gallery: GalleryItem[] }) {
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
                alt={item.alt ?? ""}
                class="w-full"
                loading="lazy"
              />
            </Card>
          </button>
        ))}
      </div>

      <Dialog open={active !== null} onOpenChange={() => setActive(null)}>
        {active && (
          <DialogContent class="max-w-4xl bg-transparent border-0 p-0 shadow-none">
            <img
              src={active.src}
              alt={active.alt ?? ""}
              class="w-full rounded-lg"
            />
            {active.alt && (
              <p class="text-stone-200 text-center">
                {active.alt}
              </p>
            )}
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
