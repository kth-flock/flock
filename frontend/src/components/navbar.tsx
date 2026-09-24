import Link from "next/link";
import Image from "next/image";
import { FaCircleUser, FaCalendarDays, FaHouseChimney } from "react-icons/fa6";

const navLinkStyle =
  "aspect-square items-center justify-center group hover:scale-120 hover:-rotate-5 transition-all";
const navIconStyle = "h-full w-full fill-primary group-hover:drop-shadow-lg";

export default function Navbar() {
  return (
    <nav className="w-full py-2 md:p-6 flex flex-row justify-between h-20 md:h-32 items-center">
      <Link
        href="/"
        className={`flex h-[80%] ${navLinkStyle}`}
        aria-label="Flock Logo"
      >
        <Image
          src="/logo.svg"
          alt="Flock"
          width={200}
          height={200}
          loading="eager"
          className="h-full w-full group-hover:drop-shadow-lg"
        />
      </Link>

      <span className="flex h-full items-center gap-4 rounded-full bg-accent/10 px-4 md:px-8 py-2 md:py-4">
        <Link
          href="/"
          className={`flex h-[50%] ${navLinkStyle}`}
          aria-label="Home"
        >
          <FaHouseChimney className={navIconStyle} />
        </Link>
        <Link
          href="/"
          className={`flex h-[50%] ${navLinkStyle}`}
          aria-label="Calendar"
        >
          <FaCalendarDays className={navIconStyle} />
        </Link>
        <Link
          href="/"
          className={`flex h-full ${navLinkStyle}`}
          aria-label="Profile"
        >
          <FaCircleUser className={navIconStyle} />
        </Link>
      </span>
    </nav>
  );
}
