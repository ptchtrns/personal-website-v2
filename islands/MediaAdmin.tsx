import { useEffect, useState } from "preact/hooks";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import UploadForm from "@/islands/UploadForm.tsx";
import type { MediaItem, MediaType } from "@/lib/media.ts";

const PREVIEWABLE_TYPES: MediaType[] = ["image", "pfp"];

export default function MediaAdmin() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function refresh() {
    const res = await fetch("/api/media", { credentials: "include" });
    if (!res.ok) return;
    const data: MediaItem[] = await res.json();
    setItems(data);
    setDrafts(
      Object.fromEntries(data.map((item) => [item.id, item.alt ?? ""])),
    );
  }

  useEffect(() => {
    refresh();
  }, []);

  async function saveAlt(id: number) {
    setError("");
    setSavingId(id);
    try {
      const res = await fetch(`/api/media/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alt: drafts[id] || null }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save alt text");
      }
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save alt text");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this media item?")) return;
    const res = await fetch(`/api/media/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) await refresh();
  }

  return (
    <div class="flex flex-col gap-6">
      <UploadForm onSuccess={refresh} />

      <Card>
        <CardHeader>
          <CardTitle>Media library</CardTitle>
          <CardDescription>
            Edit alt text or remove media items.
          </CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
          {error && (
            <div class="p-3 bg-red-100 border border-red-300 rounded text-red-900 text-sm">
              {error}
            </div>
          )}

          {items.length === 0
            ? <p class="text-sm text-stone-500">No media yet.</p>
            : (
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((item) => {
                  const dirty = (drafts[item.id] ?? "") !== (item.alt ?? "");
                  return (
                    <div
                      key={item.id}
                      class="flex flex-col gap-2 border border-stone-200 dark:border-stone-700 rounded-lg p-3"
                    >
                      {PREVIEWABLE_TYPES.includes(item.type)
                        ? (
                          <img
                            src={item.src}
                            alt={item.alt ?? ""}
                            class="h-32 w-full object-cover rounded"
                          />
                        )
                        : (
                          <a
                            href={item.src}
                            target="_blank"
                            rel="noreferrer"
                            class="h-32 w-full flex items-center justify-center rounded bg-stone-100 dark:bg-stone-800 text-xs uppercase text-stone-500 truncate px-2"
                          >
                            {item.type}
                          </a>
                        )}

                      <span
                        class="text-xs text-stone-500 truncate"
                        title={item.src}
                      >
                        {item.src}
                      </span>

                      <Input
                        value={drafts[item.id] ?? ""}
                        placeholder="Alt text"
                        onInput={(e) =>
                          setDrafts({
                            ...drafts,
                            [item.id]: e.currentTarget.value,
                          })}
                      />

                      <div class="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={!dirty || savingId === item.id}
                          onClick={() => saveAlt(item.id)}
                        >
                          {savingId === item.id ? "Saving..." : "Save"}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
