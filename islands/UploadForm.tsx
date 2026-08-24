import type { JSX } from "preact";
import { useRef, useState } from "preact/hooks";
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
import type { MediaType } from "@/lib/media.ts";

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

interface UploadFormProps {
  onSuccess?: () => void;
}

export default function UploadForm({ onSuccess }: UploadFormProps = {}) {
  const [type, setType] = useState<MediaType>("image");
  const [file, setFile] = useState<File | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [alt, setAlt] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: JSX.TargetedEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (type === "link") {
        if (!linkUrl.trim()) {
          throw new Error("Please enter a link URL");
        }

        const res = await fetch("/api/media", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, alt, src: linkUrl.trim() }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to add link");
        }

        setLinkUrl("");
        setAlt("");
        setSuccess("Link added successfully!");
        setTimeout(() => setSuccess(""), 3000);
        onSuccess?.();
        return;
      }

      if (!file) {
        throw new Error("Please select a file");
      }
      if (file.type !== ACCEPT_BY_TYPE[type]) {
        throw new Error(`File must be of type ${ACCEPT_BY_TYPE[type]}`);
      }

      const res = await fetch("/api/media", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          alt,
          contentType: file.type,
          size: file.size,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to upload file");
      }

      const { presignedUrl } = await res.json();
      const putRes = await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
          "X-Amz-Tagging": "OriginalPhoto=True",
        },
        body: file,
      });
      if (!putRes.ok) {
        throw new Error("Failed to upload file to storage");
      }

      setFile(null);
      setAlt("");
      if (fileInputRef.current) fileInputRef.current.value = "";

      setSuccess("File uploaded successfully!");
      setTimeout(() => setSuccess(""), 3000);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload file");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media</CardTitle>
        <CardDescription>
          Upload images, profile pictures, audio and PDF files, or add a link,
          to the media library.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} class="flex flex-col gap-3">
          <FieldSet>
            <FieldGroup>
              <Field class="flex flex-col gap-1.5">
                <FieldLabel for="type">File type</FieldLabel>
                <Select
                  id="type"
                  name="type"
                  value={type}
                  onChange={(event) =>
                    setType(event.currentTarget.value as MediaType)}
                >
                  {MEDIA_TYPES.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </Select>
              </Field>

              {type === "link"
                ? (
                  <Field class="flex flex-col gap-1.5">
                    <FieldLabel for="linkUrl">URL</FieldLabel>
                    <Input
                      id="linkUrl"
                      type="url"
                      name="linkUrl"
                      placeholder="https://example.com"
                      value={linkUrl}
                      onInput={(event) => setLinkUrl(event.currentTarget.value)}
                      required
                    />
                  </Field>
                )
                : (
                  <Field class="flex flex-col gap-1.5">
                    <FieldLabel for="file">File</FieldLabel>
                    <Input
                      ref={fileInputRef}
                      id="file"
                      type="file"
                      name="file"
                      accept={ACCEPT_BY_TYPE[type]}
                      onChange={(event) =>
                        setFile(event.currentTarget.files?.[0] ?? null)}
                      required
                    />
                  </Field>
                )}
            </FieldGroup>

            <Field>
              <FieldLabel for="alt">Alt text</FieldLabel>
              <Textarea
                id="alt"
                name="alt"
                placeholder="Describe the file for accessibility"
                rows={3}
                value={alt}
                onInput={(event) => setAlt(event.currentTarget.value)}
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
              {loading
                ? (type === "link" ? "Adding..." : "Uploading...")
                : (type === "link" ? "Add Link" : "Upload File")}
            </Button>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  );
}
