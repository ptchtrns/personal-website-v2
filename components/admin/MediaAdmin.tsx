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
import { Select, SelectItem } from "@/components/ui/select.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { AdminFormDialog } from "@/components/admin/AdminFormDialog.tsx";
import { DeleteConfirm } from "@/components/admin/DeleteConfirm.tsx";
import { MEDIA_TYPE_LABELS, MEDIA_TYPES } from "@/lib/media.ts";
import type { MediaItem, MediaType } from "@/lib/media.ts";

const PREVIEWABLE_TYPES: MediaType[] = ["image", "pfp"];

const ACCEPT_BY_TYPE: Record<MediaType, string> = {
  image: "image/avif",
  pfp: "image/avif",
  audio: "audio/mpeg",
  pdf: "application/pdf",
};

interface MediaAdminProps {
  items: MediaItem[];
  deleteId: number | null;
  isNew: boolean;
  confirmDelete: boolean;
}

export default function MediaAdmin(
  { items, deleteId, isNew, confirmDelete }: MediaAdminProps,
) {
  return (
    <div class="flex flex-col gap-6">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Media</CardTitle>
            <CardDescription>
              Upload images, profile pictures, audio or PDF files to the media
              library.
            </CardDescription>
          </div>
          <Button href="/admin?tab=media&new=1" size="sm">Add media</Button>
        </CardHeader>

        <AdminFormDialog
          open={isNew}
          closeHref="/admin?tab=media"
          title="Add media"
          description="Select a file type and choose a file to upload"
        >
          <form
            method="POST"
            action="/api/media"
            enctype="multipart/form-data"
            class="flex flex-col gap-3"
          >
            <FieldSet>
              <FieldGroup>
                <Field class="flex flex-col gap-1.5">
                  <FieldLabel for="type">File type</FieldLabel>
                  <Select id="type" name="type">
                    {MEDIA_TYPES.map((value) => (
                      <SelectItem key={value} value={value}>
                        {MEDIA_TYPE_LABELS[value]}
                      </SelectItem>
                    ))}
                  </Select>
                </Field>

                <Field class="flex flex-col gap-1.5">
                  <FieldLabel for="file">File</FieldLabel>
                  <Input
                    id="file"
                    type="file"
                    name="file"
                    accept={Object.values(ACCEPT_BY_TYPE).filter(Boolean).join(
                      ",",
                    )}
                  />
                </Field>
              </FieldGroup>

              <Field>
                <FieldLabel for="alt">Alt text</FieldLabel>
                <Textarea
                  id="alt"
                  name="alt"
                  placeholder="Describe the file for accessibility"
                  rows={3}
                  class="border border-stone-300 dark:border-stone-600 p-1.5 rounded-lg"
                />
              </Field>

              <div class="flex gap-2">
                <Button type="submit" variant="default">Save</Button>
                <Button href="/admin?tab=media" variant="outline">
                  Cancel
                </Button>
              </div>
            </FieldSet>
          </form>
        </AdminFormDialog>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Media library</CardTitle>
          <CardDescription>
            Edit alt text or remove media items.
          </CardDescription>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
          {items.length === 0
            ? <p class="text-sm text-stone-500">No media yet.</p>
            : (
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    class="flex flex-col gap-2 border border-stone-200 dark:border-stone-700 rounded-lg p-3"
                  >
                    {item.id === deleteId && confirmDelete
                      ? (
                        <DeleteConfirm
                          label={item.alt || item.src}
                          action={`/api/media/${item.id}/delete`}
                          cancelHref="/admin?tab=media"
                        />
                      )
                      : (
                        <>
                          {PREVIEWABLE_TYPES.includes(item.type)
                            ? (
                              <img
                                src={item.src}
                                alt={item.alt ?? ""}
                                class="h-32 w-full object-cover rounded"
                              />
                            )
                            : (
                              <a
                                href={item.src}
                                target="_blank"
                                rel="noreferrer"
                                class="h-32 w-full flex items-center justify-center rounded bg-stone-100 dark:bg-stone-800 text-xs uppercase text-stone-500 truncate px-2"
                              >
                                {item.type}
                              </a>
                            )}

                          <span
                            class="text-xs text-stone-500 truncate"
                            title={item.src}
                          >
                            {item.src}
                          </span>

                          <form
                            method="POST"
                            action={`/api/media/${item.id}`}
                            class="flex gap-2"
                          >
                            <Input
                              name="alt"
                              defaultValue={item.alt ?? ""}
                              placeholder="Alt text"
                              class="flex-1"
                            />
                            <Button type="submit" size="sm" variant="outline">
                              Save
                            </Button>
                          </form>

                          <Button
                            href={`/admin?tab=media&edit=${item.id}&confirmDelete=1`}
                            size="sm"
                            variant="destructive"
                          >
                            Delete
                          </Button>
                        </>
                      )}
                  </div>
                ))}
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
