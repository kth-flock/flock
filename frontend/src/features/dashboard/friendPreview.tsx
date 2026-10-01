import { FaUsers } from "react-icons/fa6";
import ProfileImage from "@/shared/components/profileImage";

export default function FriendPreview() {
  return (
    <div className="flex flex-col items-center w-full gap-4">
      <span className="inline-flex gap-3 items-center flock-h3 font-sans! font-bold!">
        <FaUsers />
        People you know
      </span>
      <div className="flex flex-wrap gap-2">
        <span className="group hover:scale-110 hover:-translate-y-0.5 hover:-rotate-5 cursor-pointer">
          <ProfileImage
            shadow
            profileImgSrc="https://cdn.theatlantic.com/thumbor/vDZCdxF7pRXmZIc5vpB4pFrWHKs=/559x0:2259x1700/1080x1080/media/img/mt/2017/06/shutterstock_319985324/original.jpg"
          />
        </span>
        <span className="group hover:scale-110 hover:-translate-y-0.5 hover:-rotate-5 cursor-pointer">
          <ProfileImage shadow firstName="Sandra" lastName="Kåhre" />
        </span>
      </div>
    </div>
  );
}
