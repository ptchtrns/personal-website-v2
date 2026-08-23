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
import { Checkbox } from "@/components/ui/checkbox.tsx";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import MediaPicker from "@/islands/MediaPicker.tsx";
import type { ProjectItem } from "@/lib/projects.ts";
import type { MediaItem } from "@/lib/media.ts";
import type { Technology } from "@/lib/technologies.ts";

const EMPTY_FORM = {
  name: "",
  description: "",
  changelog: "",
  shortOverview: "",
  externalUrl: "",
  isPinned: false,
  isActive: true,
  technologyNames: [] as string[],
  mediaIds: [] as number[],
};

export default function ProjectsAdmin() {
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [techInput, setTechInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function refresh() {
    const [projectsRes, techRes] = await Promise.all([
      fetch("/api/projects", { credentials: "include" }),
      fetch("/api/technologies", { credentials: "include" }),
    ]);
    if (projectsRes.ok) setItems(await projectsRes.json());
    if (techRes.ok) setTechnologies(await techRes.json());
  }

  useEffect(() => {
    refresh();
  }, []);

  function startEdit(item: ProjectItem) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: (item.description ?? []).join("\n"),
      changelog: item.changelog ?? "",
      shortOverview: item.shortOverview ?? "",
      externalUrl: item.externalUrl ?? "",
      isPinned: item.isPinned,
      isActive: item.isActive,
      technologyNames: item.technologies.map((t) => t.name),
      mediaIds: item.media.map((m) => m.id),
    });
    setSelectedMedia(item.media);
    setTechInput("");
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSelectedMedia([]);
    setTechInput("");
  }

  function addTechnology(name: string) {
    const trimmed = name.trim();
    if (!trimmed || form.technologyNames.includes(trimmed)) return;
    setForm({ ...form, technologyNames: [...form.technologyNames, trimmed] });
  }

  function removeTechnology(name: string) {
    setForm({
      ...form,
      technologyNames: form.technologyNames.filter((n) => n !== name),
    });
  }

  function handleTechKeyDown(
    event: JSX.TargetedKeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTechnology(techInput);
      setTechInput("");
    }
  }

  function handleMediaConfirm(items: MediaItem[]) {
    setSelectedMedia(items);
    setForm({ ...form, mediaIds: items.map((item) => item.id) });
  }

  async function handleSubmit(event: JSX.TargetedEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = editingId ? `/api/projects/${editingId}` : "/api/projects";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          description: form.description.split("\n"),
          changelog: form.changelog || null,
          shortOverview: form.shortOverview || null,
          externalUrl: form.externalUrl || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save project");
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
    if (!confirm("Delete this project?")) return;
    const res = await fetch(`/api/projects/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) await refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingId ? "Edit project" : "Add project"}</CardTitle>
        <CardDescription>Manage portfolio projects.</CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-6">
        <form onSubmit={handleSubmit} class="flex flex-col gap-3">
          <FieldSet>
            <FieldGroup>
              <Field class="flex flex-col gap-1.5">
                <FieldLabel for="name">Name</FieldLabel>
                <Input
                  id="name"
                  value={form.name}
                  onInput={(e) =>
                    setForm({ ...form, name: e.currentTarget.value })}
                  required
                />
              </Field>

              <Field class="flex flex-col gap-1.5">
                <FieldLabel for="shortOverview">Short overview</FieldLabel>
                <Input
                  id="shortOverview"
                  value={form.shortOverview}
                  onInput={(e) =>
                    setForm({ ...form, shortOverview: e.currentTarget.value })}
                />
              </Field>

              <Field class="flex flex-col gap-1.5">
                <FieldLabel for="externalUrl">External URL</FieldLabel>
                <Input
                  id="externalUrl"
                  type="url"
                  value={form.externalUrl}
                  onInput={(e) =>
                    setForm({ ...form, externalUrl: e.currentTarget.value })}
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

            <Field>
              <FieldLabel for="changelog">Changelog</FieldLabel>
              <Textarea
                id="changelog"
                rows={3}
                value={form.changelog}
                onInput={(e) =>
                  setForm({ ...form, changelog: e.currentTarget.value })}
                class="border border-stone-300 dark:border-stone-600 p-1.5 rounded-lg"
              />
            </Field>

            <div class="flex gap-6">
              <label class="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={form.isPinned}
                  onChange={(e) =>
                    setForm({ ...form, isPinned: e.currentTarget.checked })}
                />
                Pinned
              </label>
              <label class="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.currentTarget.checked })}
                />
                Active
              </label>
            </div>

            <Field>
              <FieldLabel for="techInput">Technologies</FieldLabel>
              <div class="flex flex-wrap gap-2 mb-2">
                {form.technologyNames.map((name) => (
                  <span
                    key={name}
                    class="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 rounded-full px-3 py-1 text-sm"
                  >
                    {name}
                    <button
                      type="button"
                      onClick={() => removeTechnology(name)}
                      class="text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
                      aria-label={`Remove ${name}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <Input
                id="techInput"
                list="technology-suggestions"
                value={techInput}
                placeholder="Type a technology and press Enter"
                onInput={(e) => setTechInput(e.currentTarget.value)}
                onKeyDown={handleTechKeyDown}
                onBlur={() => {
                  if (techInput.trim()) {
                    addTechnology(techInput);
                    setTechInput("");
                  }
                }}
              />
              <datalist id="technology-suggestions">
                {technologies.map((tech) => (
                  <option key={tech.id} value={tech.name} />
                ))}
              </datalist>
            </Field>

            <Field>
              <FieldLabel>Linked images</FieldLabel>
              <div class="flex flex-wrap gap-2 mb-2">
                {selectedMedia.map((item) => (
                  <span
                    key={item.id}
                    class="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 rounded-full px-3 py-1 text-sm"
                  >
                    {item.alt || item.src}
                    <button
                      type="button"
                      onClick={() =>
                        handleMediaConfirm(
                          selectedMedia.filter((m) => m.id !== item.id),
                        )}
                      class="text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
                      aria-label={`Remove ${item.alt || item.src}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <MediaPicker
                selectedIds={form.mediaIds}
                typeFilter="image"
                triggerLabel="Choose images"
                onConfirm={handleMediaConfirm}
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
                  : "Add project"}
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
                <p class="font-medium">{item.name}</p>
                <p class="text-sm text-stone-500">
                  {item.technologies.map((t) => t.name).join(", ")}
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
