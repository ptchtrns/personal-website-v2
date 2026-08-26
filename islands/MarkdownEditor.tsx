import { useRef, useState } from "preact/hooks";
import { Button } from "@/components/ui/button.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";

interface MarkdownEditorProps {
  id: string;
  name: string;
  defaultValue?: string | null;
  rows?: number;
}

export default function MarkdownEditor(
  { id, name, defaultValue, rows = 6 }: MarkdownEditorProps,
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState(defaultValue ?? "");
  const [preview, setPreview] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  async function togglePreview() {
    if (preview !== null) {
      setPreview(null);
      return;
    }
    setLoadingPreview(true);
    try {
      const res = await fetch("/api/markdown-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdown: value }),
      });
      const data = await res.json();
      setPreview(data.html ?? "");
    } finally {
      setLoadingPreview(false);
    }
  }

  return (
    <div class="flex flex-col gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        class="self-end"
        onClick={togglePreview}
        disabled={loadingPreview}
      >
        {preview !== null ? "Edit" : "Preview"}
      </Button>

      {preview !== null && (
        <div
          class="markdown-content border border-stone-300 dark:border-stone-600 rounded-lg p-3 min-h-24"
          // deno-lint-ignore react-no-danger -- admin-authored markdown, rendered server-side by /api/markdown-preview
          dangerouslySetInnerHTML={{ __html: preview }}
        />
      )}
      <Textarea
        ref={textareaRef}
        id={id}
        name={name}
        rows={rows}
        value={value}
        onInput={(e) => setValue(e.currentTarget.value)}
        class={preview !== null ? "hidden" : undefined}
      />
    </div>
  );
}
