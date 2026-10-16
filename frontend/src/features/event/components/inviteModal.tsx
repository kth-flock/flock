"use client";
import Modal from "@/shared/components/modal";
import Button from "@/shared/components/button";
import { FaUserPlus } from "react-icons/fa6";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/shared/components/searchBar";
import InviteFriendCard from "@/features/invite-friends/inviteFriendCard";
import { debounce } from "lodash";
import {
  searchUsersFetch,
  inviteFriendFetch,
  uninviteFriendFetch,
} from "@/shared/lib/api";
import type { UserSearchResult, PublicUser } from "@/shared/types/user";

type InviteModalProps = {
  onClose: () => void;
  isOpen: boolean;
  invitees: PublicUser[];
  eventId: number;
};

function InviteModal({ onClose, isOpen, invitees, eventId }: InviteModalProps) {
  const router = useRouter();
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
  const [invitedUserIds, setInvitedUserIds] = useState(
    () => new Set(invitees.map((invitee) => invitee.id)),
  );
  const [pendingUserIds, setPendingUserIds] = useState(() => new Set<number>());
  const [inviteError, setInviteError] = useState<string | null>(null);

  useEffect(() => {
    setInvitedUserIds(new Set(invitees.map((invitee) => invitee.id)));
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

  async function handleInvite(user: UserSearchResult, action: "add" | "remove") {
    setPendingUserIds((pending) => new Set(pending).add(user.id));
    setInviteError(null);

    try {
      if (action === "add") {
        await inviteFriendFetch(eventId, user.id);
        setInvitedUserIds((invited) => new Set(invited).add(user.id));
      } else {
        await uninviteFriendFetch(eventId, user.id);
        setInvitedUserIds((invited) => {
          const updated = new Set(invited);
          updated.delete(user.id);
          return updated;
        });
      }
      router.refresh();
    } catch (error) {
      setInviteError(
        error instanceof Error ? error.message : "Failed to update invitation",
      );
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

export default function InviteButton({
  invitees,
  eventId,
}: {
  invitees: PublicUser[];
  eventId: number;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <InviteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        invitees={invitees}
        eventId={eventId}
      />
      <Button
        icon={<FaUserPlus aria-hidden />}
        iconPlacement="right"
        variant="secondary"
        onClick={() => setIsModalOpen(true)}
      >
        Invite
      </Button>
    </>
  );
}
