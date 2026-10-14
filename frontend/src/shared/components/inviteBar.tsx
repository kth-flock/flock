"use client";

import { useEffect, useRef, useState } from "react";
import { FaUserPlus } from "react-icons/fa6";
import SearchBar from "./searchBar";
import { twMerge } from "tailwind-merge";
import FriendSearchResult from "./friendSearchResult";

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
        "relative flex h-full items-center rounded-full",
        searchBarToggle
          ? "z-50 w-48 px-1 py-1 md:w-64"
          : "aspect-square justify-center",
      )}
    >
      {searchBarToggle ? (
        <>
          <SearchBar
            autoFocus
            id="invite-search"
            placeholder="Add friends"
            size="compact"
            className="min-w-0 w-full"
          />
          <div className="absolute left-0 right-0 top-full z-50 mt-2 flex max-h-60 flex-col gap-2 overflow-y-auto rounded-xl border border-primary/20 bg-white p-3 shadow-md">
            <FriendSearchResult
              user={{
                id: 1,
                firstName: "John",
                lastName: "Doe WithaLongAssName",
                imageUrl: null,
                createdAt: "2021-01-01",
                friendshipStatus: "FRIENDS",
              }}
            />
            <div className="border-t border-primary/20 w-2/3 mx-auto" ></div>
            <FriendSearchResult
              user={{
                id: 2,
                firstName: "Jane",
                lastName: "Smith",
                imageUrl: null,
                createdAt: "2021-01-01",
                friendshipStatus: "NONE",
              }}
            />
          </div>
        </>
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
