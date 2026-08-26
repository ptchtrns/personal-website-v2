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
import { AdminFormDialog } from "@/components/admin/AdminFormDialog.tsx";
import { DeleteConfirm } from "@/components/admin/DeleteConfirm.tsx";
import { ImagePicker } from "@/components/admin/ImagePicker.tsx";
import type { GalleryItem } from "@/lib/gallery.ts";
import type { MediaItem } from "@/lib/media.ts";

interface GalleryAdminProps {
  items: GalleryItem[];
  images: MediaItem[];
  editId: number | null;
  isNew: boolean;
  confirmDelete: boolean;
}

export default function GalleryAdmin(
  { items, images, editId, isNew, confirmDelete }: GalleryAdminProps,
) {
  const editing = editId !== null
    ? items.find((item) => item.id === editId) ?? null
    : null;

  return (
    <Card>
      <CardHeader class="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Gallery</CardTitle>
          <CardDescription>Manage the photo gallery.</CardDescription>
        </div>
        <Button href="/admin?tab=gallery&new=1" size="sm">Add photo</Button>
      </CardHeader>
      <CardContent class="flex flex-col gap-2">
        <AdminFormDialog
          open={isNew || editing !== null}
          closeHref="/admin?tab=gallery"
          title={editing ? "Edit photo" : "Add photo"}
          description="Manage the photo gallery."
        >
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
                  </FieldGroup>

                  <Field>
                    <FieldLabel>Image</FieldLabel>
                    <ImagePicker
                      name="imageId"
                      images={images}
                      selectedId={editing?.imageId ?? null}
                      allowNoImage={false}
                    />
                  </Field>

                  <div class="flex gap-2">
                    <Button type="submit" variant="default">
                      {editing ? "Save changes" : "Add photo"}
                    </Button>
                    <Button href="/admin?tab=gallery" variant="outline">
                      Cancel
                    </Button>
                  </div>
                </FieldSet>
              </form>
            )}
        </AdminFormDialog>

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
