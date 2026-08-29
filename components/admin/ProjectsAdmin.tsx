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
import { AdminListRow } from "@/components/admin/AdminListRow.tsx";
import { DeleteConfirm } from "@/components/admin/DeleteConfirm.tsx";
import MarkdownEditor from "@/islands/MarkdownEditor.tsx";
import ProjectMediaPicker from "@/islands/ProjectMediaPicker.tsx";
import { findById } from "@/lib/utils.ts";
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
  const editing = findById(items, editId);

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

                  <Field class="flex flex-col gap-1.5">
                    <FieldLabel for="links">
                      Additional links (one per line)
                    </FieldLabel>
                    <Textarea
                      id="links"
                      name="links"
                      rows={3}
                      defaultValue={(editing?.links ?? []).join("\n")}
                      placeholder="https://github.com/user/repo"
                      class="border border-zinc-300 dark:border-zinc-600 p-1.5 rounded-lg"
                    />
                  </Field>

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
                      class="border border-zinc-300 dark:border-zinc-600 p-1.5 rounded-lg"
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
                    <ProjectMediaPicker
                      images={images}
                      initialSelectedIds={(editing?.media ?? []).map((item) =>
                        item.id
                      )}
                    />
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
              class="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3"
            >
              <AdminListRow
                editHref={`/admin?tab=projects&edit=${item.id}`}
                deleteHref={`/admin?tab=projects&edit=${item.id}&confirmDelete=1`}
                title={item.name}
                subtitle={item.technologies.map((t) => t.name).join(", ")}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
