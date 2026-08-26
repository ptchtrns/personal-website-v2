import { Field, FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { toDateInputValue } from "@/lib/utils.ts";

interface DateRangeFieldsProps {
  startedAt: Date | string | null | undefined;
  finishedAt: Date | string | null | undefined;
}

/** Shared "Started at" / "Finished at (leave empty if ongoing)" date field pair used by education and work experience forms. */
export function DateRangeFields(
  { startedAt, finishedAt }: DateRangeFieldsProps,
) {
  return (
    <>
      <Field class="flex flex-col gap-1.5">
        <FieldLabel for="startedAt">Started at</FieldLabel>
        <Input
          id="startedAt"
          type="date"
          name="startedAt"
          defaultValue={toDateInputValue(startedAt ?? null)}
          required
        />
      </Field>

      <Field class="flex flex-col gap-1.5">
        <FieldLabel for="finishedAt">
          Finished at (leave empty if ongoing)
        </FieldLabel>
        <Input
          id="finishedAt"
          type="date"
          name="finishedAt"
          defaultValue={toDateInputValue(finishedAt ?? null)}
        />
      </Field>
    </>
  );
}
