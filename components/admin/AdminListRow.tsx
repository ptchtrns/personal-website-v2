import { Button } from "@/components/ui/button.tsx";

interface AdminListRowProps {
  editHref: string;
  deleteHref: string;
  logoSrc?: string | null;
  title: string;
  subtitle: string;
  subtitleClass?: string;
}

/** Shared row for admin resource lists: optional logo, title/subtitle, and an Edit/Delete button pair. */
export function AdminListRow(
  { editHref, deleteHref, logoSrc, title, subtitle, subtitleClass }:
    AdminListRowProps,
) {
  return (
    <div class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-3 min-w-0">
        {logoSrc && (
          <img
            src={logoSrc}
            alt=""
            class="h-10 w-10 object-cover rounded shrink-0"
          />
        )}
        <div class="min-w-0">
          <p class="font-medium truncate">{title}</p>
          <p class={subtitleClass ?? "text-sm text-stone-500 truncate"}>
            {subtitle}
          </p>
        </div>
      </div>
      <div class="flex gap-2 shrink-0">
        <Button href={editHref} size="sm" variant="outline">
          Edit
        </Button>
        <Button href={deleteHref} size="sm" variant="destructive">
          Delete
        </Button>
      </div>
    </div>
  );
}
