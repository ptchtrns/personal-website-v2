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
import { AdminListRow } from "@/components/admin/AdminListRow.tsx";
import { DeleteConfirm } from "@/components/admin/DeleteConfirm.tsx";
import { ImagePickerField } from "@/components/admin/ImagePickerField.tsx";
import { findById, toDateInputValue } from "@/lib/utils.ts";
import {
  RELEASE_TYPES,
  type ReleaseItem,
  type ReleaseType,
  type TrackItem,
} from "@/lib/releases.shared.ts";
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
  isNew: boolean;
  confirmDelete: boolean;
  trackEditId: number | null;
  trackNewReleaseId: number | null;
  trackConfirmDelete: boolean;
}

function TrackEditor(
  { release, audio, trackEditId, trackNewReleaseId, trackConfirmDelete }: {
    release: ReleaseItem;
    audio: MediaItem[];
    trackEditId: number | null;
    trackNewReleaseId: number | null;
    trackConfirmDelete: boolean;
  },
) {
  const editingTrack: TrackItem | null = findById(
    release.tracks,
    trackEditId,
  );
  const isNewTrack = trackNewReleaseId === release.id;
  const closeHref = `/admin?tab=music#release-${release.id}`;

  return (
    <div class="flex flex-col gap-3 border-t border-zinc-200 dark:border-zinc-700 pt-3">
      <div class="flex items-center justify-between gap-3">
        <p class="text-sm font-medium">Tracks</p>
        <Button
          href={`/admin?tab=music&trackNew=${release.id}#release-${release.id}`}
          size="sm"
          variant="outline"
        >
          Add track
        </Button>
      </div>

      <div class="flex flex-col gap-2">
        {release.tracks.map((track) => (
          <div key={track.id} class="flex items-center justify-between gap-3">
            <p class="text-sm truncate">{track.title}</p>
            <div class="flex gap-2 shrink-0">
              <Button
                href={`/admin?tab=music&trackEdit=${track.id}#release-${release.id}`}
                size="sm"
                variant="outline"
              >
                Edit
              </Button>
              <Button
                href={`/admin?tab=music&trackEdit=${track.id}&trackConfirmDelete=1#release-${release.id}`}
                size="sm"
                variant="destructive"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
        {release.tracks.length === 0 && (
          <p class="text-sm text-zinc-500">No tracks yet.</p>
        )}
      </div>

      <AdminFormDialog
        open={isNewTrack || editingTrack !== null}
        closeHref={closeHref}
        title={editingTrack ? "Edit track" : "Add track"}
        description={release.title}
      >
        {editingTrack && trackConfirmDelete
          ? (
            <DeleteConfirm
              label={editingTrack.title}
              action={`/api/tracks/${editingTrack.id}/delete`}
              cancelHref={`/admin?tab=music&trackEdit=${editingTrack.id}#release-${release.id}`}
            />
          )
          : (
            <form
              method="POST"
              action={editingTrack
                ? `/api/tracks/${editingTrack.id}`
                : "/api/tracks"}
              class="flex flex-col gap-3"
            >
              <input type="hidden" name="releaseId" value={release.id} />
              <FieldSet>
                <FieldGroup>
                  <Field class="flex flex-col gap-1.5">
                    <FieldLabel for={`track-title-${release.id}`}>
                      Track title
                    </FieldLabel>
                    <Input
                      id={`track-title-${release.id}`}
                      name="title"
                      defaultValue={editingTrack?.title ?? ""}
                      required
                    />
                  </Field>

                  <Field class="flex flex-col gap-1.5">
                    <FieldLabel for={`track-audio-${release.id}`}>
                      Audio
                    </FieldLabel>
                    <Select
                      id={`track-audio-${release.id}`}
                      name="audioId"
                      required
                    >
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
                  </Field>
                </FieldGroup>

                <div class="flex gap-2">
                  <Button type="submit" variant="default">
                    {editingTrack ? "Save track" : "Add track"}
                  </Button>
                  <Button href={closeHref} variant="outline">
                    Cancel
                  </Button>
                </div>
              </FieldSet>
            </form>
          )}
      </AdminFormDialog>
    </div>
  );
}

export default function MusicAdmin(
  {
    releases,
    images,
    audio,
    editId,
    isNew,
    confirmDelete,
    trackEditId,
    trackNewReleaseId,
    trackConfirmDelete,
  }: MusicAdminProps,
) {
  const editing = findById(releases, editId);

  return (
    <Card>
      <CardHeader class="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Music</CardTitle>
          <CardDescription>
            Manage albums, EPs and singles, and the tracks within them.
          </CardDescription>
        </div>
        <Button href="/admin?tab=music&new=1" size="sm">Add release</Button>
      </CardHeader>
      <CardContent class="flex flex-col gap-2">
        <AdminFormDialog
          open={isNew || editing !== null}
          closeHref="/admin?tab=music"
          title={editing ? "Edit release" : "Add release"}
          description="Manage albums, EPs and singles."
        >
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
                action={editing
                  ? `/api/releases/${editing.id}`
                  : "/api/releases"}
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
                      <FieldLabel for="release-description">
                        Description (optional)
                      </FieldLabel>
                      <Textarea
                        id="release-description"
                        name="description"
                        rows={2}
                        defaultValue={editing?.description ?? ""}
                        class="border border-zinc-300 dark:border-zinc-600 p-1.5 rounded-lg"
                      />
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
                        class="border border-zinc-300 dark:border-zinc-600 p-1.5 rounded-lg"
                      />
                    </Field>

                    <Field class="flex flex-col gap-1.5">
                      <FieldLabel for="release-createdAt">Date</FieldLabel>
                      <Input
                        id="release-createdAt"
                        type="text"
                        inputMode="numeric"
                        placeholder="DD-MM-YYYY"
                        pattern="[0-9]{2}-[0-9]{2}-[0-9]{4}"
                        name="createdAt"
                        defaultValue={toDateInputValue(
                          editing?.createdAt ?? new Date(),
                        )}
                        required
                      />
                    </Field>
                  </FieldGroup>

                  <ImagePickerField
                    label="Cover image"
                    name="coverId"
                    images={images}
                    selectedId={editing?.coverId ?? null}
                  />

                  <div class="flex gap-2">
                    <Button type="submit" variant="default">
                      {editing ? "Save changes" : "Add release"}
                    </Button>
                    <Button href="/admin?tab=music" variant="outline">
                      Cancel
                    </Button>
                  </div>
                </FieldSet>
              </form>
            )}
        </AdminFormDialog>

        <div class="flex flex-col gap-3">
          {releases.map((release) => (
            <div
              key={release.id}
              id={`release-${release.id}`}
              class="flex flex-col gap-3 border border-zinc-200 dark:border-zinc-700 rounded-lg p-3"
            >
              <AdminListRow
                editHref={`/admin?tab=music&edit=${release.id}`}
                deleteHref={`/admin?tab=music&edit=${release.id}&confirmDelete=1`}
                logoSrc={release.coverSrc}
                title={release.title}
                subtitle={RELEASE_TYPE_LABEL[release.type]}
                subtitleClass="text-xs uppercase text-zinc-500"
              />

              <TrackEditor
                release={release}
                audio={audio}
                trackEditId={trackEditId}
                trackNewReleaseId={trackNewReleaseId}
                trackConfirmDelete={trackConfirmDelete}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
