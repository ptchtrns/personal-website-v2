import type { JSX } from "preact";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { cn } from "@/lib/utils.ts";

export type IconProps =
  & Omit<JSX.IntrinsicElements["svg"], "width">
  & { icon: IconDefinition; width?: string };

/** Renders a Font Awesome icon definition as an inline SVG. */
export function FaIcon(
  { icon, width, class: className, ...props }: IconProps,
) {
  const [w, h, , , path] = icon.icon;
  const d = Array.isArray(path) ? path[path.length - 1] : path;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${w} ${h}`}
      width={width ?? `${w / h}em`}
      height="1em"
      aria-hidden="true"
      focusable="false"
      class={cn("inline-block", className)}
      {...props}
    >
      <path fill="currentColor" d={d} />
    </svg>
  );
}
