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
import { DeleteConfirm } from "@/components/admin/DeleteConfirm.tsx";
import type { GalleryItem } from "@/lib/gallery.ts";
import type { MediaItem } from "@/lib/media.ts";

interface GalleryAdminProps {
  items: GalleryItem[];
  images: MediaItem[];
  editId: number | null;
  confirmDelete: boolean;
}

export default function GalleryAdmin(
  { items, images, editId, confirmDelete }: GalleryAdminProps,
) {
  const editing = editId !== null
    ? items.find((item) => item.id === editId) ?? null
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editing ? "Edit photo" : "Add photo"}</CardTitle>
        <CardDescription>Manage the photo gallery.</CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-6">
        {editing && confirmDelete
          ? (
            <DeleteConfirm
              label={editing.description || "this photo"}
              action={`/api/gallery/${editing.id}/delete`}
              cancelHref={`/admin?tab=gallery&edit=${editing.id}`}
            />
          )
          : (
            <form
              method="POST"
              action={editing ? `/api/gallery/${editing.id}` : "/api/gallery"}
              class="flex flex-col gap-3"
            >
              <FieldSet>
                <FieldGroup>
                  <Field class="flex flex-col gap-1.5">
                    <FieldLabel for="description">Description</FieldLabel>
                    <Input
                      id="description"
                      name="description"
                      defaultValue={editing?.description ?? ""}
                    />
                  </Field>

                  <Field class="flex flex-col gap-1.5">
                    <FieldLabel for="imageId">Image</FieldLabel>
                    <Select id="imageId" name="imageId" required>
                      <SelectItem value="" disabled selected={!editing}>
                        Choose an image…
                      </SelectItem>
                      {images.map((image) => (
                        <SelectItem
                          key={image.id}
                          value={image.id}
                          selected={editing?.imageId === image.id}
                        >
                          {image.alt || image.src}
                        </SelectItem>
                      ))}
                    </Select>
                  </Field>
                </FieldGroup>

                <div class="flex gap-2">
                  <Button type="submit" variant="default">
                    {editing ? "Save changes" : "Add photo"}
                  </Button>
                  {editing && (
                    <Button href="/admin?tab=gallery" variant="outline">
                      Cancel
                    </Button>
                  )}
                </div>
              </FieldSet>
            </form>
          )}

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              class="flex flex-col gap-2 border border-stone-200 dark:border-stone-700 rounded-lg p-3"
            >
              <img
                src={item.src}
                alt={item.description ?? ""}
                class="h-32 w-full object-cover rounded"
              />
              <p class="text-sm truncate">{item.description || "—"}</p>
              <div class="flex gap-2">
                <Button
                  href={`/admin?tab=gallery&edit=${item.id}`}
                  size="sm"
                  variant="outline"
                >
                  Edit
                </Button>
                <Button
                  href={`/admin?tab=gallery&edit=${item.id}&confirmDelete=1`}
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
