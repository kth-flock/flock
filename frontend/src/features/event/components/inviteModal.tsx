"use client";
import Modal from "@/shared/components/modal";
import { useState, useEffect } from "react";
import SearchBar from "@/features/search/components/searchBar";
import InviteFriendCard from "@/features/invite-friends/inviteFriendCard";
import { inviteFriend, uninviteFriend } from "@/shared/lib/api";
import type { UserSearchResult, PublicUser } from "@/shared/types/user";
import { getErrorMessage } from "@/shared/lib/errors";
import { searchUsers } from "@/features/search/lib/api";
import { useDebouncedSearch } from "@/shared/hooks/useDebouncedSearch";

type InviteModalProps = {
  onClose: () => void;
  isOpen: boolean;
  invitees: PublicUser[];
  eventId: number;
  onChange: () => void;
};

export default function InviteModal({
  onClose,
  isOpen,
  invitees,
  eventId,
  onChange,
}: InviteModalProps) {
  const [searchResults, setSearchResults] = useState<UserSearchResult[] | null>(
    null,
  );
  const { search: debouncedSearch, cancel: cancelSearch } =
    useDebouncedSearch(async (query: string, isCurrent: () => boolean) => {
      try {
        const results = await searchUsers(query);
        if (isCurrent()) setSearchResults(results);
      } catch (error) {
        if (isCurrent()) {
          console.error("User search failed:", error);
        }
      }
    }, 300);
  const [invitedUserIds, setInvitedUserIds] = useState(
    () => new Set(invitees.map((invitee) => invitee.id)),
  );
  const [pendingUserIds, setPendingUserIds] = useState(() => new Set<number>());
  const [inviteError, setInviteError] = useState<string | null>(null);

  useEffect(() => {
    setInvitedUserIds(new Set(invitees.map((invitee) => invitee.id)));
  }, [invitees]);

  function onSearch(query: string) {
    if (!query.trim()) {
      cancelSearch();
      setSearchResults(null);
      return;
    }
    debouncedSearch(query);
  }

  async function handleInvite(
    user: UserSearchResult,
    action: "add" | "remove",
  ) {
    setPendingUserIds((pending) => new Set(pending).add(user.id));
    setInviteError(null);

    try {
      if (action === "add") {
        await inviteFriend(eventId, user.id);
        setInvitedUserIds((invited) => new Set(invited).add(user.id));
      } else {
        await uninviteFriend(eventId, user.id);
        setInvitedUserIds((invited) => {
          const updated = new Set(invited);
          updated.delete(user.id);
          return updated;
        });
      }
      onChange();
    } catch (error) {
      setInviteError(getErrorMessage(error, "Failed to update invitation"));
    } finally {
      setPendingUserIds((pending) => {
        const updated = new Set(pending);
        updated.delete(user.id);
        return updated;
      });
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-1 items-center md:w-md">
        <p className="flock-h4">Invite friends</p>
        <SearchBar onQueryChange={onSearch} />
        {inviteError && (
          <p className="flock-ui-label text-error" role="alert">
            {inviteError}
          </p>
        )}
        {searchResults && (
          <div className="w-full flex flex-col gap-2">
            {searchResults.map((result) => (
              <InviteFriendCard
                key={result.id}
                user={result}
                isInvited={invitedUserIds.has(result.id)}
                isPending={pendingUserIds.has(result.id)}
                onInvite={() => handleInvite(result, "add")}
                onRemove={() => handleInvite(result, "remove")}
              />
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
