import type { JSX } from "preact";
import { cn } from "@/lib/utils.ts";

type SeparatorProps = JSX.IntrinsicElements["div"] & {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
};

export function Separator(
  {
    class: className,
    orientation = "horizontal",
    decorative = true,
    ...props
  }: SeparatorProps,
) {
  return (
    <div
      data-slot="separator"
      data-orientation={orientation}
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      class={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className,
      )}
      {...props}
    />
  );
}
