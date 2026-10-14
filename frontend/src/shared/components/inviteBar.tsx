"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { FaUserPlus } from "react-icons/fa6";
import SearchBar from "./searchBar";
import { twMerge } from "tailwind-merge";
import FriendSearchResult from "./friendSearchResult";
import type { UserSearchResult } from "../types/user";
import { debounce } from "lodash";
import { searchUsersFetch } from "@/shared/lib/api";

const navLinkStyle =
  "aspect-square items-center justify-center group hover:scale-110 hover:-rotate-5 transition-all";
const navIconStyle = "h-full w-full fill-primary group-hover:drop-shadow-md";

export default function InviteBar() {
  const [results, setResults] = useState<UserSearchResult[] | null>(null);
  const [pendingUserId, setPendingUserId] = useState<number | null>(null);
  const searchRequestRef = useRef(0);
  const [searchBarToggle, setSearchBarToggle] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (query: string, requestId: number) => {
        try {
          const data = await searchUsersFetch(query);
          if (requestId === searchRequestRef.current) setResults(data);
        } catch (err) {
          if (requestId === searchRequestRef.current) {
            console.error(err);
            setResults([]);
          }
        }
      }, 400),
    [],
  );

  useEffect(
    () => () => {
      debouncedSearch.cancel();
      searchRequestRef.current += 1;
    },
    [debouncedSearch],
  );

  function onSearch(query: string) {
    const requestId = ++searchRequestRef.current;
    if (!query.trim()) {
      debouncedSearch.cancel();
      setResults(null);
      return;
    }
    debouncedSearch(query, requestId);
  }

  useEffect(() => {
    if (!searchBarToggle) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (barRef.current?.contains(target)) return;
      setSearchBarToggle(false);
      setResults(null);
      debouncedSearch.cancel();
      searchRequestRef.current += 1;
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () =>
      document.removeEventListener("pointerdown", handlePointerDown);
  }, [searchBarToggle, debouncedSearch]);

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
            onQueryChange={onSearch}
          />

          {results !== null && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 flex max-h-100 flex-col overflow-y-auto rounded-xl border border-primary/20 bg-white p-3 shadow-md">
              {results.length === 0 ? (
                <p className="flock-caption p-2 text-center">No users found</p>
              ) : (
                results.map((friend, index) => (
                  <div key={friend.id}>
                    <FriendSearchResult
                      user={friend}
                      isPending={pendingUserId === friend.id}
                    />
                    {index < results.length - 1 && (
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
