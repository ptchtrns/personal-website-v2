import type { JSX } from "preact";
import { useState } from "preact/hooks";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";

const aspectRatios = ["16/9", "4/3", "3/2", "4/5"];

export default function UploadForm() {
  const [image, setImage] = useState<File | null>(null);
  const [aspectRatio, setAspectRatio] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: JSX.TargetedEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!image) {
        throw new Error("Please select an image");
      }

      const res = await fetch("/api/photos", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          aspect_ratio: aspectRatio,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to upload image");
      }

      const { presigned_url } = await res.json();
      await fetch(presigned_url, {
        method: "PUT",
        headers: {
          "Content-Type": image.type,
          "X-Amz-Tagging": "OriginalPhoto=True",
        },
        body: image,
      });

      // Reset form on success
      setImage(null);
      setAspectRatio("");
      setTitle("");
      setDescription("");

      setSuccess("Image uploaded successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Image upload</CardTitle>
        <CardDescription>
          Upload and manage your photos and audio files.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="photos">
          <TabsList>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
          </TabsList>
          <TabsContent value="photos">
            <form onSubmit={handleSubmit} class="flex flex-col gap-3">
              <FieldSet>
                <FieldGroup>
                  <Field class="flex flex-col gap-1.5">
                    <FieldLabel for="image">Image File</FieldLabel>
                    <Input
                      id="image"
                      type="file"
                      name="image"
                      accept="image/jpeg"
                      onChange={(event) =>
                        setImage(event.currentTarget.files?.[0] ?? null)}
                      required
                    />
                  </Field>
                </FieldGroup>

                <Field>
                  <FieldLabel for="aspect_ratio">Aspect Ratio</FieldLabel>
                  <Select
                    id="aspect_ratio"
                    name="aspect_ratio"
                    value={aspectRatio}
                    onChange={(event) =>
                      setAspectRatio(event.currentTarget.value)}
                  >
                    <SelectItem value="" disabled>
                      Select a aspect ratio
                    </SelectItem>
                    {aspectRatios.map((ratio) => (
                      <SelectItem key={ratio} value={ratio}>
                        {ratio.replace("/", ":")}
                      </SelectItem>
                    ))}
                  </Select>
                </Field>

                <Field>
                  <FieldLabel for="title">Title</FieldLabel>
                  <Input
                    id="title"
                    type="text"
                    name="title"
                    placeholder="Image title"
                    value={title}
                    onInput={(event) => setTitle(event.currentTarget.value)}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel for="description">Description</FieldLabel>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Image description"
                    rows={4}
                    value={description}
                    onInput={(event) =>
                      setDescription(event.currentTarget.value)}
                    class="border border-stone-300 dark:border-stone-600 p-1.5 rounded-lg"
                  />
                </Field>

                {error && (
                  <div class="p-3 bg-red-100 border border-red-300 rounded text-red-900 text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div class="p-3 bg-green-100 border border-green-300 rounded text-green-900 text-sm">
                    {success}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  class="w-full"
                  variant="ghost"
                >
                  {loading ? "Uploading..." : "Upload Image"}
                </Button>
              </FieldSet>
            </form>
          </TabsContent>
          <TabsContent value="audio">Audio</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
