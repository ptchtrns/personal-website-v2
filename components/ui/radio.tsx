import type { JSX } from "preact";
import { cn } from "@/lib/utils.ts";

/**
 * A real `<input type="radio">` (visually hidden via `appearance-none`) with
 * a dot overlaid via the `checked:` variant, matching `checkbox.tsx`'s
 * approach: native semantics/keyboard behavior, no client-side JavaScript.
 */
export function Radio(
  { class: className, ...props }: Omit<JSX.IntrinsicElements["input"], "type">,
) {
  return (
    <span class="relative inline-flex size-4 shrink-0 items-center justify-center">
      <input
        type="radio"
        data-slot="radio"
        class={cn(
          "peer size-4 shrink-0 appearance-none rounded-full border border-input dark:bg-input/30 shadow-xs outline-none transition-shadow",
          "checked:border-primary",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className,
        )}
        {...props}
      />
      <span class="pointer-events-none absolute size-2 rounded-full bg-primary opacity-0 peer-checked:opacity-100" />
    </span>
  );
}
