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
import { AdminFormDialog } from "@/components/admin/AdminFormDialog.tsx";
import { DeleteConfirm } from "@/components/admin/DeleteConfirm.tsx";
import MarkdownEditor from "@/islands/MarkdownEditor.tsx";
import type { ProjectItem } from "@/lib/projects.ts";
import type { MediaItem } from "@/lib/media.ts";
import type { Technology } from "@/lib/technologies.ts";

interface ProjectsAdminProps {
  items: ProjectItem[];
  images: MediaItem[];
  technologies: Technology[];
  editId: number | null;
  isNew: boolean;
  confirmDelete: boolean;
}

export default function ProjectsAdmin(
  { items, images, technologies, editId, isNew, confirmDelete }:
    ProjectsAdminProps,
) {
  const editing = editId !== null
    ? items.find((item) => item.id === editId) ?? null
    : null;
  const editingMediaIds = new Set(
    (editing?.media ?? []).map((item) => item.id),
  );

  return (
    <Card>
      <CardHeader class="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Manage portfolio projects.</CardDescription>
        </div>
        <Button href="/admin?tab=projects&new=1" size="sm">Add project</Button>
      </CardHeader>
      <CardContent class="flex flex-col gap-2">
        <AdminFormDialog
          open={isNew || editing !== null}
          closeHref="/admin?tab=projects"
          title={editing ? "Edit project" : "Add project"}
          description="Manage portfolio projects."
        >
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
                action={editing
                  ? `/api/projects/${editing.id}`
                  : "/api/projects"}
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
                      <FieldLabel for="shortOverview">
                        Short overview
                      </FieldLabel>
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
                    <FieldLabel for="description">Description</FieldLabel>
                    <MarkdownEditor
                      id="description"
                      name="description"
                      defaultValue={editing?.description}
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
                    <FieldLabel>Linked images</FieldLabel>
                    <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-72 overflow-y-auto p-2 border border-stone-300 dark:border-stone-600 rounded-lg">
                      {images.map((image) => (
                        <label
                          key={image.id}
                          class="relative block cursor-pointer rounded-md overflow-hidden border-2 border-transparent has-[:checked]:border-primary"
                        >
                          <img
                            src={image.src}
                            alt={image.alt ?? ""}
                            class="aspect-square w-full object-cover bg-stone-100 dark:bg-stone-800"
                          />
                          <div class="absolute top-1.5 right-1.5">
                            <Checkbox
                              name="mediaIds"
                              value={image.id}
                              checked={editingMediaIds.has(image.id)}
                              class="bg-white/90 dark:bg-stone-900/90"
                            />
                          </div>
                        </label>
                      ))}
                    </div>
                  </Field>

                  <div class="flex gap-2">
                    <Button type="submit" variant="default">
                      {editing ? "Save changes" : "Add project"}
                    </Button>
                    <Button href="/admin?tab=projects" variant="outline">
                      Cancel
                    </Button>
                  </div>
                </FieldSet>
              </form>
            )}
        </AdminFormDialog>

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
