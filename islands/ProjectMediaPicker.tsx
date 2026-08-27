import { useState } from "preact/hooks";
import {
  faChevronDown,
  faChevronUp,
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

/** Multi-select image picker with manual reordering, used to set a project's linked photos and main photo. */
export default function ProjectMediaPicker(
  { images, initialSelectedIds }: ProjectMediaPickerProps,
) {
  const [selectedIds, setSelectedIds] = useState<number[]>(
    initialSelectedIds,
  );

  function toggle(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  function move(id: number, direction: -1 | 1) {
    setSelectedIds((prev) => {
      const index = prev.indexOf(id);
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
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
              class="relative w-28 rounded-md overflow-hidden border-2 border-primary"
            >
              <img
                src={image.src}
                alt={image.alt ?? ""}
                class="aspect-square w-full object-cover bg-stone-100 dark:bg-stone-800"
              />
              {index === 0 && (
                <span class="absolute top-1 left-1 flex items-center gap-1 rounded bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5">
                  <FaIcon icon={faThumbtack} /> Main
                </span>
              )}
              <div class="absolute bottom-1 right-1 flex gap-1">
                <Button
                  type="button"
                  variant="default"
                  size="icon-sm"
                  class="size-6"
                  disabled={index === 0}
                  onClick={() => move(image.id, -1)}
                  aria-label="Move earlier"
                >
                  <FaIcon icon={faChevronUp} class="text-xs" />
                </Button>
                <Button
                  type="button"
                  variant="default"
                  size="icon-sm"
                  class="size-6"
                  disabled={index === selected.length - 1}
                  onClick={() => move(image.id, 1)}
                  aria-label="Move later"
                >
                  <FaIcon icon={faChevronDown} class="text-xs" />
                </Button>
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

      <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-72 overflow-y-auto p-2 border border-stone-300 dark:border-stone-600 rounded-lg">
        {images.map((image) => {
          const isSelected = selectedIds.includes(image.id);
          return (
            <button
              type="button"
              key={image.id}
              onClick={() => toggle(image.id)}
              class={`relative block rounded-md overflow-hidden border-2 ${
                isSelected ? "border-primary" : "border-transparent"
              }`}
            >
              <img
                src={image.src}
                alt={image.alt ?? ""}
                class="aspect-square w-full object-cover bg-stone-100 dark:bg-stone-800"
              />
            </button>
          );
        })}
      </div>

      {selectedIds.map((id) => (
        <input key={id} type="hidden" name="mediaIds" value={id} />
      ))}
    </div>
  );
}
