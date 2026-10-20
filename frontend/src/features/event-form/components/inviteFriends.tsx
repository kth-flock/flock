"use client";
import SearchBar from "@/features/search/components/searchBar";
import InviteFriendCard from "../../invite-friends/inviteFriendCard";
import { useState, useEffect } from "react";
import Button from "@/shared/components/button";
import type { UserSearchResult } from "@/shared/types/user";
import { getMyFriends, batchInvite } from "@/shared/lib/api";
import { searchUsers } from "@/features/search/lib/api";
import { useRouter } from "next/navigation";
import { useToast } from "@/shared/components/toast";
import { useDebouncedSearch } from "@/shared/hooks/useDebouncedSearch";

export default function InviteFriends({ eventId }: { eventId: number }) {
  const [searchResults, setSearchResults] = useState<UserSearchResult[] | null>(
    null,
  );
  const { search: debouncedSearch, cancel: cancelSearch } = useDebouncedSearch(
    async (query: string, isCurrent: () => boolean) => {
      try {
        const results = await searchUsers(query);
        if (isCurrent()) setSearchResults(results);
      } catch (error) {
        if (isCurrent()) {
          console.error("User search failed:", error);
        }
      }
    },
    300,
  );
  const [invitees, setInvitees] = useState<UserSearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<UserSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const invitedIds = new Set(invitees.map((invitee) => invitee.id));
    setSuggestions(
      suggestions.filter((suggestion) => !invitedIds.has(suggestion.id)),
    );
  }, [invitees]);

  useEffect(() => {
    async function fetchFriends() {
      const friends = await getMyFriends();
      setSuggestions(
        friends.map((friend) => ({ ...friend, friendshipStatus: "FRIENDS" })),
      );
    }

    fetchFriends();
  }, []);

  function onSearch(query: string) {
    if (!query.trim()) {
      cancelSearch();
      setSearchResults(null);
      return;
    }
    debouncedSearch(query);
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
  async function handleSendInvites() {
    setIsLoading(true);
    try {
      if (invitees.length > 0) {
        await batchInvite(
          eventId,
          invitees.map((invitee) => invitee.id),
        );
        toast("Invites sent!", "success");
      }
      router.push(`/event/${eventId}`);
    } catch (error) {
      toast("Failed to send invites", "error");
      router.push(`/event/${eventId}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 md:w-2xl min-h-[50vh] justify-between">
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
        <Button type="button" variant="secondary" href={`/event/${eventId}`}>
          Skip
        </Button>

        <Button
          type="button"
          disabled={invitees.length == 0}
          isLoading={isLoading}
          onClick={handleSendInvites}
        >
          {isLoading ? "Sending invites" : "Send invites"}
        </Button>
      </div>
    </div>
  );
}
