"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FaUserPlus } from "react-icons/fa6";
import SearchBar from "./searchBar";
import { twMerge } from "tailwind-merge";
import FriendSearchResult from "./friendSearchResult";
import type { UserSearchResult } from "../../../shared/types/user";
import {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
} from "@/shared/lib/api";
import { searchUsers } from "../lib/api";
import { useDebouncedSearch } from "@/shared/hooks/useDebouncedSearch";

const navLinkStyle =
  "aspect-square items-center justify-center cursor-pointer group hover:scale-110 hover:-rotate-5 transition-all";
const navIconStyle = "h-full w-full fill-primary group-hover:drop-shadow-md";

const OPEN_SEARCH_EVENT = "flock:open-friend-search";

export function openFriendSearch() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  window.dispatchEvent(new Event(OPEN_SEARCH_EVENT));
}

export default function InviteBar() {
  const [results, setResults] = useState<UserSearchResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState<{
    userId: number;
    action: "add" | "accept" | "decline";
  } | null>(null);
  const [searchBarToggle, setSearchBarToggle] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  const { search: debouncedSearch, cancel: cancelSearch } = useDebouncedSearch(
    async (query: string, isCurrent: () => boolean) => {
      setLoading(true);
      try {
        const data = await searchUsers(query);
        if (isCurrent()) setResults(data);
      } catch (err) {
        if (isCurrent()) {
          console.error(err);
          setResults([]);
        }
      } finally {
        if (isCurrent()) setLoading(false);
      }
    },
    300,
    { leading: true, trailing: true },
  );

  function onSearch(query: string) {
    if (!query.trim()) {
      cancelSearch();
      setResults(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    debouncedSearch(query);
  }

  function updateFriendshipStatus(
    userId: number,
    friendshipStatus: UserSearchResult["friendshipStatus"],
  ) {
    setResults(
      (prev) =>
        prev?.map((user) =>
          user.id === userId ? { ...user, friendshipStatus } : user,
        ) ?? null,
    );
  }

  async function handleAddFriend(user: UserSearchResult) {
    setPending({ userId: user.id, action: "add" });
    try {
      await sendFriendRequest(user.id);
      updateFriendshipStatus(user.id, "REQUEST_SENT");
    } catch (error) {
      console.error(error);
    } finally {
      setPending(null);
    }
  }

  async function handleAcceptFriend(user: UserSearchResult) {
    setPending({ userId: user.id, action: "accept" });
    try {
      await acceptFriendRequest(user.id);
      updateFriendshipStatus(user.id, "FRIENDS");
    } catch (error) {
      console.error(error);
    } finally {
      setPending(null);
    }
  }

  async function handleDeclineFriend(user: UserSearchResult) {
    setPending({ userId: user.id, action: "decline" });
    try {
      await declineFriendRequest(user.id);
      updateFriendshipStatus(user.id, "NONE");
    } catch (error) {
      console.error(error);
    } finally {
      setPending(null);
    }
  }

  useEffect(() => {
    const open = () => setSearchBarToggle(true);
    window.addEventListener(OPEN_SEARCH_EVENT, open);
    return () => window.removeEventListener(OPEN_SEARCH_EVENT, open);
  }, []);

  const closeSearch = useCallback(() => {
    setSearchBarToggle(false);
    setResults(null);
    setLoading(false);
    cancelSearch();
  }, [cancelSearch]);

  useEffect(() => {
    if (!searchBarToggle) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (barRef.current?.contains(target)) return;
      closeSearch();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [searchBarToggle, closeSearch]);

  const showDropdown = loading || results !== null;

  return (
    <div
      ref={barRef}
      className={twMerge(
        "relative flex h-full items-center rounded-full",
        searchBarToggle ? "z-50 w-48 px-1 py-1 md:w-64" : "justify-center",
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
            onQueryChange={onSearch}
          />

          {showDropdown && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 flex max-h-100 flex-col overflow-y-auto rounded-xl border border-primary/20 bg-white p-3 shadow-md">
              {loading ? (
                <p
                  className="flock-caption flex items-center justify-center gap-2 p-2 text-primary"
                  aria-live="polite"
                >
                  Searching...
                </p>
              ) : results?.length === 0 ? (
                <p className="flock-caption p-2 text-center">No users found</p>
              ) : (
                results?.map((friend, index) => (
                  <div key={friend.id}>
                    <FriendSearchResult
                      user={friend}
                      isPending={pending?.userId === friend.id}
                      pendingAction={
                        pending?.userId === friend.id ? pending.action : null
                      }
                      onAddFriend={() => handleAddFriend(friend)}
                      onAcceptFriend={() => handleAcceptFriend(friend)}
                      onDeclineFriend={() => handleDeclineFriend(friend)}
                      onOpenProfile={closeSearch}
                    />
                    {results && index < results.length - 1 && (
                      <div className="mx-auto w-3/4 border-t border-primary/20" />
                    )}
                  </div>
                ))
              )}
            </div>
          )}
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
