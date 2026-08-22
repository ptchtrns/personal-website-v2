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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";

export default function UploadForm() {
  const [image, setImage] = useState<File | null>(null);
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

      const res = await fetch("/api/gallery", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to upload image");
      }

      const { presignedUrl } = await res.json();
      await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": image.type,
          "X-Amz-Tagging": "OriginalPhoto=True",
        },
        body: image,
      });

      // Reset form on success
      setImage(null);
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
