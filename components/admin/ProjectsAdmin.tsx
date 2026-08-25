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
import { Select, SelectItem } from "@/components/ui/select.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { DeleteConfirm } from "@/components/admin/DeleteConfirm.tsx";
import type { ProjectItem } from "@/lib/projects.ts";
import type { MediaItem } from "@/lib/media.ts";
import type { Technology } from "@/lib/technologies.ts";

interface ProjectsAdminProps {
  items: ProjectItem[];
  images: MediaItem[];
  technologies: Technology[];
  editId: number | null;
  confirmDelete: boolean;
}

export default function ProjectsAdmin(
  { items, images, technologies, editId, confirmDelete }: ProjectsAdminProps,
) {
  const editing = editId !== null
    ? items.find((item) => item.id === editId) ?? null
    : null;
  const editingMediaIds = new Set(
    (editing?.media ?? []).map((item) => item.id),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editing ? "Edit project" : "Add project"}</CardTitle>
        <CardDescription>Manage portfolio projects.</CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-6">
        {editing && confirmDelete
          ? (
            <DeleteConfirm
              label={editing.name}
              action={`/api/projects/${editing.id}/delete`}
              cancelHref={`/admin?tab=projects&edit=${editing.id}`}
            />
          )
          : (
            <form
              method="POST"
              action={editing ? `/api/projects/${editing.id}` : "/api/projects"}
              class="flex flex-col gap-3"
            >
              <FieldSet>
                <FieldGroup>
                  <Field class="flex flex-col gap-1.5">
                    <FieldLabel for="name">Name</FieldLabel>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={editing?.name ?? ""}
                      required
                    />
                  </Field>

                  <Field class="flex flex-col gap-1.5">
                    <FieldLabel for="shortOverview">Short overview</FieldLabel>
                    <Input
                      id="shortOverview"
                      name="shortOverview"
                      defaultValue={editing?.shortOverview ?? ""}
                    />
                  </Field>

                  <Field class="flex flex-col gap-1.5">
                    <FieldLabel for="externalUrl">External URL</FieldLabel>
                    <Input
                      id="externalUrl"
                      type="url"
                      name="externalUrl"
                      defaultValue={editing?.externalUrl ?? ""}
                    />
                  </Field>
                </FieldGroup>

                <Field>
                  <FieldLabel for="description">
                    Description (one bullet per line)
                  </FieldLabel>
                  <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    defaultValue={(editing?.description ?? []).join("\n")}
                    class="border border-stone-300 dark:border-stone-600 p-1.5 rounded-lg"
                  />
                </Field>

                <Field>
                  <FieldLabel for="changelog">Changelog</FieldLabel>
                  <Textarea
                    id="changelog"
                    name="changelog"
                    rows={3}
                    defaultValue={editing?.changelog ?? ""}
                    class="border border-stone-300 dark:border-stone-600 p-1.5 rounded-lg"
                  />
                </Field>

                <div class="flex gap-6">
                  <label class="flex items-center gap-2 text-sm">
                    <Checkbox
                      name="isPinned"
                      checked={editing?.isPinned ?? false}
                    />
                    Pinned
                  </label>
                  <label class="flex items-center gap-2 text-sm">
                    <Checkbox
                      name="isActive"
                      checked={editing?.isActive ?? true}
                    />
                    Active
                  </label>
                </div>

                <Field>
                  <FieldLabel for="technologyNames">
                    Technologies (comma-separated)
                  </FieldLabel>
                  <Input
                    id="technologyNames"
                    name="technologyNames"
                    list="technology-suggestions"
                    defaultValue={(editing?.technologies ?? []).map((t) =>
                      t.name
                    )
                      .join(", ")}
                    placeholder="React, TypeScript, Tailwind"
                  />
                  <datalist id="technology-suggestions">
                    {technologies.map((tech) => (
                      <option key={tech.id} value={tech.name} />
                    ))}
                  </datalist>
                </Field>

                <Field>
                  <FieldLabel for="mediaIds">
                    Linked images (ctrl/cmd-click to select multiple)
                  </FieldLabel>
                  <Select id="mediaIds" name="mediaIds" multiple class="h-32">
                    {images.map((image) => (
                      <SelectItem
                        key={image.id}
                        value={image.id}
                        selected={editingMediaIds.has(image.id)}
                      >
                        {image.alt || image.src}
                      </SelectItem>
                    ))}
                  </Select>
                </Field>

                <div class="flex gap-2">
                  <Button type="submit" variant="default">
                    {editing ? "Save changes" : "Add project"}
                  </Button>
                  {editing && (
                    <Button href="/admin?tab=projects" variant="outline">
                      Cancel
                    </Button>
                  )}
                </div>
              </FieldSet>
            </form>
          )}

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
                  href={`/admin?tab=projects&edit=${item.id}`}
                  size="sm"
                  variant="outline"
                >
                  Edit
                </Button>
                <Button
                  href={`/admin?tab=projects&edit=${item.id}&confirmDelete=1`}
                  size="sm"
                  variant="destructive"
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
