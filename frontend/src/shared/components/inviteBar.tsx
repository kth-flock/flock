"use client";

import { useEffect, useRef, useState } from "react";
import { FaUserPlus } from "react-icons/fa6";
import SearchBar from "./searchBar";
import { twMerge } from "tailwind-merge";
import FriendSearchResult from "./friendSearchResult";
import type { FriendshipStatus } from "@flock/shared/schemas/user";

const mockFriends = [
  {
    id: 1,
    firstName: "Johnddd",
    lastName: "DoeWIthALongAssName",
    imageUrl: null,
    friendshipStatus: "FRIENDS",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    imageUrl: null,
    friendshipStatus: "NONE",
  },
  {
    id: 3,
    firstName: "Jim",
    lastName: "Beam",
    imageUrl: null,
    friendshipStatus: "REQUEST_RECEIVED",
  },
  {
    id: 4,
    firstName: "Jill",
    lastName: "Johnson",
    imageUrl: null,
    friendshipStatus: "REQUEST_SENT",
  },
];

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
         
         <div className="absolute left-0 right-0 top-full z-50 mt-2 flex max-h-100 flex-col  overflow-y-auto rounded-xl border border-primary/20 bg-white p-3 shadow-md">
             
            {mockFriends.map((friend, index) => (
                <div key={friend.id} className="">
                <FriendSearchResult
                user={{
                  id: friend.id,
                  firstName: friend.firstName,
                  lastName: friend.lastName,
                  imageUrl: friend.imageUrl,
                  createdAt: "2021-01-01",
                  friendshipStatus: friend.friendshipStatus as FriendshipStatus,
                }}
              />
              {index < mockFriends.length - 1 && <div className="border-t border-primary/20 w-3/4 mx-auto" />}
            </div>
            ))}
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
