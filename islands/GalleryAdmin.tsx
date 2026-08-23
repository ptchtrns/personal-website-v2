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
import type { GalleryItem } from "@/lib/gallery.ts";

const EMPTY_FORM = {
  description: "",
  imageId: null as number | null,
  imageSrc: "",
};

export default function GalleryAdmin() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function refresh() {
    const res = await fetch("/api/gallery", { credentials: "include" });
    if (res.ok) setItems(await res.json());
  }

  useEffect(() => {
    refresh();
  }, []);

  function startEdit(item: GalleryItem) {
    setEditingId(item.id);
    setForm({
      description: item.description ?? "",
      imageId: item.imageId,
      imageSrc: item.src,
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(event: JSX.TargetedEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!form.imageId) {
      setError("Please choose an image");
      return;
    }

    setLoading(true);
    try {
      const url = editingId ? `/api/gallery/${editingId}` : "/api/gallery";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: form.description || null,
          imageId: form.imageId,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save gallery item");
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
    if (!confirm("Delete this gallery item?")) return;
    const res = await fetch(`/api/gallery/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) await refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingId ? "Edit photo" : "Add photo"}</CardTitle>
        <CardDescription>Manage the photo gallery.</CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-6">
        <form onSubmit={handleSubmit} class="flex flex-col gap-3">
          <FieldSet>
            <FieldGroup>
              <Field class="flex flex-col gap-1.5">
                <FieldLabel for="description">Description</FieldLabel>
                <Input
                  id="description"
                  value={form.description}
                  onInput={(e) =>
                    setForm({ ...form, description: e.currentTarget.value })}
                />
              </Field>

              <Field class="flex flex-col gap-1.5">
                <FieldLabel>Image</FieldLabel>
                <div class="flex items-center gap-2">
                  {form.imageSrc && (
                    <img
                      src={form.imageSrc}
                      alt=""
                      class="h-10 w-10 object-cover rounded"
                    />
                  )}
                  <MediaPicker
                    selectedIds={form.imageId ? [form.imageId] : []}
                    typeFilter="image"
                    multiple={false}
                    triggerLabel={form.imageId
                      ? "Change image"
                      : "Choose image"}
                    onConfirm={([item]) =>
                      item &&
                      setForm({
                        ...form,
                        imageId: item.id,
                        imageSrc: item.src,
                      })}
                  />
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
                  : "Add photo"}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </FieldSet>
        </form>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              class="flex flex-col gap-2 border border-stone-200 dark:border-stone-700 rounded-lg p-3"
            >
              <img
                src={item.src}
                alt={item.description ?? ""}
                class="h-32 w-full object-cover rounded"
              />
              <p class="text-sm truncate">{item.description || "—"}</p>
              <div class="flex gap-2">
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
