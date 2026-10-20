"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type Props = Omit<ImageProps, "src"> & {
  src: string | null;
};

export default function EventImage({ src, alt, ...props }: Props) {
  const [failed, setFailed] = useState(false);

  return (
    <Image
      {...props}
      src={failed ? "/placeholderImgError.png" : (src ?? "/placeholder.png")}
      alt={failed || src ? alt : ""}
      onError={() => setFailed(true)}
      unoptimized
      loading="eager"
    />
  );
}
