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
import type { WorkExperienceItem } from "@/lib/work-experience.ts";

const EMPTY_FORM = {
  jobTitle: "",
  companyName: "",
  companyUrl: "",
  companyLogoSrc: "",
  startedAt: "",
  finishedAt: "",
  description: "",
};

export default function WorkExperienceAdmin() {
  const [items, setItems] = useState<WorkExperienceItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function refresh() {
    const res = await fetch("/api/work-experience", { credentials: "include" });
    if (res.ok) setItems(await res.json());
  }

  useEffect(() => {
    refresh();
  }, []);

  function startEdit(item: WorkExperienceItem) {
    setEditingId(item.id);
    setForm({
      jobTitle: item.jobTitle,
      companyName: item.companyName,
      companyUrl: item.companyUrl ?? "",
      companyLogoSrc: item.companyLogoSrc ?? "",
      startedAt: toDateInputValue(item.startedAt),
      finishedAt: toDateInputValue(item.finishedAt),
      description: (item.description ?? []).join("\n"),
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
      const url = editingId
        ? `/api/work-experience/${editingId}`
        : "/api/work-experience";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          companyUrl: form.companyUrl || null,
          companyLogoSrc: form.companyLogoSrc || null,
          finishedAt: form.finishedAt || null,
          description: form.description.split("\n"),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save work experience entry");
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
    if (!confirm("Delete this work experience entry?")) return;
    const res = await fetch(`/api/work-experience/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) await refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {editingId ? "Edit work experience" : "Add work experience"}
        </CardTitle>
        <CardDescription>Manage jobs and employers.</CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-6">
        <form onSubmit={handleSubmit} class="flex flex-col gap-3">
          <FieldSet>
            <FieldGroup>
              <Field class="flex flex-col gap-1.5">
                <FieldLabel for="jobTitle">Job title</FieldLabel>
                <Input
                  id="jobTitle"
                  value={form.jobTitle}
                  onInput={(e) =>
                    setForm({ ...form, jobTitle: e.currentTarget.value })}
                  required
                />
              </Field>

              <Field class="flex flex-col gap-1.5">
                <FieldLabel for="companyName">Company name</FieldLabel>
                <Input
                  id="companyName"
                  value={form.companyName}
                  onInput={(e) =>
                    setForm({ ...form, companyName: e.currentTarget.value })}
                  required
                />
              </Field>

              <Field class="flex flex-col gap-1.5">
                <FieldLabel for="companyUrl">Company URL</FieldLabel>
                <Input
                  id="companyUrl"
                  type="url"
                  value={form.companyUrl}
                  onInput={(e) =>
                    setForm({ ...form, companyUrl: e.currentTarget.value })}
                />
              </Field>

              <Field class="flex flex-col gap-1.5">
                <FieldLabel for="companyLogoSrc">Logo URL</FieldLabel>
                <div class="flex gap-2">
                  <Input
                    id="companyLogoSrc"
                    value={form.companyLogoSrc}
                    onInput={(e) =>
                      setForm({
                        ...form,
                        companyLogoSrc: e.currentTarget.value,
                      })}
                  />
                  <MediaPicker
                    selectedIds={[]}
                    typeFilter="image"
                    multiple={false}
                    triggerLabel="Choose"
                    onConfirm={([item]) =>
                      item && setForm({ ...form, companyLogoSrc: item.src })}
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
              <FieldLabel for="description">
                Description (one bullet per line)
              </FieldLabel>
              <Textarea
                id="description"
                rows={4}
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
                  : "Add work experience"}
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
                <p class="font-medium">{item.jobTitle}</p>
                <p class="text-sm text-stone-500">{item.companyName}</p>
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
