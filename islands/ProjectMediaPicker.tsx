import { useState } from "preact/hooks";
import {
  faGripVertical,
  faThumbtack,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FaIcon } from "@/components/icon.tsx";
import { Button } from "@/components/ui/button.tsx";
import type { MediaItem } from "@/lib/media.ts";

interface ProjectMediaPickerProps {
  images: MediaItem[];
  /** Currently linked media ids, in display order; the first entry is the project's main photo. */
  initialSelectedIds: number[];
}

/** Multi-select image picker with drag-to-reorder, used to set a project's linked photos and main photo. */
export default function ProjectMediaPicker(
  { images, initialSelectedIds }: ProjectMediaPickerProps,
) {
  const [selectedIds, setSelectedIds] = useState<number[]>(
    initialSelectedIds,
  );
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function toggle(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  function reorder(from: number, to: number) {
    if (from === to) return;
    setSelectedIds((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  const selected = selectedIds
    .map((id) => images.find((image) => image.id === id))
    .filter((image): image is MediaItem => image !== undefined);

  return (
    <div class="flex flex-col gap-3">
      {selected.length > 0 && (
        <div class="flex flex-wrap gap-2">
          {selected.map((image, index) => (
            <div
              key={image.id}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragOver={(event: DragEvent) => {
                event.preventDefault();
                if (dragIndex === null || dragIndex === index) return;
                reorder(dragIndex, index);
                setDragIndex(index);
              }}
              onDragEnd={() => setDragIndex(null)}
              class={`relative w-28 aspect-square rounded-md overflow-hidden border-2 cursor-grab active:cursor-grabbing ${
                dragIndex === index
                  ? "border-primary opacity-50"
                  : "border-primary"
              }`}
            >
              <img
                src={image.src}
                alt={image.alt ?? ""}
                class="absolute inset-0 w-full h-full object-cover bg-stone-100 dark:bg-stone-800 pointer-events-none"
              />
              {index === 0 && (
                <span class="absolute top-1 left-1 flex items-center gap-1 rounded bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5">
                  <FaIcon icon={faThumbtack} /> Main
                </span>
              )}
              <div class="absolute bottom-1 right-1 flex gap-1">
                <span
                  class="flex items-center justify-center size-6 rounded bg-black/60 text-white"
                  aria-hidden="true"
                >
                  <FaIcon icon={faGripVertical} class="text-xs" />
                </span>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon-sm"
                  class="size-6"
                  onClick={() => toggle(image.id)}
                  aria-label="Remove"
                >
                  <FaIcon icon={faXmark} class="text-xs" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div class="@container">
        <div class="grid grid-cols-3 @sm:grid-cols-4 @md:grid-cols-6 gap-x-2 gap-y-3 max-h-72 overflow-y-auto p-2 border border-stone-300 dark:border-stone-600 rounded-lg">
          {images.map((image) => {
            const isSelected = selectedIds.includes(image.id);
            return (
              <button
                type="button"
                key={image.id}
                onClick={() => toggle(image.id)}
                class={`relative block aspect-square rounded-md overflow-hidden border-2 ${
                  isSelected ? "border-primary" : "border-transparent"
                }`}
              >
                <img
                  src={image.src}
                  alt={image.alt ?? ""}
                  class="absolute inset-0 w-full h-full object-cover bg-stone-100 dark:bg-stone-800"
                />
              </button>
            );
          })}
        </div>
      </div>

      {selectedIds.map((id) => (
        <input key={id} type="hidden" name="mediaIds" value={id} />
      ))}
    </div>
  );
}
