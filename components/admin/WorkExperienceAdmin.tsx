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
import { AdminListRow } from "@/components/admin/AdminListRow.tsx";
import { DateRangeFields } from "@/components/admin/DateRangeFields.tsx";
import { DeleteConfirm } from "@/components/admin/DeleteConfirm.tsx";
import { ImagePickerField } from "@/components/admin/ImagePickerField.tsx";
import MarkdownEditor from "@/islands/MarkdownEditor.tsx";
import { findById } from "@/lib/utils.ts";
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
  const editing = findById(items, editId);

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

                    <DateRangeFields
                      startedAt={editing?.startedAt}
                      finishedAt={editing?.finishedAt}
                    />
                  </FieldGroup>

                  <ImagePickerField
                    label="Logo"
                    name="companyLogoId"
                    images={images}
                    selectedId={editing?.companyLogoId ?? null}
                  />

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
              class="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3"
            >
              <AdminListRow
                editHref={`/admin?tab=work-experience&edit=${item.id}`}
                deleteHref={`/admin?tab=work-experience&edit=${item.id}&confirmDelete=1`}
                logoSrc={item.logoSrc}
                title={item.jobTitle}
                subtitle={item.companyName}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
