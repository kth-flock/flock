"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { FaCamera, FaPenToSquare, FaX } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import { IconButton } from "../../../shared/components/button";

type ImageUploadProps = {
  className?: string;
  accept?: string;
  disabled?: boolean;
  iconSize?: number;
  label?: string;

  onFileSelect?: (file: File) => void;
  onFileRemove?: () => void;
};

export default function ImageUpload({
  className,
  accept = "image/jpeg,image/png,image/gif",
  disabled = false,
  iconSize = 40,
  label,
  onFileSelect,
  onFileRemove,
}: ImageUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const inputId = useId();

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);

      const nextPreviewUrl = file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null;
      previewUrlRef.current = nextPreviewUrl;
      setPreviewUrl(nextPreviewUrl);
      onFileSelect?.(file);
    }
    e.target.value = "";
  };

  const handleFileRemove = () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = null;
    setPreviewUrl(null);
    setFileName(null);
    if (inputRef.current) inputRef.current.value = "";
    onFileRemove?.();
  };

  return (
    <div className="relative flex">
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className={twMerge(
          "w-full group relative flex cursor-pointer items-center justify-center overflow-hidden text-center disabled:cursor-not-allowed",
          className,
        )}
        aria-label={fileName ? `Change image, selected ${fileName}` : undefined}
      >
        <span className={twMerge("contents", previewUrl && "invisible")}>
          <span className="flex items-center gap-4  text-primary flock-h4">
            <FaCamera
              size={iconSize}
              className="h-full aspect-square"
              aria-hidden="true"
            />
            {label && <span>{label}</span>}
          </span>
        </span>

        {previewUrl && (
          <>
            <div className="absolute inset-0 z-10 h-full w-full object-cover bg-black/20 flex justify-center items-center">
              <span className="flex items-center rounded-full p-4 cursor-pointer bg-background/50 shadow-lg transition-all hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:inset-shadow-sm active:shadow-none">
                <FaPenToSquare size={40} aria-hidden="true" />
              </span>
            </div>
            <img
              src={previewUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 z-0 h-full w-full object-cover"
            />
          </>
        )}
      </button>
      {fileName && (
        <IconButton
          type="button"
          disabled={disabled}
          onClick={handleFileRemove}
          variant="tertiary"
          size="sm"
          aria-label="Remove selected image"
          className="absolute -right-2 -top-2 z-20 text-white bg-foreground/20"
        >
          <FaX aria-hidden="true" />
        </IconButton>
      )}
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
