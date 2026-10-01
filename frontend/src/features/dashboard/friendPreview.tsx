import { FaUsers } from "react-icons/fa6";
import ProfileImage from "@/shared/components/profileImage";

export default function FriendPreview() {
  return (
    <div className="flex flex-col items-center w-full">
      <span className="inline-flex gap-3 items-center flock-h3 font-sans! font-bold!">
        <FaUsers />
        People you know
      </span>
      <div className="flex flex-wrap gap-2">
        <span className="group">
          <ProfileImage shadow />
        </span>

        <ProfileImage />
        <ProfileImage />
      </div>
    </div>
  );
}
