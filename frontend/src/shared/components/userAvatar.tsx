import { FaCircleUser } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";
import { fullName } from "@/shared/lib/user";
import type { PublicUser } from "@/shared/types/user";

export default function UserAvatar({
  user,
  className,
}: {
  user: PublicUser;
  className?: string;
}) {
  const style = twMerge("size-8 shrink-0 rounded-full", className);

  return user.imageUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={user.imageUrl} alt={fullName(user)} className={twMerge(style, "object-cover")} />
  ) : (
    <FaCircleUser className={twMerge(style, "fill-accent")} aria-hidden />
  );
}
