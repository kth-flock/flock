import { useState } from "react";
import ImageUpload from "@/features/images/components/imageUpload";
import { FaCamera, FaPenToSquare } from "react-icons/fa6";
import Button from "@/shared/components/button";
import Image from "next/image";

export default function EventImageField({
  currentImageUrl,
  onChange,
}: {
  currentImageUrl?: string | null;
  onChange: (file: File | null) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <div className="flex w-full flex-col gap-2">
        <ImageUpload
          onFileSelect={onChange}
          onFileRemove={() => onChange(null)}
          className="rounded-2xl h-40 md:h-56 border border-primary/20 bg-background py-16 px-6 text-primary flock-h4 hover:border-primary"
        >
          <span className="flex items-center gap-4">
            <FaCamera size={40} aria-hidden="true" />
            <span>Upload new image</span>
          </span>
        </ImageUpload>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="self-center hover:bg-success-light"
          onClick={() => {
            setIsEditing(false);
            onChange(null);
          }}
        >
          Cancel image editing
        </Button>
      </div>
    );
  }
  return (
    <div className="relative h-40 overflow-hidden rounded-2xl shadow-lg md:h-56">
      <Image
        src={currentImageUrl ?? "/placeholder.png"}
        alt=""
        fill
        sizes="(min-width: 48rem) 48rem, 100vw"
        loading="eager"
        fetchPriority="high"
        className="object-cover"
      />

      <Button
        type="button"
        variant="tertiary"
        onClick={() => setIsEditing(true)}
        aria-label="Change image"
        className="absolute inset-0 z-10 flex h-full w-full items-center justify-center rounded-2xl bg-foreground/20 cursor-pointer"
      >
        <span className="flex items-center rounded-full p-4 bg-background/60 shadow-lg transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:inset-shadow-sm active:shadow-none">
          <FaPenToSquare
            size={40}
            aria-hidden="true"
            className="text-primary"
          />
        </span>
      </Button>
    </div>
  );
}
