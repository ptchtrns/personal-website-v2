import type { ComponentChildren } from "preact";
import { Button } from "@/components/ui/button.tsx";
import { XmarkIcon } from "@/components/icons.tsx";

interface AdminFormDialogProps {
  open: boolean;
  closeHref: string;
  title: string;
  description?: string;
  children?: ComponentChildren;
}

/**
 * Pure SSR modal for admin add/edit forms. The backdrop and close button are
 * plain links back to `closeHref`, so opening and closing is a normal
 * navigation and needs no client-side JavaScript.
 */
export function AdminFormDialog(
  { open, closeHref, title, description, children }: AdminFormDialogProps,
) {
  if (!open) return null;

  return (
    <div class="fixed inset-0 z-50">
      <a
        href={closeHref}
        aria-label="Close"
        class="absolute inset-0 bg-black/50"
      />
      <div class="pointer-events-none relative flex min-h-full items-center justify-center p-4">
        <div class="pointer-events-auto relative w-full max-w-2xl max-h-[90vh]">
          <Button
            href={closeHref}
            variant="default"
            size="icon-sm"
            aria-label="Close"
            class="absolute -top-3 -right-3 rounded-full z-10"
          >
            <XmarkIcon />
          </Button>
          <div class="w-full max-h-[90vh] overflow-y-auto rounded-xl border bg-background text-foreground p-4 flex flex-col gap-4">
            <div>
              <h2 class="text-lg font-semibold leading-none">{title}</h2>
              {description && (
                <p class="text-sm text-muted-foreground mt-1.5">
                  {description}
                </p>
              )}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
