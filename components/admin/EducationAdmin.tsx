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
import { findById } from "@/lib/utils.ts";
import type { EducationItem } from "@/lib/education.ts";
import type { MediaItem } from "@/lib/media.ts";

interface EducationAdminProps {
  items: EducationItem[];
  images: MediaItem[];
  editId: number | null;
  isNew: boolean;
  confirmDelete: boolean;
}

export default function EducationAdmin(
  { items, images, editId, isNew, confirmDelete }: EducationAdminProps,
) {
  const editing = findById(items, editId);

  return (
    <Card>
      <CardHeader class="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Education</CardTitle>
          <CardDescription>Manage degrees and institutions.</CardDescription>
        </div>
        <Button href="/admin?tab=education&new=1" size="sm">
          Add education
        </Button>
      </CardHeader>
      <CardContent class="flex flex-col gap-2">
        <AdminFormDialog
          open={isNew || editing !== null}
          closeHref="/admin?tab=education"
          title={editing ? "Edit education" : "Add education"}
          description="Manage degrees and institutions."
        >
          {editing && confirmDelete
            ? (
              <DeleteConfirm
                label={editing.degreeTitle}
                action={`/api/education/${editing.id}/delete`}
                cancelHref={`/admin?tab=education&edit=${editing.id}`}
              />
            )
            : (
              <form
                method="POST"
                action={editing
                  ? `/api/education/${editing.id}`
                  : "/api/education"}
                class="flex flex-col gap-3"
              >
                <FieldSet>
                  <FieldGroup>
                    <Field class="flex flex-col gap-1.5">
                      <FieldLabel for="degreeTitle">Degree title</FieldLabel>
                      <Input
                        id="degreeTitle"
                        name="degreeTitle"
                        defaultValue={editing?.degreeTitle ?? ""}
                        required
                      />
                    </Field>

                    <Field class="flex flex-col gap-1.5">
                      <FieldLabel for="degreeType">Degree type</FieldLabel>
                      <Input
                        id="degreeType"
                        name="degreeType"
                        defaultValue={editing?.degreeType ?? ""}
                        required
                      />
                    </Field>

                    <Field class="flex flex-col gap-1.5">
                      <FieldLabel for="educationInstitution">
                        Institution
                      </FieldLabel>
                      <Input
                        id="educationInstitution"
                        name="educationInstitution"
                        defaultValue={editing?.educationInstitution ?? ""}
                        required
                      />
                    </Field>

                    <DateRangeFields
                      startedAt={editing?.startedAt}
                      finishedAt={editing?.finishedAt}
                    />
                  </FieldGroup>

                  <ImagePickerField
                    label="Logo"
                    name="institutionLogoId"
                    images={images}
                    selectedId={editing?.institutionLogoId ?? null}
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
                      placeholder="https://university.example.edu"
                      class="border border-zinc-300 dark:border-zinc-600 p-1.5 rounded-lg"
                    />
                  </Field>

                  <Field>
                    <FieldLabel for="description">Description</FieldLabel>
                    <Textarea
                      id="description"
                      name="description"
                      rows={3}
                      defaultValue={editing?.description ?? ""}
                      class="border border-zinc-300 dark:border-zinc-600 p-1.5 rounded-lg"
                    />
                  </Field>

                  <div class="flex gap-2">
                    <Button type="submit" variant="default">
                      {editing ? "Save changes" : "Add education"}
                    </Button>
                    <Button href="/admin?tab=education" variant="outline">
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
                editHref={`/admin?tab=education&edit=${item.id}`}
                deleteHref={`/admin?tab=education&edit=${item.id}&confirmDelete=1`}
                logoSrc={item.logoSrc}
                title={item.degreeTitle}
                subtitle={item.educationInstitution}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
