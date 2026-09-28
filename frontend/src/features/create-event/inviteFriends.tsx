import SearchBar from "@/shared/components/searchBar";

export default function InviteFriends({ eventId }: { eventId: number | null }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <SearchBar />
      </div>
    </div>
  );
}
