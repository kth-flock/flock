"use client";

import { useState, useRef } from "react";
import { FaCamera } from "react-icons/fa6";

export default function ImageUpload() {
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      className="group flex items-center justify-center rounded-2xl border border-primary/20 bg-white py-16 px-6 text-center cursor-pointer hover:shadow-md transition-all"
    >
      <label className="sr-only" htmlFor="image-upload" />
      <input
        ref={inputRef}
        id="image-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="flex items-center gap-4 text-primary h4 group-hover:text-secondary">
        <FaCamera size={40} />
        <span>{fileName ?? "Upload"}</span>
      </div>
    </div>
  );
}
