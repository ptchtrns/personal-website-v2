import type { JSX } from "preact";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils.ts";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "border border-transparent text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-linear-to-r from-zinc-100 via-zinc-100 to-zinc-50 dark:from-zinc-800 dark:via-zinc-800 dark:to-zinc-900 hover:border-zinc-200 dark:hover:border-zinc-600 rounded-lg active:scale-99",
        "ghost-muted":
          "text-zinc-400 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 active:scale-92",
        "ghost-active":
          "text-white bg-zinc-400 dark:bg-zinc-600 rounded-full hover:bg-zinc-400 hover:text-white dark:hover:bg-zinc-600 active:scale-92",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

type ButtonProps =
  & Omit<JSX.IntrinsicElements["button"], "size">
  & ButtonVariants;

type AnchorProps =
  & Omit<JSX.IntrinsicElements["a"], "size">
  & ButtonVariants
  & { href: string };

export function Button(props: ButtonProps | AnchorProps) {
  const { variant, size, class: className, ...rest } = props;
  const classes = cn(buttonVariants({ variant, size }), className);

  if ("href" in rest && rest.href !== undefined) {
    return (
      <a
        data-slot="button"
        data-variant={variant}
        data-size={size}
        class={classes}
        {...rest as JSX.IntrinsicElements["a"]}
      />
    );
  }

  return (
    <button
      data-slot="button"
      data-variant={variant}
      data-size={size}
      class={classes}
      {...rest as JSX.IntrinsicElements["button"]}
    />
  );
}
