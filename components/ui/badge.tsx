import type { JSX } from "preact";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils.ts";

export const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type BadgeProps =
  & JSX.IntrinsicElements["span"]
  & VariantProps<typeof badgeVariants>;

export function Badge(
  { class: className, variant, ...props }: BadgeProps,
) {
  return (
    <span
      data-slot="badge"
      class={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}
