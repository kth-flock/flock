import type { PublicUser } from "@/shared/types/user";
import type { EventDetails } from "./types";

// Placeholder data used while the event page isn't wired to the backend

const alice: PublicUser = {
  id: 1,
  firstName: "Felix",
  lastName: "Larsson",
  imageUrl: null,
};

const bob: PublicUser = {
  id: 2,
  firstName: "Sandra",
  lastName: "Kåhre",
  imageUrl: null,
};

const clara: PublicUser = {
  id: 3,
  firstName: "Alice",
  lastName: "Cohen",
  imageUrl: null,
};

export const exampleEvent: EventDetails = {
  id: 1,
  createdById: alice.id,
  title: "Grillkväll i Tyresö",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ac nunc euismod, ullamcorper nulla vitae, feugiat tellus. Aenean in lorem quam. Pellentesque vitae nisi sed quam tincidunt pharetra. Cras erat mi, blandit non mollis ut, ultrices sit amet nibh. Nullam pharetra iaculis auctor. Nunc lobortis felis id tortor hendrerit accumsan. Nullam nec mollis dolor, a varius odio. Quisque semper luctus accumsan. Nullam et bibendum sapien. Aenean ultrices bibendum imperdiet. Sed rhoncus sapien eget interdum blandit. Vivamus suscipit purus eu massa efficitur eleifend.\n\nVestibulum nec lorem id metus facilisis vehicula. Phasellus magna sem, blandit at bibendum in, sollicitudin sed odio. Nam interdum, mauris et elementum egestas, massa nulla faucibus urna, ut lobortis lectus diam a nulla.",
  locationName: "Sommarliden, Tyresö",
  latitude: 59.2,
  longitude: 18.3,
  startsAt: "2026-10-10T12:00:00.000Z",
  endsAt: "2026-10-10T16:00:00.000Z",
  imageUrl:
    "https://images.unsplash.com/photo-1508189860359-777d945909ef?w=1200",
  createdBy: alice,
  announcements: [
    {
      id: 1,
      eventId: 1,
      userId: alice.id,
      content: "Welcome! Pls bring you car.",
      createdAt: "2026-09-25T09:30:00.000Z",
      user: alice,
      comments: [
        {
          id: 1,
          announcementId: 1,
          userId: bob.id,
          content: "Hell yes",
          createdAt: "2026-09-25T10:05:00.000Z",
          user: bob,
        },
        {
          id: 2,
          announcementId: 1,
          userId: clara.id,
          content: "Lfg",
          createdAt: "2026-09-25T11:42:00.000Z",
          user: clara,
        },
      ],
    },
    {
      id: 2,
      eventId: 1,
      userId: alice.id,
      content: "Imagine a world where we all bring our own cars.",
      createdAt: "2026-09-28T17:15:00.000Z",
      user: alice,
      comments: [],
    },
  ],
};
