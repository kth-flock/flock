import type { PublicUser } from "@/shared/types/user";
import type { DashboardNotification } from "@/features/dashboard/lib/types";
import type { ExtendedEvent } from "@/shared/types/event";

// Placeholder data used while the event page and dashboard aren't wired to the backend

type ExampleUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string | null;
  pwdHash: string | null;
  createdAt: Date;
};

const alice: ExampleUser = {
  id: 1,
  firstName: "Felix",
  lastName: "Larsson",
  imageUrl: "",
  email: "felix@example.com",
  pwdHash: null,
  createdAt: new Date("2026-09-01T09:00:00.000Z"),
};

const bob: ExampleUser = {
  id: 2,
  firstName: "Sandra",
  lastName: "Kåhre",
  imageUrl: "",
  email: "sandra@example.com",
  pwdHash: null,
  createdAt: new Date("2026-09-02T09:00:00.000Z"),
};

const clara: ExampleUser = {
  id: 3,
  firstName: "Alice",
  lastName: "Cohen",
  imageUrl: "",
  email: "alice@example.com",
  pwdHash: null,
  createdAt: new Date("2026-09-03T09:00:00.000Z"),
};

function toPublicUser(user: ExampleUser): PublicUser {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl,
  };
}

export const exampleFriends: PublicUser[] = [
  toPublicUser(alice),
  toPublicUser(bob),
  toPublicUser(clara),
];

export const exampleEvent: ExtendedEvent = {
  id: 1,
  createdById: alice.id,
  title: "Grillkväll i Tyresö",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ac nunc euismod, ullamcorper nulla vitae, feugiat tellus. Aenean in lorem quam. Pellentesque vitae nisi sed quam tincidunt pharetra. Cras erat mi, blandit non mollis ut, ultrices sit amet nibh. Nullam pharetra iaculis auctor. Nunc lobortis felis id tortor hendrerit accumsan. Nullam nec mollis dolor, a varius odio. Quisque semper luctus accumsan. Nullam et bibendum sapien. Aenean ultrices bibendum imperdiet. Sed rhoncus sapien eget interdum blandit. Vivamus suscipit purus eu massa efficitur eleifend.\n\nVestibulum nec lorem id metus facilisis vehicula. Phasellus magna sem, blandit at bibendum in, sollicitudin sed odio. Nam interdum, mauris et elementum egestas, massa nulla faucibus urna, ut lobortis lectus diam a nulla.",
  locationName: "Sommarliden, Tyresö",
  latitude: 59.2,
  longitude: 18.3,
  startsAt: new Date("2026-10-10T12:00:00.000Z"),
  endsAt: new Date("2026-10-10T16:00:00.000Z"),
  createdAt: new Date("2026-09-20T12:00:00.000Z"),
  imageUrl:
    "https://images.unsplash.com/photo-1508189860359-777d945909ef?w=1200",
  createdBy: alice,
  invitees: [],
  announcements: [
    {
      id: 1,
      eventId: 1,
      userId: alice.id,
      content: "Welcome! Pls bring you car.",
      createdAt: new Date("2026-09-25T09:30:00.000Z"),
      user: alice,
      comments: [
        {
          id: 1,
          announcementId: 1,
          userId: bob.id,
          content: "Hell yes",
          createdAt: new Date("2026-09-25T10:05:00.000Z"),
          user: bob,
        },
        {
          id: 2,
          announcementId: 1,
          userId: clara.id,
          content: "Lfg",
          createdAt: new Date("2026-09-25T11:42:00.000Z"),
          user: clara,
        },
      ],
    },
    {
      id: 2,
      eventId: 1,
      userId: alice.id,
      content: "Imagine a world where we all bring our own cars.",
      createdAt: new Date("2026-09-28T17:15:00.000Z"),
      user: alice,
      comments: [],
    },
  ],
};

const hemmafest: ExtendedEvent = {
  id: 2,
  createdById: bob.id,
  title: "Hemmafest!",
  description: null,
  locationName: "Industrigatan 7A",
  latitude: null,
  longitude: null,
  startsAt: new Date("2026-10-17T16:00:00.000Z"),
  endsAt: new Date("2026-10-17T21:00:00.000Z"),
  imageUrl: null,
  createdAt: new Date("2026-09-22T12:00:00.000Z"),
  createdBy: bob,
  invitees: [],
  announcements: [],
};

const boardGameNight: ExtendedEvent = {
  id: 3,
  createdById: clara.id,
  title:
    "Board game night with lots of friends and some more friends and maybe perhaps even more friends than you can imagine",
  description: null,
  locationName: "Valhallavägen 79",
  latitude: null,
  longitude: null,
  startsAt: new Date("2026-10-23T16:30:00.000Z"),
  endsAt: null,
  imageUrl: null,
  createdAt: new Date("2026-09-24T12:00:00.000Z"),
  createdBy: clara,
  invitees: [],
  announcements: [],
};

export const exampleEvents: ExtendedEvent[] = [
  exampleEvent,
  hemmafest,
  boardGameNight,
];

export const exampleNotifications: DashboardNotification[] = [
  {
    id: 1,
    type: "req",
    from: toPublicUser(bob),
    createdAt: "2026-10-05T18:20:00.000Z",
  },
  {
    id: 2,
    type: "invite",
    from: toPublicUser(bob),
    event: { id: hemmafest.id, title: hemmafest.title },
    createdAt: "2026-10-04T12:00:00.000Z",
  },
  {
    id: 3,
    type: "RSVP",
    from: toPublicUser(bob),
    event: { id: exampleEvent.id, title: exampleEvent.title },
    RSVPstatus: "ACCEPTED",
    createdAt: "2026-10-02T08:45:00.000Z",
  },
];
