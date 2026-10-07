import type { PublicUser } from "@/shared/types/user";
import type { DashboardNotification } from "@/features/dashboard/lib/types";
import type { EventDetails } from "./types";

// Placeholder data used while frontend pages aren't wired to the backend

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

export const exampleFriends: PublicUser[] = [alice, bob, clara];

export const exampleProfiles: PublicUser[] = [alice, bob, clara];

export const exampleEvent: EventDetails = {
  id: 1,
  createdById: alice.id,
  title: "Grillkväll i Tyresö",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ac nunc euismod, ullamcorper nulla vitae, feugiat tellus. Aenean in lorem quam. Pellentesque vitae nisi sed quam tincidunt pharetra. Cras erat mi, blandit non mollis ut, ultrices sit amet nibh. Nullam pharetra iaculis auctor. Nunc lobortis felis id tortor hendrerit accumsan. Nullam nec mollis dolor, a varius odio. Quisque semper luctus accumsan. Nullam et bibendum sapien. Aenean ultrices bibendum imperdiet. Sed rhoncus sapien eget interdum blandit. Vivamus suscipit purus eu massa efficitur eleifend.\n\nVestibulum nec lorem id metus facilisis vehicula. Phasellus magna sem, blandit at bibendum in, sollicitudin sed odio. Nam interdum, mauris et elementum egestas, massa nulla faucibus urna, ut lobortis lectus diam a nulla.",
  locationName: "Sommarliden, Tyresö",
  googlePlaceId: null,
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

const hemmafest: EventDetails = {
  id: 2,
  createdById: bob.id,
  title: "Hemmafest!",
  description: null,
  locationName: "Industrigatan 7A",
  googlePlaceId: null,
  startsAt: "2026-10-17T16:00:00.000Z",
  endsAt: "2026-10-17T21:00:00.000Z",
  imageUrl: null,
  createdBy: bob,
  announcements: [],
};

const boardGameNight: EventDetails = {
  id: 3,
  createdById: clara.id,
  title: "Board game night with lots of friends and some more friends and maybe perhaps even more friends than you can imagine",
  description: null,
  locationName: "Valhallavägen 79",
  googlePlaceId: null,
  startsAt: "2026-10-23T16:30:00.000Z",
  endsAt: null,
  imageUrl: null,
  createdBy: clara,
  announcements: [],
};

export const exampleEvents: EventDetails[] = [
  exampleEvent,
  hemmafest,
  boardGameNight,
];

export const exampleNotifications: DashboardNotification[] = [
  {
    id: 1,
    type: "req",
    from: bob,
    createdAt: "2026-10-05T18:20:00.000Z",
  },
  {
    id: 2,
    type: "invite",
    from: bob,
    event: { id: hemmafest.id, title: hemmafest.title },
    createdAt: "2026-10-04T12:00:00.000Z",
  },
  {
    id: 3,
    type: "RSVP",
    from: bob,
    event: { id: exampleEvent.id, title: exampleEvent.title },
    RSVPstatus: "ACCEPTED",
    createdAt: "2026-10-02T08:45:00.000Z",
  },
];
