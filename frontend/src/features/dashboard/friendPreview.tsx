import { FaUsers, FaArrowRight } from "react-icons/fa6";
import { FaUserPlus } from "react-icons/fa6";
import ProfileImage from "@/shared/components/profileImage";
import { IconButton } from "@/shared/components/button";

export default function FriendPreview() {
  return (
    <div className="flex flex-col items-center w-full gap-4">
      <span className="inline-flex gap-3 items-center flock-h3 font-sans! font-bold!">
        <FaUsers />
        People you know
      </span>
      <div className="flex flex-row justify-center gap-4 w-full">
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="group transition-all hover:scale-110 hover:-translate-y-0.5 hover:-rotate-5 cursor-pointer">
            <ProfileImage shadow firstName="Felix" lastName="Larsson" />
          </span>
          <span className="group transition-all hover:scale-110 hover:-translate-y-0.5 hover:-rotate-5 cursor-pointer">
            <ProfileImage shadow firstName="Sandra" lastName="Kåhre" />
          </span>
        </div>
        <div className="w-px self-stretch bg-primary/20" />{" "}
        <IconButton size="sm" variant="secondary">
          <FaUserPlus />
        </IconButton>
      </div>
    </div>
  );
}
