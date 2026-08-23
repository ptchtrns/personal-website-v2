import type { JSX } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import MediaPicker from "@/islands/MediaPicker.tsx";
import type { MusicItem } from "@/lib/music.ts";

const EMPTY_FORM = {
  title: "",
  audioId: null as number | null,
  audioSrc: "",
  coverId: null as number | null,
  coverSrc: "",
};

export default function MusicAdmin() {
  const [items, setItems] = useState<MusicItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function refresh() {
    const res = await fetch("/api/music", { credentials: "include" });
    if (res.ok) setItems(await res.json());
  }

  useEffect(() => {
    refresh();
  }, []);

  function startEdit(item: MusicItem) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      audioId: item.audioId,
      audioSrc: item.audioSrc,
      coverId: item.coverId,
      coverSrc: item.coverSrc ?? "",
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(event: JSX.TargetedEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!form.audioId) {
      setError("Please choose an audio file");
      return;
    }

    setLoading(true);
    try {
      const url = editingId ? `/api/music/${editingId}` : "/api/music";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          audioId: form.audioId,
          coverId: form.coverId,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save music item");
      }
      resetForm();
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this track?")) return;
    const res = await fetch(`/api/music/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) await refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingId ? "Edit track" : "Add track"}</CardTitle>
        <CardDescription>Manage the music library.</CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-6">
        <form onSubmit={handleSubmit} class="flex flex-col gap-3">
          <FieldSet>
            <FieldGroup>
              <Field class="flex flex-col gap-1.5">
                <FieldLabel for="title">Title</FieldLabel>
                <Input
                  id="title"
                  value={form.title}
                  onInput={(e) =>
                    setForm({ ...form, title: e.currentTarget.value })}
                  required
                />
              </Field>

              <Field class="flex flex-col gap-1.5">
                <FieldLabel>Audio file</FieldLabel>
                <div class="flex items-center gap-2">
                  {form.audioSrc && (
                    <span class="text-sm text-stone-500 truncate max-w-48">
                      {form.audioSrc}
                    </span>
                  )}
                  <MediaPicker
                    selectedIds={form.audioId ? [form.audioId] : []}
                    typeFilter="audio"
                    multiple={false}
                    triggerLabel={form.audioId
                      ? "Change audio"
                      : "Choose audio"}
                    onConfirm={([item]) =>
                      item &&
                      setForm({
                        ...form,
                        audioId: item.id,
                        audioSrc: item.src,
                      })}
                  />
                </div>
              </Field>

              <Field class="flex flex-col gap-1.5">
                <FieldLabel>Cover image (optional)</FieldLabel>
                <div class="flex items-center gap-2">
                  {form.coverSrc && (
                    <img
                      src={form.coverSrc}
                      alt=""
                      class="h-10 w-10 object-cover rounded"
                    />
                  )}
                  <MediaPicker
                    selectedIds={form.coverId ? [form.coverId] : []}
                    typeFilter="image"
                    multiple={false}
                    triggerLabel={form.coverId
                      ? "Change cover"
                      : "Choose cover"}
                    onConfirm={([item]) =>
                      item &&
                      setForm({
                        ...form,
                        coverId: item.id,
                        coverSrc: item.src,
                      })}
                  />
                  {form.coverId && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setForm({ ...form, coverId: null, coverSrc: "" })}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </Field>
            </FieldGroup>

            {error && (
              <div class="p-3 bg-red-100 border border-red-300 rounded text-red-900 text-sm">
                {error}
              </div>
            )}

            <div class="flex gap-2">
              <Button type="submit" disabled={loading} variant="ghost">
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Save changes"
                  : "Add track"}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </FieldSet>
        </form>

        <div class="flex flex-col gap-2">
          {items.map((item) => (
            <div
              key={item.id}
              class="flex items-center justify-between gap-3 border border-stone-200 dark:border-stone-700 rounded-lg p-3"
            >
              <div class="flex items-center gap-3 min-w-0">
                {item.coverSrc && (
                  <img
                    src={item.coverSrc}
                    alt=""
                    class="h-10 w-10 object-cover rounded shrink-0"
                  />
                )}
                <p class="font-medium truncate">{item.title}</p>
              </div>
              <div class="flex gap-2 shrink-0">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => startEdit(item)}
                >
                  Edit
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
