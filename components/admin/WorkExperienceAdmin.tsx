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
import { AdminFormDialog } from "@/components/admin/AdminFormDialog.tsx";
import { DeleteConfirm } from "@/components/admin/DeleteConfirm.tsx";
import { ImagePicker } from "@/components/admin/ImagePicker.tsx";
import MarkdownEditor from "@/islands/MarkdownEditor.tsx";
import { toDateInputValue } from "@/lib/utils.ts";
import type { WorkExperienceItem } from "@/lib/work-experience.ts";
import type { MediaItem } from "@/lib/media.ts";

interface WorkExperienceAdminProps {
  items: WorkExperienceItem[];
  images: MediaItem[];
  editId: number | null;
  isNew: boolean;
  confirmDelete: boolean;
}

export default function WorkExperienceAdmin(
  { items, images, editId, isNew, confirmDelete }: WorkExperienceAdminProps,
) {
  const editing = editId !== null
    ? items.find((item) => item.id === editId) ?? null
    : null;

  return (
    <Card>
      <CardHeader class="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Work experience</CardTitle>
          <CardDescription>Manage jobs and employers.</CardDescription>
        </div>
        <Button href="/admin?tab=work-experience&new=1" size="sm">
          Add work experience
        </Button>
      </CardHeader>
      <CardContent class="flex flex-col gap-2">
        <AdminFormDialog
          open={isNew || editing !== null}
          closeHref="/admin?tab=work-experience"
          title={editing ? "Edit work experience" : "Add work experience"}
          description="Manage jobs and employers."
        >
          {editing && confirmDelete
            ? (
              <DeleteConfirm
                label={editing.jobTitle}
                action={`/api/work-experience/${editing.id}/delete`}
                cancelHref={`/admin?tab=work-experience&edit=${editing.id}`}
              />
            )
            : (
              <form
                method="POST"
                action={editing
                  ? `/api/work-experience/${editing.id}`
                  : "/api/work-experience"}
                class="flex flex-col gap-3"
              >
                <FieldSet>
                  <FieldGroup>
                    <Field class="flex flex-col gap-1.5">
                      <FieldLabel for="jobTitle">Job title</FieldLabel>
                      <Input
                        id="jobTitle"
                        name="jobTitle"
                        defaultValue={editing?.jobTitle ?? ""}
                        required
                      />
                    </Field>

                    <Field class="flex flex-col gap-1.5">
                      <FieldLabel for="companyName">Company name</FieldLabel>
                      <Input
                        id="companyName"
                        name="companyName"
                        defaultValue={editing?.companyName ?? ""}
                        required
                      />
                    </Field>

                    <Field class="flex flex-col gap-1.5">
                      <FieldLabel for="companyUrl">Company URL</FieldLabel>
                      <Input
                        id="companyUrl"
                        type="url"
                        name="companyUrl"
                        defaultValue={editing?.companyUrl ?? ""}
                      />
                    </Field>

                    <Field class="flex flex-col gap-1.5">
                      <FieldLabel for="startedAt">Started at</FieldLabel>
                      <Input
                        id="startedAt"
                        type="date"
                        name="startedAt"
                        defaultValue={toDateInputValue(
                          editing?.startedAt ?? null,
                        )}
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
                        name="finishedAt"
                        defaultValue={toDateInputValue(
                          editing?.finishedAt ?? null,
                        )}
                      />
                    </Field>
                  </FieldGroup>

                  <Field>
                    <FieldLabel>Logo</FieldLabel>
                    <ImagePicker
                      name="companyLogoId"
                      images={images}
                      selectedId={editing?.companyLogoId ?? null}
                    />
                  </Field>

                  <Field class="flex flex-col gap-1.5">
                    <FieldLabel for="links">
                      Additional links (one per line)
                    </FieldLabel>
                    <Textarea
                      id="links"
                      name="links"
                      rows={3}
                      defaultValue={(editing?.links ?? []).join("\n")}
                      placeholder="https://www.linkedin.com/company/..."
                      class="border border-stone-300 dark:border-stone-600 p-1.5 rounded-lg"
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

                  <div class="flex gap-2">
                    <Button type="submit" variant="default">
                      {editing ? "Save changes" : "Add work experience"}
                    </Button>
                    <Button
                      href="/admin?tab=work-experience"
                      variant="outline"
                    >
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
              <div class="flex items-center gap-3 min-w-0">
                {item.logoSrc && (
                  <img
                    src={item.logoSrc}
                    alt=""
                    class="h-10 w-10 object-cover rounded shrink-0"
                  />
                )}
                <div>
                  <p class="font-medium">{item.jobTitle}</p>
                  <p class="text-sm text-stone-500">{item.companyName}</p>
                </div>
              </div>
              <div class="flex gap-2 shrink-0">
                <Button
                  href={`/admin?tab=work-experience&edit=${item.id}`}
                  size="sm"
                  variant="outline"
                >
                  Edit
                </Button>
                <Button
                  href={`/admin?tab=work-experience&edit=${item.id}&confirmDelete=1`}
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
