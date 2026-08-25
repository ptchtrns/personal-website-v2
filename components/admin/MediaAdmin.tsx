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
import { DeleteConfirm } from "@/components/admin/DeleteConfirm.tsx";
import type { MediaItem, MediaType } from "@/lib/media.ts";

const PREVIEWABLE_TYPES: MediaType[] = ["image", "pfp"];

const MEDIA_TYPES: { value: MediaType; label: string }[] = [
  { value: "image", label: "Image" },
  { value: "pfp", label: "Profile picture" },
  { value: "audio", label: "Audio" },
  { value: "pdf", label: "PDF" },
  { value: "link", label: "Link" },
];

const ACCEPT_BY_TYPE: Record<MediaType, string> = {
  image: "image/avif",
  pfp: "image/avif",
  audio: "audio/mpeg",
  pdf: "application/pdf",
  link: "",
};

interface MediaAdminProps {
  items: MediaItem[];
  deleteId: number | null;
  confirmDelete: boolean;
}

export default function MediaAdmin(
  { items, deleteId, confirmDelete }: MediaAdminProps,
) {
  return (
    <div class="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Media</CardTitle>
          <CardDescription>
            Upload an image, profile picture, audio or PDF file, or add a link,
            to the media library. For file uploads, select a file type and
            choose a file; for links, select "Link" and fill in the URL.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                    {MEDIA_TYPES.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </Select>
                </Field>

                <Field class="flex flex-col gap-1.5">
                  <FieldLabel for="linkUrl">
                    URL (only used when type is "Link")
                  </FieldLabel>
                  <Input
                    id="linkUrl"
                    type="url"
                    name="linkUrl"
                    placeholder="https://example.com"
                  />
                </Field>

                <Field class="flex flex-col gap-1.5">
                  <FieldLabel for="file">
                    File (only used when type isn't "Link")
                  </FieldLabel>
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

              <Button type="submit" class="w-full" variant="default">
                Save
              </Button>
            </FieldSet>
          </form>
        </CardContent>
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
