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
import { DeleteConfirm } from "@/components/admin/DeleteConfirm.tsx";
import MarkdownEditor from "@/islands/MarkdownEditor.tsx";
import { toDateInputValue } from "@/lib/utils.ts";
import type { WorkExperienceItem } from "@/lib/work-experience.ts";

interface WorkExperienceAdminProps {
  items: WorkExperienceItem[];
  editId: number | null;
  confirmDelete: boolean;
}

export default function WorkExperienceAdmin(
  { items, editId, confirmDelete }: WorkExperienceAdminProps,
) {
  const editing = editId !== null
    ? items.find((item) => item.id === editId) ?? null
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {editing ? "Edit work experience" : "Add work experience"}
        </CardTitle>
        <CardDescription>Manage jobs and employers.</CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-6">
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
                    <FieldLabel for="companyLogoSrc">Logo URL</FieldLabel>
                    <Input
                      id="companyLogoSrc"
                      name="companyLogoSrc"
                      defaultValue={editing?.companyLogoSrc ?? ""}
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
                  {editing && (
                    <Button href="/admin?tab=work-experience" variant="outline">
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
                <p class="font-medium">{item.jobTitle}</p>
                <p class="text-sm text-stone-500">{item.companyName}</p>
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
