import ProfileImage from "@/shared/components/profileImage";
import type { PublicUser } from "@/shared/types/user";

export default function AvatarStack({
  users,
  max = 3,
}: {
  users: PublicUser[];
  max?: number;
}) {
  const overflow = users.length - max;

  return (
    <>
      {users.slice(0, max).map((user) => (
        <div
          key={user.id}
          className="not-last:-mr-3 relative rounded-full shadow-sm"
        >
          <ProfileImage
            profileImgSrc={user.imageUrl ?? ""}
            firstName={user.firstName}
            lastName={user.lastName}
            className="bg-accent!"
          />
        </div>
      ))}
      {overflow > 0 && (
        <div className="@container relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-background shadow-sm">
          <span className="text-[40cqw]! flock-ui-label leading-none">
            +{overflow}
          </span>
        </div>
      )}
    </>
  );
}
