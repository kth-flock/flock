import { twMerge } from "tailwind-merge";
import Image from "next/image";

type ProfileImageProps =
  | {
      className?: string;
      shadow?: boolean;
      profileImgSrc?: undefined;
      firstName: string;
      lastName: string;
    }
  | {
      className?: string;
      shadow?: boolean;
      profileImgSrc: string;
      firstName?: undefined;
      lastName?: undefined;
    };

export default function ProfileImage({
  className = "",
  shadow = false,
  profileImgSrc,
  firstName,
  lastName,
}: ProfileImageProps) {
  return (
    <div className="rounded-full overflow-hidden h-8 w-8 group relative">
      {profileImgSrc ? (
        <Image src={profileImgSrc} fill alt={`${firstName} ${lastName}`} />
      ) : (
        <div
          className={twMerge(
            "@container group relative flex h-full w-full items-center justify-center bg-accent/40",
            shadow ? "drop-shadow-lg" : "",
            className,
          )}
        >
          {firstName && (
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
