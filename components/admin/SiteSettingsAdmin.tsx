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
import { DeleteConfirm } from "@/components/admin/DeleteConfirm.tsx";
import type { SiteSetting } from "@/lib/site-settings.ts";

interface SiteSettingsAdminProps {
  items: SiteSetting[];
  editKey: string | null;
  isNew: boolean;
  confirmDelete: boolean;
}

export default function SiteSettingsAdmin(
  { items, editKey, isNew, confirmDelete }: SiteSettingsAdminProps,
) {
  const editing = editKey !== null
    ? items.find((item) => item.key === editKey) ?? null
    : null;

  return (
    <Card>
      <CardHeader class="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Site settings</CardTitle>
          <CardDescription>
            Manage editable text used across the site, such as the home page
            description. Values support markdown.
          </CardDescription>
        </div>
        <Button href="/admin?tab=site-settings&new=1" size="sm">
          Add setting
        </Button>
      </CardHeader>
      <CardContent class="flex flex-col gap-2">
        <AdminFormDialog
          open={isNew || editing !== null}
          closeHref="/admin?tab=site-settings"
          title={editing ? `Edit ${editing.key}` : "Add setting"}
          description="Manage editable text used across the site."
        >
          {editing && confirmDelete
            ? (
              <DeleteConfirm
                label={editing.key}
                action={`/api/site-settings/${
                  encodeURIComponent(editing.key)
                }/delete`}
                cancelHref={`/admin?tab=site-settings&settingsEdit=${
                  encodeURIComponent(editing.key)
                }`}
              />
            )
            : (
              <form
                method="POST"
                action={editing
                  ? `/api/site-settings/${encodeURIComponent(editing.key)}`
                  : "/api/site-settings"}
                class="flex flex-col gap-3"
              >
                <FieldSet>
                  <FieldGroup>
                    <Field class="flex flex-col gap-1.5">
                      <FieldLabel for="key">Key</FieldLabel>
                      {editing
                        ? (
                          <Input
                            id="key"
                            value={editing.key}
                            disabled
                            readOnly
                          />
                        )
                        : (
                          <Input
                            id="key"
                            name="key"
                            placeholder="home_description"
                            required
                          />
                        )}
                    </Field>

                    <Field>
                      <FieldLabel for="value">Value</FieldLabel>
                      <Textarea
                        id="value"
                        name="value"
                        rows={5}
                        defaultValue={editing?.value ?? ""}
                        required
                        class="border border-zinc-300 dark:border-zinc-600 p-1.5 rounded-lg"
                      />
                    </Field>
                  </FieldGroup>

                  <div class="flex gap-2">
                    <Button type="submit" variant="default">
                      {editing ? "Save changes" : "Add setting"}
                    </Button>
                    <Button href="/admin?tab=site-settings" variant="outline">
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
              key={item.key}
              class="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3"
            >
              <AdminListRow
                editHref={`/admin?tab=site-settings&settingsEdit=${
                  encodeURIComponent(item.key)
                }`}
                deleteHref={`/admin?tab=site-settings&settingsEdit=${
                  encodeURIComponent(item.key)
                }&confirmDelete=1`}
                title={item.key}
                subtitle={item.value}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
