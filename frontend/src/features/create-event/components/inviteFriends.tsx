"use client";
import SearchBar from "@/shared/components/searchBar";
import InviteFriendCard from "../../invite-friends/inviteFriendCard";
import { useState, useEffect, useRef } from "react";
import Button from "@/shared/components/button";
import type { UserSearchResult } from "@/shared/types/user";
import { searchUsersFetch } from "@/shared/lib/api";
import { debounce } from "lodash";

// TODO: Connect to API and make sure types and structures are correct

const allSuggestions: UserSearchResult[] = [
  {
    firstName: "Sandra",
    lastName: "Kåhre",
    id: 1,
    friendshipStatus: "FRIENDS",
  },
  {
    firstName: "Alice",
    lastName: "Cohen",
    id: 2,
    friendshipStatus: "NONE",
  },
];

export default function InviteFriends({ eventId }: { eventId: number | null }) {
  const searchRequestRef = useRef(0);
  const debouncedSearch = useRef(
    debounce(async (query: string, requestId: number) => {
      try {
        const results = await searchUsersFetch(query);
        if (requestId === searchRequestRef.current) setSearchResults(results);
      } catch (error) {
        if (requestId === searchRequestRef.current) {
          console.error("User search failed:", error);
        }
      }
    }),
  ).current;
  const [searchResults, setSearchResults] = useState<UserSearchResult[] | null>(
    null,
  );
  const [invitees, setInvitees] = useState<UserSearchResult[]>([]);
  const [suggestions, setSuggestions] = useState(allSuggestions);

  useEffect(() => {
    const invitedIds = new Set(invitees.map((invitee) => invitee.id));
    setSuggestions(
      allSuggestions.filter((suggestion) => !invitedIds.has(suggestion.id)),
    );
  }, [invitees]);

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
      setSearchResults(null);
      return;
    }
    debouncedSearch(query, requestId);
  }

  function handleInvite(user: UserSearchResult, action: "add" | "remove") {
    setInvitees((prev) => {
      if (action === "add") {
        return prev.some((invitee) => invitee.id === user.id)
          ? prev
          : [...prev, user];
      }

      return prev.filter((invitee) => invitee.id !== user.id);
    });
  }

  function handleSendInvites() {
    console.log("inviting...");
  }

  return (
    <div className="flex flex-col gap-4 ">
      <div className="w-full flex flex-col md:flex-row gap-4">
        <div className="w-full flex flex-col gap-2">
          <SearchBar onQueryChange={onSearch} />
          {searchResults ? (
            <div className="w-full flex flex-col gap-2">
              {searchResults.map((result) => (
                <InviteFriendCard
                  key={result.id}
                  user={result}
                  isInvited={invitees.some(
                    (invitee) => invitee.id === result.id,
                  )}
                  onInvite={() => handleInvite(result, "add")}
                  onRemove={() => handleInvite(result, "remove")}
                />
              ))}
            </div>
          ) : (
            <div className="w-full flex flex-col gap-2">
              <h3 className="flock-lead text-center">Suggestions</h3>
              {suggestions.map((suggestion) => (
                <InviteFriendCard
                  key={suggestion.id}
                  user={suggestion}
                  isInvited={invitees.some(
                    (invitee) => invitee.id === suggestion.id,
                  )}
                  onInvite={() => handleInvite(suggestion, "add")}
                  onRemove={() => handleInvite(suggestion, "remove")}
                />
              ))}
            </div>
          )}
        </div>
        <div className="w-px shrink-0 self-stretch bg-primary/20" />
        <div className="w-full flex flex-col gap-2">
          <h2 className="flock-h3 text-center">Invitees</h2>
          {invitees.map((invitee) => (
            <InviteFriendCard
              key={invitee.id}
              user={invitee}
              isInvited={true}
              onRemove={() => handleInvite(invitee, "remove")}
            />
          ))}
        </div>
      </div>
      <div className="w-full flex justify-between">
        <Button type="button" variant="secondary" href="/event">
          Skip
        </Button>
        <Button type="button" onClick={handleSendInvites}>
          Send invites
        </Button>
      </div>
    </div>
  );
}
