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
import { Textarea } from "@/components/ui/textarea.tsx";
import MediaPicker from "@/islands/MediaPicker.tsx";
import { toDateInputValue } from "@/lib/utils.ts";
import type { EducationItem } from "@/lib/education.ts";

const EMPTY_FORM = {
  degreeTitle: "",
  degreeType: "",
  educationInstitution: "",
  institutionLogoSrc: "",
  startedAt: "",
  finishedAt: "",
  description: "",
};

export default function EducationAdmin() {
  const [items, setItems] = useState<EducationItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function refresh() {
    const res = await fetch("/api/education", { credentials: "include" });
    if (res.ok) setItems(await res.json());
  }

  useEffect(() => {
    refresh();
  }, []);

  function startEdit(item: EducationItem) {
    setEditingId(item.id);
    setForm({
      degreeTitle: item.degreeTitle,
      degreeType: item.degreeType,
      educationInstitution: item.educationInstitution,
      institutionLogoSrc: item.institutionLogoSrc ?? "",
      startedAt: toDateInputValue(item.startedAt),
      finishedAt: toDateInputValue(item.finishedAt),
      description: item.description ?? "",
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(event: JSX.TargetedEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = editingId ? `/api/education/${editingId}` : "/api/education";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          institutionLogoSrc: form.institutionLogoSrc || null,
          finishedAt: form.finishedAt || null,
          description: form.description || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save education entry");
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
    if (!confirm("Delete this education entry?")) return;
    const res = await fetch(`/api/education/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) await refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingId ? "Edit education" : "Add education"}</CardTitle>
        <CardDescription>Manage degrees and institutions.</CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-6">
        <form onSubmit={handleSubmit} class="flex flex-col gap-3">
          <FieldSet>
            <FieldGroup>
              <Field class="flex flex-col gap-1.5">
                <FieldLabel for="degreeTitle">Degree title</FieldLabel>
                <Input
                  id="degreeTitle"
                  value={form.degreeTitle}
                  onInput={(e) =>
                    setForm({ ...form, degreeTitle: e.currentTarget.value })}
                  required
                />
              </Field>

              <Field class="flex flex-col gap-1.5">
                <FieldLabel for="degreeType">Degree type</FieldLabel>
                <Input
                  id="degreeType"
                  value={form.degreeType}
                  onInput={(e) =>
                    setForm({ ...form, degreeType: e.currentTarget.value })}
                  required
                />
              </Field>

              <Field class="flex flex-col gap-1.5">
                <FieldLabel for="educationInstitution">Institution</FieldLabel>
                <Input
                  id="educationInstitution"
                  value={form.educationInstitution}
                  onInput={(e) =>
                    setForm({
                      ...form,
                      educationInstitution: e.currentTarget.value,
                    })}
                  required
                />
              </Field>

              <Field class="flex flex-col gap-1.5">
                <FieldLabel for="institutionLogoSrc">Logo URL</FieldLabel>
                <div class="flex gap-2">
                  <Input
                    id="institutionLogoSrc"
                    value={form.institutionLogoSrc}
                    onInput={(e) =>
                      setForm({
                        ...form,
                        institutionLogoSrc: e.currentTarget.value,
                      })}
                  />
                  <MediaPicker
                    selectedIds={[]}
                    typeFilter="image"
                    multiple={false}
                    triggerLabel="Choose"
                    onConfirm={([item]) =>
                      item &&
                      setForm({ ...form, institutionLogoSrc: item.src })}
                  />
                </div>
              </Field>

              <Field class="flex flex-col gap-1.5">
                <FieldLabel for="startedAt">Started at</FieldLabel>
                <Input
                  id="startedAt"
                  type="date"
                  value={form.startedAt}
                  onInput={(e) =>
                    setForm({ ...form, startedAt: e.currentTarget.value })}
                  required
                />
              </Field>

              <Field class="flex flex-col gap-1.5">
                <FieldLabel for="finishedAt">
                  Finished at (leave empty if ongoing)
                </FieldLabel>
                <Input
                  id="finishedAt"
                  type="date"
                  value={form.finishedAt}
                  onInput={(e) =>
                    setForm({ ...form, finishedAt: e.currentTarget.value })}
                />
              </Field>
            </FieldGroup>

            <Field>
              <FieldLabel for="description">Description</FieldLabel>
              <Textarea
                id="description"
                rows={3}
                value={form.description}
                onInput={(e) =>
                  setForm({ ...form, description: e.currentTarget.value })}
                class="border border-stone-300 dark:border-stone-600 p-1.5 rounded-lg"
              />
            </Field>

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
                  : "Add education"}
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
              <div>
                <p class="font-medium">{item.degreeTitle}</p>
                <p class="text-sm text-stone-500">
                  {item.educationInstitution}
                </p>
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
