import type { PublicUser } from "@/shared/types/user";
import type { DashboardNotification } from "@/features/dashboard/lib/types";
import type { ProfileDetails } from "@/features/profile/lib/types";
import type { ExtendedEvent } from "@/shared/types/event";
import type { Rsvp } from "./types";

// Placeholder data used while frontend pages aren't wired to the backend

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
  imageUrl: null,
  email: "felix@example.com",
  pwdHash: null,
  createdAt: new Date("2026-09-16T13:31:00.000Z"),
};

const bob: ExampleUser = {
  id: 2,
  firstName: "Sandra",
  lastName: "Kåhre",
  imageUrl: null,
  email: "sandra@example.com",
  pwdHash: null,
  createdAt: new Date("2026-09-16T14:02:00.000Z"),
};

const clara: ExampleUser = {
  id: 3,
  firstName: "Alice",
  lastName: "Cohen",
  imageUrl: null,
  email: "alice@example.com",
  pwdHash: null,
  createdAt: new Date("2026-09-22T09:15:00.000Z"),
};

const dave: ExampleUser = {
  id: 4,
  firstName: "John",
  lastName: "Smith One",
  imageUrl: null,
  email: "john.one@example.com",
  pwdHash: null,
  createdAt: new Date("2026-09-24T18:40:00.000Z"),
};

const erin: ExampleUser = {
  id: 5,
  firstName: "John",
  lastName: "Smith Two",
  imageUrl: null,
  email: "john.two@example.com",
  pwdHash: null,
  createdAt: new Date("2026-09-26T11:05:00.000Z"),
};

const frank: ExampleUser = {
  id: 6,
  firstName: "John",
  lastName: "Smith Three",
  imageUrl: null,
  email: "john.three@example.com",
  pwdHash: null,
  createdAt: new Date("2026-10-01T08:20:00.000Z"),
};

const grace: ExampleUser = {
  id: 7,
  firstName: "John",
  lastName: "Smith Four",
  imageUrl: null,
  email: "john.four@example.com",
  pwdHash: null,
  createdAt: new Date("2026-10-03T20:45:00.000Z"),
};

function toPublicUser(user: ExampleUser): PublicUser {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl,
  };
}

function toProfileDetails(user: ExampleUser): ProfileDetails {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl,
    createdAt: user.createdAt.toISOString(),
  };
}

export const exampleProfiles: ProfileDetails[] = [
  toProfileDetails(alice),
  toProfileDetails(bob),
  toProfileDetails(clara),
  toProfileDetails(dave),
  toProfileDetails(erin),
  toProfileDetails(frank),
  toProfileDetails(grace),
];

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

export const exampleFriendships: {
  requesterId: number;
  requesteeId: number;
  status: "PENDING" | "ACCEPTED";
}[] = [
  { requesterId: alice.id, requesteeId: bob.id, status: "ACCEPTED" },
  { requesterId: clara.id, requesteeId: alice.id, status: "ACCEPTED" },
  { requesterId: bob.id, requesteeId: clara.id, status: "ACCEPTED" },
  { requesterId: dave.id, requesteeId: bob.id, status: "ACCEPTED" },
  { requesterId: bob.id, requesteeId: erin.id, status: "ACCEPTED" },
  { requesterId: frank.id, requesteeId: bob.id, status: "ACCEPTED" },
  { requesterId: bob.id, requesteeId: grace.id, status: "ACCEPTED" },
  { requesterId: dave.id, requesteeId: erin.id, status: "ACCEPTED" },
  { requesterId: clara.id, requesteeId: dave.id, status: "PENDING" },
  { requesterId: alice.id, requesteeId: dave.id, status: "PENDING" },
  { requesterId: erin.id, requesteeId: alice.id, status: "PENDING" },
];

// Rows of the backend's Invitee table
export const exampleInvitees: {
  eventId: number;
  userId: number;
  rsvp: Rsvp;
  rsvpComment: string | null;
}[] = [
  { eventId: exampleEvent.id, userId: bob.id, rsvp: "ACCEPTED", rsvpComment: null },
  { eventId: exampleEvent.id, userId: clara.id, rsvp: "MAYBE", rsvpComment: null },
  { eventId: exampleEvent.id, userId: dave.id, rsvp: "PENDING", rsvpComment: null },
  { eventId: hemmafest.id, userId: alice.id, rsvp: "ACCEPTED", rsvpComment: null },
  { eventId: hemmafest.id, userId: clara.id, rsvp: "ACCEPTED", rsvpComment: null },
  { eventId: hemmafest.id, userId: erin.id, rsvp: "DECLINED", rsvpComment: null },
  { eventId: boardGameNight.id, userId: alice.id, rsvp: "PENDING", rsvpComment: null },
  { eventId: boardGameNight.id, userId: bob.id, rsvp: "ACCEPTED", rsvpComment: null },
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
