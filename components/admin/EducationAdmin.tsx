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
import { toDateInputValue } from "@/lib/utils.ts";
import type { EducationItem } from "@/lib/education.ts";

interface EducationAdminProps {
  items: EducationItem[];
  editId: number | null;
  isNew: boolean;
  confirmDelete: boolean;
}

export default function EducationAdmin(
  { items, editId, isNew, confirmDelete }: EducationAdminProps,
) {
  const editing = editId !== null
    ? items.find((item) => item.id === editId) ?? null
    : null;

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

                    <Field class="flex flex-col gap-1.5">
                      <FieldLabel for="institutionLogoSrc">
                        Logo URL
                      </FieldLabel>
                      <Input
                        id="institutionLogoSrc"
                        name="institutionLogoSrc"
                        defaultValue={editing?.institutionLogoSrc ?? ""}
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
                    <FieldLabel for="description">Description</FieldLabel>
                    <Textarea
                      id="description"
                      name="description"
                      rows={3}
                      defaultValue={editing?.description ?? ""}
                      class="border border-stone-300 dark:border-stone-600 p-1.5 rounded-lg"
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
                  href={`/admin?tab=education&edit=${item.id}`}
                  size="sm"
                  variant="outline"
                >
                  Edit
                </Button>
                <Button
                  href={`/admin?tab=education&edit=${item.id}&confirmDelete=1`}
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
