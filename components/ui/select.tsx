import type { JSX } from "preact";
import { cn } from "@/lib/utils.ts";

/**
 * Native <select> styled to match the rest of the form controls. The Vue
 * version wrapped reka-ui's listbox primitive; a native control keeps the
 * markup server-rendered and needs no client-side JavaScript.
 */
export function Select(
  { class: className, children, ...props }: JSX.IntrinsicElements["select"],
) {
  return (
    <select
      data-slot="select"
      class={cn(
        "border-input dark:bg-input/30 flex h-9 w-full items-center justify-between rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function SelectItem(
  { class: className, ...props }: JSX.IntrinsicElements["option"],
) {
  return (
    <option
      data-slot="select-item"
      class={cn("bg-background text-foreground", className)}
      {...props}
    />
  );
}
