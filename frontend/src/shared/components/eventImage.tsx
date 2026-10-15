"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type Props = Omit<ImageProps, "src"> & {
  src: string | null;
  imageFailed?: boolean;
};

export default function EventImage({ src, imageFailed, alt, ...props }: Props) {
  const [failed, setFailed] = useState(false);
  const showFail = failed || imageFailed;

  return (
    <Image
      {...props}
      src={showFail ? "/placeholderImgError.png" : (src ?? "/placeholder.png")}
      alt={showFail || src ? alt : ""}
      onError={() => setFailed(true)}
    />
  );
}
