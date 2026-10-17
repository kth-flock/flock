export default function ProfileClient() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10">
      <ProfileHeader
        profile={profile}
        bannerColor={randomBannerColor()}
        isOwnProfile
        email={profile.email}
      />
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
        <ProfileContent
          profile={profile}
          friends={
            friends?.map((friend) => ({
              ...friend,
              friendshipStatus: "FRIENDS" as const,
            })) ?? null
          }
          hostedEvents={hostedEvents}
          invitedEvents={invitedEvents}
          className="grid-cols-2 md:grid-cols-1"
        />
        <div className="border-t border-primary/20 pt-6 md:col-span-2 md:border-t-0 md:border-l md:pt-0 md:pl-6">
          <ProfileHistory
            hostedEvents={hostedEvents}
            invitedEvents={invitedEvents}
          />
        </div>
      </div>
    </main>
  );
}
