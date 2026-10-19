import type { EventPayloadMode } from "../lib/formValueFormat";
import ImageUpload from "@/features/images/components/imageUpload";
import EditableImage from "@/shared/components/editableImage";
import EventImage from "@/shared/components/eventImage";

export default function EventImageField({
  mode,
  currentImageUrl,
  onChange,
  onDelete,
  onCancelDelete,
}: {
  mode: EventPayloadMode;
  currentImageUrl?: string | null;
  onChange: (file: File | null) => void;
  onDelete: () => void;
  onCancelDelete: () => void;
}) {
  if (mode === "create") {
    return (
      <ImageUpload
        label="Upload"
        onFileSelect={onChange}
        onFileRemove={() => onChange(null)}
        className="rounded-2xl border border-primary/20 bg-background px-6 py-16"
      />
    );
  }

  return (
    <EditableImage
      className="h-40 w-full rounded-2xl md:h-56"
      imageUploadClass="border border-primary/20 bg-background text-primary hover:border-primary"
      noImage={currentImageUrl == null}
      current={
        <EventImage
          src={currentImageUrl ?? null}
          alt="Cover image for event"
          fill
          sizes="(min-width: 48rem) 48rem, 100vw"
          fetchPriority="high"
          className="object-cover"
        />
      }
      label="Upload new image"
      onFileSelect={onChange}
      onFileRemove={() => onChange(null)}
      onDelete={currentImageUrl ? onDelete : undefined}
      onCancel={onCancelDelete}
    />
  );
}
