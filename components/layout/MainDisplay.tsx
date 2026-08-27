import type { JSX } from "preact";
import { cn } from "@/lib/utils.ts";

export function MainDisplay(
  { class: className, ...props }: JSX.IntrinsicElements["main"],
) {
  return <main class={cn("my-16 min-h-full", className)} {...props} />;
}
