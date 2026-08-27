import { faImages } from "@fortawesome/free-solid-svg-icons";
import { FaIcon } from "@/components/icon.tsx";
import { Radio } from "@/components/ui/radio.tsx";
import type { MediaItem } from "@/lib/media.ts";

interface ImagePickerProps {
  name: string;
  images: MediaItem[];
  selectedId: number | null;
  /** Whether to include a "No image" tile for clearing the field; set false for required fields. */
  allowNoImage?: boolean;
}

/** Single-image picker: a thumbnail grid, radio-selected, with an optional "No image" tile to clear the field. */
export function ImagePicker(
  { name, images, selectedId, allowNoImage = true }: ImagePickerProps,
) {
  return (
    <div class="@container">
      <div class="grid grid-cols-3 @sm:grid-cols-4 @md:grid-cols-6 gap-x-2 gap-y-3 max-h-72 overflow-y-auto p-2 border border-stone-300 dark:border-stone-600 rounded-lg">
        {allowNoImage && (
          <label class="relative flex aspect-square min-h-0 flex-col items-center justify-center gap-1 rounded-md border-2 border-transparent bg-stone-100 text-stone-400 cursor-pointer overflow-hidden has-[:checked]:border-primary dark:bg-stone-800">
            <FaIcon icon={faImages} />
            <span class="text-[10px]">No image</span>
            <div class="absolute top-1.5 right-1.5">
              <Radio
                name={name}
                value=""
                checked={selectedId === null}
                class="bg-white/90 dark:bg-stone-900/90"
              />
            </div>
          </label>
        )}
        {images.map((image) => (
          <label
            key={image.id}
            class="relative block aspect-square cursor-pointer rounded-md overflow-hidden border-2 border-transparent has-[:checked]:border-primary"
          >
            <img
              src={image.src}
              alt={image.alt ?? ""}
              class="absolute inset-0 w-full h-full object-cover bg-stone-100 dark:bg-stone-800"
            />
            <div class="absolute top-1.5 right-1.5">
              <Radio
                name={name}
                value={image.id}
                checked={selectedId === image.id}
                required={!allowNoImage}
                class="bg-white/90 dark:bg-stone-900/90"
              />
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
