import { type ComponentChildren, createContext, type JSX } from "preact";
import { useContext, useEffect } from "preact/hooks";
import { cn } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button.tsx";
import { XmarkIcon } from "@/components/icons.tsx";

interface DialogContextValue {
  onOpenChange: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialog(component: string) {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error(`<${component}> must be used inside <Dialog>`);
  return ctx;
}

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: ComponentChildren;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onOpenChange(false);
    }
    globalThis.addEventListener("keydown", onKeyDown);
    return () => globalThis.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <DialogContext.Provider value={{ onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogContent(
  { class: className, children, ...props }: JSX.IntrinsicElements["div"],
) {
  const { onOpenChange } = useDialog("DialogContent");

  return (
    <div
      data-slot="dialog-overlay"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => onOpenChange(false)}
    >
      <div class="relative w-full max-w-2xl max-h-[90vh]">
        <Button
          type="button"
          variant="default"
          size="icon-sm"
          onClick={() => onOpenChange(false)}
          aria-label="Close"
          class="absolute -top-3 -right-3 rounded-full z-10"
        >
          <XmarkIcon />
        </Button>
        <div
          data-slot="dialog-content"
          class={cn(
            "bg-background text-foreground w-full max-h-[90vh] overflow-y-auto rounded-xl border p-4 flex flex-col gap-4",
            className,
          )}
          onClick={(event) => event.stopPropagation()}
          {...props}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
