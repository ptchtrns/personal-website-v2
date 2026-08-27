import type { JSX } from "preact";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils.ts";
import { Label } from "@/components/ui/label.tsx";
import { Separator } from "@/components/ui/separator.tsx";

type DivProps = JSX.IntrinsicElements["div"];

export const fieldVariants = cva(
  "group/field flex w-full gap-3 data-[invalid=true]:text-destructive",
  {
    variants: {
      orientation: {
        vertical: "flex-col [&>*]:w-full [&>.sr-only]:w-auto",
        horizontal:
          "flex-row items-center [&>[data-slot=field-label]]:flex-auto has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        responsive:
          "flex-col [&>*]:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto @md/field-group:[&>[data-slot=field-label]]:flex-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  },
);

export type FieldVariants = VariantProps<typeof fieldVariants>;

export function Field(
  { class: className, orientation, ...props }: DivProps & FieldVariants,
) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      class={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  );
}

export function FieldSet(
  { class: className, ...props }: JSX.IntrinsicElements["fieldset"],
) {
  return (
    <fieldset
      data-slot="field-set"
      class={cn(
        "flex flex-col gap-6",
        "has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
        className,
      )}
      {...props}
    />
  );
}

export function FieldGroup({ class: className, ...props }: DivProps) {
  return (
    <div
      data-slot="field-group"
      class={cn(
        "group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4",
        className,
      )}
      {...props}
    />
  );
}

export function FieldLabel(
  { class: className, ...props }: JSX.IntrinsicElements["label"],
) {
  return (
    <Label
      data-slot="field-label"
      class={cn(
        "group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4",
        "has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-primary dark:has-data-[state=checked]:bg-primary/10",
        className,
      )}
      {...props}
    />
  );
}

export function FieldTitle({ class: className, ...props }: DivProps) {
  return (
    <div
      data-slot="field-label"
      class={cn(
        "flex w-fit items-center gap-2 text-sm leading-snug font-medium group-data-[disabled=true]/field:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function FieldContent({ class: className, ...props }: DivProps) {
  return (
    <div
      data-slot="field-content"
      class={cn(
        "group/field-content flex flex-1 flex-col gap-1.5 leading-snug",
        className,
      )}
      {...props}
    />
  );
}

export function FieldDescription(
  { class: className, ...props }: JSX.IntrinsicElements["p"],
) {
  return (
    <p
      data-slot="field-description"
      class={cn(
        "text-muted-foreground text-sm leading-normal font-normal group-has-[[data-orientation=horizontal]]/field:text-balance",
        "last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className,
      )}
      {...props}
    />
  );
}

export function FieldLegend(
  { class: className, variant, ...props }:
    & JSX.IntrinsicElements["legend"]
    & { variant?: "legend" | "label" },
) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      class={cn(
        "mb-3 font-medium",
        "data-[variant=legend]:text-base",
        "data-[variant=label]:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export function FieldError(
  { class: className, children, ...props }: DivProps,
) {
  if (!children) return null;

  return (
    <div
      role="alert"
      data-slot="field-error"
      class={cn("text-destructive text-sm font-normal", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function FieldSeparator(
  { class: className, children, ...props }: DivProps,
) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      class={cn(
        "relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2",
        className,
      )}
      {...props}
    >
      <Separator class="absolute inset-0 top-1/2" />
      {children && (
        <span
          class="bg-background text-muted-foreground relative mx-auto block w-fit px-2"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  );
}
