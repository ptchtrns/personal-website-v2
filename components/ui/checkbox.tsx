import type { JSX } from "preact";
import { cn } from "@/lib/utils.ts";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FaIcon } from "@/components/icon.tsx";

/**
 * A real `<input type="checkbox">` (visually hidden via `appearance-none`)
 * with a check icon overlaid via the `checked:` variant, rather than a
 * Radix-style button — keeps native checkbox semantics/keyboard behavior
 * and needs no client-side JavaScript, matching this project's other form
 * controls (see `select.tsx`).
 */
export function Checkbox(
  { class: className, ...props }: Omit<JSX.IntrinsicElements["input"], "type">,
) {
  return (
    <span class="relative inline-flex size-4 shrink-0 items-center justify-center">
      <input
        type="checkbox"
        data-slot="checkbox"
        class={cn(
          "peer size-4 shrink-0 appearance-none rounded-[4px] border border-input dark:bg-input/30 shadow-xs outline-none transition-shadow",
          "checked:bg-primary checked:border-primary",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className,
        )}
        {...props}
      />
      <FaIcon
        icon={faCheck}
        class="pointer-events-none absolute size-3 text-primary-foreground opacity-0 peer-checked:opacity-100"
      />
    </span>
  );
}
