"use client";
import SearchBar from "@/shared/components/searchBar";
import InviteFriendCard from "../../invite-friends/inviteFriendCard";
import { useState, useEffect } from "react";
import Button from "@/shared/components/button";

// TODO: Connect to API and make sure types and structures are correct

type SearchResult = {
  id: number;
  name: string;
  isFriend: boolean;
};

const allSuggestions: SearchResult[] = [
  { id: 3, name: "Alice Cohen", isFriend: true },
  { id: 4, name: "Sandra Kåhre", isFriend: false },
];

export default function InviteFriends({ eventId }: { eventId: number | null }) {
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(
    null,
  );
  const [invitees, setInvitees] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState(allSuggestions);

  useEffect(() => {
    const invitedIds = new Set(invitees.map((invitee) => invitee.id));
    setSuggestions(
      allSuggestions.filter((suggestion) => !invitedIds.has(suggestion.id)),
    );
  }, [invitees]);

  function onSearch(query: string) {
    query.trim()
      ? setSearchResults([
          { id: 1, name: "Felix Larsson", isFriend: false },
          { id: 2, name: "Elinor Selinder", isFriend: true },
        ])
      : setSearchResults(null);
  }

  function handleInvite(user: SearchResult, action: "add" | "remove") {
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
                  name={result.name}
                  isInvited={invitees.some(
                    (invitee) => invitee.id === result.id,
                  )}
                  isFriend={result.isFriend}
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
                  name={suggestion.name}
                  isInvited={invitees.some(
                    (invitee) => invitee.id === suggestion.id,
                  )}
                  isFriend={suggestion.isFriend}
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
              name={invitee.name}
              isInvited={true}
              isFriend={invitee.isFriend}
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
