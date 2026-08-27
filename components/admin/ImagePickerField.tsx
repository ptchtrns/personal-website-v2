import { Field, FieldLabel } from "@/components/ui/field.tsx";
import { ImagePicker } from "@/components/admin/ImagePicker.tsx";
import type { MediaItem } from "@/lib/media.ts";

interface ImagePickerFieldProps {
  label: string;
  name: string;
  images: MediaItem[];
  selectedId: number | null;
  allowNoImage?: boolean;
}

/** `Field`-wrapped `ImagePicker`, shared by the logo/cover/image pickers across admin forms. */
export function ImagePickerField(
  { label, name, images, selectedId, allowNoImage }: ImagePickerFieldProps,
) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <ImagePicker
        name={name}
        images={images}
        selectedId={selectedId}
        allowNoImage={allowNoImage}
      />
    </Field>
  );
}
