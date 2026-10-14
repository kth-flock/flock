"use client";

import { useEffect, useRef, useState } from "react";
import { FaUserPlus } from "react-icons/fa6";
import SearchBar from "./searchBar";
import { twMerge } from "tailwind-merge";

const navLinkStyle =
  "aspect-square items-center justify-center group hover:scale-110 hover:-rotate-5 transition-all";
const navIconStyle = "h-full w-full fill-primary group-hover:drop-shadow-md";

export default function InviteBar() {
  const [searchBarToggle, setSearchBarToggle] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searchBarToggle) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (barRef.current?.contains(target)) return;
      setSearchBarToggle(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () =>
      document.removeEventListener("pointerdown", handlePointerDown);
  }, [searchBarToggle]);

  return (
    <div
      ref={barRef}
      className={twMerge(
        "flex h-full flex-row items-center rounded-full",
        searchBarToggle
          ? "w-48 gap-1px-1 py-1 md:w-64"
          : "aspect-square justify-center",
      )}
    >
      {searchBarToggle ? (
        <SearchBar
          autoFocus
          id="invite-search"
          placeholder="Search by name"
          size="compact"
          className="min-w-0 flex-1"
        />
      ) : (
        <button
          type="button"
          aria-label="Open invite search"
          aria-expanded={false}
          className={`flex h-[50%] ${navLinkStyle}`}
          onClick={() => setSearchBarToggle(true)}
        >
          <FaUserPlus className={navIconStyle} />
        </button>
      )}
    </div>
  );
}
