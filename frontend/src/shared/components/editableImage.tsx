"use client";

import { useState, type ReactNode } from "react";
import { FaPenToSquare, FaTrash } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import Button, { IconButton } from "./button";
import ImageUpload from "./imageUpload";

type EditableImageProps = {
  current: ReactNode;
  className?: string;
  imageUploadClass?: string;
  iconSize?: number;
  noImage?: boolean;
  label?: string;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  onDelete?: () => void;
  onCancel?: () => void;
};

export default function EditableImage({
  current,
  className,
  imageUploadClass,
  iconSize = 40,
  noImage,
  label,
  onFileSelect,
  onFileRemove,
  onDelete,
  onCancel,
}: EditableImageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  if (isEditing) {
    return (
      <div className="flex w-full flex-col items-stretch gap-2">
        <ImageUpload
          label={label}
          onFileSelect={onFileSelect}
          onFileRemove={onFileRemove}
          className={twMerge(className, imageUploadClass)}
        />

        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="self-center"
          onClick={() => {
            onFileRemove();
            setIsEditing(false);
          }}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className={twMerge("relative overflow-hidden shadow-lg", className)}>
        {isDeleted || noImage ? (
          <div className="size-full bg-accent/40" />
        ) : (
          current
        )}
        <Button
          type="button"
          variant="tertiary"
          aria-label="Edit image"
          onClick={() => setIsEditing(true)}
          className="absolute inset-0 z-10 flex size-full cursor-pointer items-center justify-center rounded-[inherit] bg-black/20"
        >
          <span className="flex items-center rounded-full bg-white/60 p-3 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0">
            <FaPenToSquare
              size={iconSize}
              aria-hidden
              className="text-primary"
            />
          </span>
        </Button>
      </div>

      {onDelete &&
        (isDeleted ? (
          <Button
            type="button"
            variant="tertiary"
            size="sm"
            onClick={() => {
              setIsDeleted(false);
              onCancel?.();
            }}
          >
            Undo
          </Button>
        ) : (
          <IconButton
            type="button"
            variant="tertiary"
            size="sm"
            className="border-error text-error hover:border-error-dark hover:bg-error/10 hover:text-error-dark"
            onClick={() => {
              (onDelete?.(), setIsDeleted(true));
            }}
          >
            <FaTrash size={12} />
          </IconButton>
        ))}
    </div>
  );
}
