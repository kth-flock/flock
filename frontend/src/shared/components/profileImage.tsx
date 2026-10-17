"use client";

import { twMerge } from "tailwind-merge";
import Image from "next/image";
import { useState } from "react";

type ProfileImageProps =
  | {
      className?: string;
      shadow?: boolean;
      profileImgSrc?: string;
      firstName: string;
      lastName: string;
    }
  | {
      className?: string;
      shadow?: boolean;
      profileImgSrc: string;
      firstName?: string;
      lastName?: string;
    };

export default function ProfileImage({
  className = "",
  shadow = false,
  profileImgSrc,
  firstName,
  lastName,
}: ProfileImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={twMerge(
        "rounded-full overflow-hidden h-8 w-8 shrink-0 group relative",
        className,
      )}
    >
      {profileImgSrc ? (
        <Image
          src={failed ? "/profileImgFailed.png" : profileImgSrc}
          fill
          alt={`${firstName} ${lastName}`}
          onError={() => setFailed(true)}
          className="object-cover"
        />
      ) : (
        <div
          className={twMerge(
            "@container group relative flex h-full w-full items-center justify-center bg-accent/40",
            shadow ? "drop-shadow-lg" : "",
          )}
        >
          {firstName && lastName && (
            <span className="text-[40cqw]! flock-ui-label leading-none">
              {firstName[0]}
              {lastName[0]}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
