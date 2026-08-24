import type { JSX } from "preact";
import { useEffect, useState } from "preact/hooks";
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
import MediaPicker from "@/islands/MediaPicker.tsx";
import {
  RELEASE_TYPES,
  type ReleaseItem,
  type ReleaseType,
  type TrackItem,
} from "@/lib/releases.ts";

const RELEASE_TYPE_LABEL: Record<ReleaseType, string> = {
  album: "Album",
  ep: "EP",
  single: "Single",
};

const EMPTY_RELEASE_FORM = {
  title: "",
  type: "album" as ReleaseType,
  coverId: null as number | null,
  coverSrc: "",
};

const EMPTY_TRACK_FORM = {
  title: "",
  audioId: null as number | null,
  audioSrc: "",
};

function TrackEditor(
  { release, onChange }: { release: ReleaseItem; onChange: () => void },
) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_TRACK_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function startEdit(track: TrackItem) {
    setEditingId(track.id);
    setForm({
      title: track.title,
      audioId: track.audioId,
      audioSrc: track.audioSrc,
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_TRACK_FORM);
  }

  async function handleSubmit(event: JSX.TargetedEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!form.audioId) {
      setError("Please choose an audio file");
      return;
    }

    setLoading(true);
    try {
      const url = editingId ? `/api/tracks/${editingId}` : "/api/tracks";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          audioId: form.audioId,
          releaseId: release.id,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save track");
      }
      resetForm();
      onChange();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this track?")) return;
    const res = await fetch(`/api/tracks/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) onChange();
  }

  return (
    <div class="flex flex-col gap-3 border-t border-stone-200 dark:border-stone-700 pt-3">
      <div class="flex flex-col gap-2">
        {release.tracks.map((track) => (
          <div
            key={track.id}
            class="flex items-center justify-between gap-3"
          >
            <p class="text-sm truncate">{track.title}</p>
            <div class="flex gap-2 shrink-0">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => startEdit(track)}
              >
                Edit
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(track.id)}
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

      <form onSubmit={handleSubmit} class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <Input
            value={form.title}
            placeholder="Track title"
            onInput={(e) => setForm({ ...form, title: e.currentTarget.value })}
            required
            class="flex-1"
          />
          <MediaPicker
            selectedIds={form.audioId ? [form.audioId] : []}
            typeFilter="audio"
            multiple={false}
            triggerLabel={form.audioId ? "Change audio" : "Choose audio"}
            onConfirm={([item]) =>
              item &&
              setForm({ ...form, audioId: item.id, audioSrc: item.src })}
          />
        </div>
        {form.audioSrc && (
          <span class="text-sm text-stone-500 truncate">
            {form.audioSrc}
          </span>
        )}
        {error && (
          <div class="p-2 bg-red-100 border border-red-300 rounded text-red-900 text-sm">
            {error}
          </div>
        )}
        <div class="flex gap-2">
          <Button type="submit" size="sm" disabled={loading} variant="ghost">
            {loading ? "Saving..." : editingId ? "Save track" : "Add track"}
          </Button>
          {editingId && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={resetForm}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

export default function ReleasesAdmin() {
  const [releases, setReleases] = useState<ReleaseItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_RELEASE_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function refresh() {
    const res = await fetch("/api/releases", { credentials: "include" });
    if (res.ok) setReleases(await res.json());
  }

  useEffect(() => {
    refresh();
  }, []);

  function startEdit(release: ReleaseItem) {
    setEditingId(release.id);
    setForm({
      title: release.title,
      type: release.type,
      coverId: release.coverId,
      coverSrc: release.coverSrc ?? "",
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_RELEASE_FORM);
  }

  async function handleSubmit(event: JSX.TargetedEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    setLoading(true);
    try {
      const url = editingId ? `/api/releases/${editingId}` : "/api/releases";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          type: form.type,
          coverId: form.coverId,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save release");
      }
      resetForm();
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this release and all its tracks?")) return;
    const res = await fetch(`/api/releases/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) await refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingId ? "Edit release" : "Add release"}</CardTitle>
        <CardDescription>
          Manage albums, EPs and singles, and the tracks within them.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-6">
        <form onSubmit={handleSubmit} class="flex flex-col gap-3">
          <FieldSet>
            <FieldGroup>
              <Field class="flex flex-col gap-1.5">
                <FieldLabel for="release-title">Title</FieldLabel>
                <Input
                  id="release-title"
                  value={form.title}
                  onInput={(e) =>
                    setForm({ ...form, title: e.currentTarget.value })}
                  required
                />
              </Field>

              <Field class="flex flex-col gap-1.5">
                <FieldLabel for="release-type">Type</FieldLabel>
                <Select
                  id="release-type"
                  value={form.type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      type: e.currentTarget.value as ReleaseType,
                    })}
                >
                  {RELEASE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {RELEASE_TYPE_LABEL[type]}
                    </SelectItem>
                  ))}
                </Select>
              </Field>

              <Field class="flex flex-col gap-1.5">
                <FieldLabel>Cover image (optional)</FieldLabel>
                <div class="flex items-center gap-2">
                  {form.coverSrc && (
                    <img
                      src={form.coverSrc}
                      alt=""
                      class="h-10 w-10 object-cover rounded"
                    />
                  )}
                  <MediaPicker
                    selectedIds={form.coverId ? [form.coverId] : []}
                    typeFilter="image"
                    multiple={false}
                    triggerLabel={form.coverId
                      ? "Change cover"
                      : "Choose cover"}
                    onConfirm={([item]) =>
                      item &&
                      setForm({
                        ...form,
                        coverId: item.id,
                        coverSrc: item.src,
                      })}
                  />
                  {form.coverId && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setForm({ ...form, coverId: null, coverSrc: "" })}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </Field>
            </FieldGroup>

            {error && (
              <div class="p-3 bg-red-100 border border-red-300 rounded text-red-900 text-sm">
                {error}
              </div>
            )}

            <div class="flex gap-2">
              <Button type="submit" disabled={loading} variant="ghost">
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Save changes"
                  : "Add release"}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </FieldSet>
        </form>

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
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(release)}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(release.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>

              <TrackEditor release={release} onChange={refresh} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
