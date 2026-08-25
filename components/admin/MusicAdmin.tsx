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
import {
  RELEASE_TYPES,
  type ReleaseItem,
  type ReleaseType,
  type TrackItem,
} from "@/lib/releases.ts";
import type { MediaItem } from "@/lib/media.ts";

const RELEASE_TYPE_LABEL: Record<ReleaseType, string> = {
  album: "Album",
  ep: "EP",
  single: "Single",
};

interface MusicAdminProps {
  releases: ReleaseItem[];
  images: MediaItem[];
  audio: MediaItem[];
  editId: number | null;
  confirmDelete: boolean;
  trackEditId: number | null;
  trackConfirmDelete: boolean;
}

function TrackEditor(
  { release, audio, trackEditId, trackConfirmDelete }: {
    release: ReleaseItem;
    audio: MediaItem[];
    trackEditId: number | null;
    trackConfirmDelete: boolean;
  },
) {
  const editingTrack: TrackItem | null =
    release.tracks.find((track) => track.id === trackEditId) ?? null;

  return (
    <div class="flex flex-col gap-3 border-t border-stone-200 dark:border-stone-700 pt-3">
      <div class="flex flex-col gap-2">
        {release.tracks.map((track) => (
          <div key={track.id} class="flex items-center justify-between gap-3">
            <p class="text-sm truncate">{track.title}</p>
            <div class="flex gap-2 shrink-0">
              <Button
                href={`/admin?tab=music&trackEdit=${track.id}`}
                size="sm"
                variant="outline"
              >
                Edit
              </Button>
              <Button
                href={`/admin?tab=music&trackEdit=${track.id}&trackConfirmDelete=1`}
                size="sm"
                variant="destructive"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
        {release.tracks.length === 0 && (
          <p class="text-sm text-stone-500">No tracks yet.</p>
        )}
      </div>

      {editingTrack && trackConfirmDelete
        ? (
          <DeleteConfirm
            label={editingTrack.title}
            action={`/api/tracks/${editingTrack.id}/delete`}
            cancelHref={`/admin?tab=music&trackEdit=${editingTrack.id}`}
          />
        )
        : (
          <form
            method="POST"
            action={editingTrack
              ? `/api/tracks/${editingTrack.id}`
              : "/api/tracks"}
            class="flex flex-col gap-2"
          >
            <input type="hidden" name="releaseId" value={release.id} />
            <div class="flex items-center gap-2">
              <Input
                name="title"
                placeholder="Track title"
                defaultValue={editingTrack?.title ?? ""}
                required
                class="flex-1"
              />
              <Select name="audioId" required class="max-w-56">
                <SelectItem value="" disabled selected={!editingTrack}>
                  Choose audio…
                </SelectItem>
                {audio.map((item) => (
                  <SelectItem
                    key={item.id}
                    value={item.id}
                    selected={editingTrack?.audioId === item.id}
                  >
                    {item.alt || item.src}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div class="flex gap-2">
              <Button type="submit" size="sm" variant="ghost">
                {editingTrack ? "Save track" : "Add track"}
              </Button>
              {editingTrack && (
                <Button href="/admin?tab=music" size="sm" variant="outline">
                  Cancel
                </Button>
              )}
            </div>
          </form>
        )}
    </div>
  );
}

export default function MusicAdmin(
  {
    releases,
    images,
    audio,
    editId,
    confirmDelete,
    trackEditId,
    trackConfirmDelete,
  }: MusicAdminProps,
) {
  const editing = editId !== null
    ? releases.find((release) => release.id === editId) ?? null
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editing ? "Edit release" : "Add release"}</CardTitle>
        <CardDescription>
          Manage albums, EPs and singles, and the tracks within them.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-6">
        {editing && confirmDelete
          ? (
            <DeleteConfirm
              label={editing.title}
              action={`/api/releases/${editing.id}/delete`}
              cancelHref={`/admin?tab=music&edit=${editing.id}`}
            />
          )
          : (
            <form
              method="POST"
              action={editing ? `/api/releases/${editing.id}` : "/api/releases"}
              class="flex flex-col gap-3"
            >
              <FieldSet>
                <FieldGroup>
                  <Field class="flex flex-col gap-1.5">
                    <FieldLabel for="release-title">Title</FieldLabel>
                    <Input
                      id="release-title"
                      name="title"
                      defaultValue={editing?.title ?? ""}
                      required
                    />
                  </Field>

                  <Field class="flex flex-col gap-1.5">
                    <FieldLabel for="release-type">Type</FieldLabel>
                    <Select id="release-type" name="type">
                      {RELEASE_TYPES.map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          selected={(editing?.type ?? "album") === type}
                        >
                          {RELEASE_TYPE_LABEL[type]}
                        </SelectItem>
                      ))}
                    </Select>
                  </Field>

                  <Field class="flex flex-col gap-1.5">
                    <FieldLabel for="release-cover">
                      Cover image (optional)
                    </FieldLabel>
                    <Select id="release-cover" name="coverId">
                      <SelectItem value="" selected={!editing?.coverId}>
                        No cover
                      </SelectItem>
                      {images.map((image) => (
                        <SelectItem
                          key={image.id}
                          value={image.id}
                          selected={editing?.coverId === image.id}
                        >
                          {image.alt || image.src}
                        </SelectItem>
                      ))}
                    </Select>
                  </Field>

                  <Field class="flex flex-col gap-1.5">
                    <FieldLabel for="release-links">
                      Streaming links (one per line)
                    </FieldLabel>
                    <Textarea
                      id="release-links"
                      name="links"
                      rows={4}
                      defaultValue={(editing?.links ?? []).join("\n")}
                      class="border border-stone-300 dark:border-stone-600 p-1.5 rounded-lg"
                    />
                  </Field>
                </FieldGroup>

                <div class="flex gap-2">
                  <Button type="submit" variant="ghost">
                    {editing ? "Save changes" : "Add release"}
                  </Button>
                  {editing && (
                    <Button href="/admin?tab=music" variant="outline">
                      Cancel
                    </Button>
                  )}
                </div>
              </FieldSet>
            </form>
          )}

        <div class="flex flex-col gap-3">
          {releases.map((release) => (
            <div
              key={release.id}
              class="flex flex-col gap-3 border border-stone-200 dark:border-stone-700 rounded-lg p-3"
            >
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-3 min-w-0">
                  {release.coverSrc && (
                    <img
                      src={release.coverSrc}
                      alt=""
                      class="h-10 w-10 object-cover rounded shrink-0"
                    />
                  )}
                  <div class="min-w-0">
                    <p class="font-medium truncate">{release.title}</p>
                    <p class="text-xs uppercase text-stone-500">
                      {RELEASE_TYPE_LABEL[release.type]}
                    </p>
                  </div>
                </div>
                <div class="flex gap-2 shrink-0">
                  <Button
                    href={`/admin?tab=music&edit=${release.id}`}
                    size="sm"
                    variant="outline"
                  >
                    Edit
                  </Button>
                  <Button
                    href={`/admin?tab=music&edit=${release.id}&confirmDelete=1`}
                    size="sm"
                    variant="destructive"
                  >
                    Delete
                  </Button>
                </div>
              </div>

              <TrackEditor
                release={release}
                audio={audio}
                trackEditId={trackEditId}
                trackConfirmDelete={trackConfirmDelete}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
