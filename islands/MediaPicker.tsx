import { useEffect, useState } from "preact/hooks";
import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";
import type { MediaItem, MediaType } from "@/lib/media.ts";

interface MediaPickerProps {
  selectedIds: number[];
  onConfirm: (items: MediaItem[]) => void;
  typeFilter?: MediaType;
  multiple?: boolean;
  triggerLabel?: string;
}

const PREVIEWABLE_TYPES: MediaType[] = ["image", "pfp"];

export default function MediaPicker(
  {
    selectedIds,
    onConfirm,
    typeFilter,
    multiple = true,
    triggerLabel = "Choose media",
  }: MediaPickerProps,
) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState<number[]>(selectedIds);

  useEffect(() => {
    if (!open) return;
    setPending(selectedIds);
    setLoading(true);
    const qs = typeFilter ? `?type=${typeFilter}` : "";
    fetch(`/api/media${qs}`, { credentials: "include" })
      .then((res) => res.ok ? res.json() : [])
      .then(setItems)
      .finally(() => setLoading(false));
  }, [open]);

  function toggle(id: number) {
    if (multiple) {
      setPending((prev) =>
        prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
      );
    } else {
      setPending([id]);
    }
  }

  function confirm() {
    onConfirm(items.filter((item) => pending.includes(item.id)));
    setOpen(false);
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
      >
        {triggerLabel}
      </Button>

      {open && (
        <div
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            class="bg-background text-foreground w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl border border-stone-200 dark:border-stone-700 p-4 flex flex-col gap-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">Choose media</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                class="text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {loading
              ? <p class="text-sm text-stone-500">Loading…</p>
              : items.length === 0
              ? <p class="text-sm text-stone-500">No media found.</p>
              : (
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {items.map((item) => {
                    const selected = pending.includes(item.id);
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => toggle(item.id)}
                        class={cn(
                          "flex flex-col gap-1 border rounded-lg p-2 text-left text-sm",
                          selected
                            ? "border-primary bg-primary/5"
                            : "border-stone-200 dark:border-stone-700",
                        )}
                      >
                        {PREVIEWABLE_TYPES.includes(item.type)
                          ? (
                            <img
                              src={item.src}
                              alt={item.alt ?? ""}
                              class="h-20 w-full object-cover rounded"
                            />
                          )
                          : (
                            <div class="h-20 w-full flex items-center justify-center rounded bg-stone-100 dark:bg-stone-800 text-xs uppercase text-stone-500">
                              {item.type}
                            </div>
                          )}
                        <span class="truncate">{item.alt || item.src}</span>
                      </button>
                    );
                  })}
                </div>
              )}

            <div class="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="button" variant="ghost" onClick={confirm}>
                Use selected
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
