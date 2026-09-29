// Shapes returned by GET /events/:eventId (dates arrive as ISO strings)

export type EventUser = {
  id: number;
  firstName: string;
  lastName: string;
  imageUrl: string | null;
};

export type EventComment = {
  id: number;
  announcementId: number;
  userId: number;
  content: string;
  createdAt: string;
  user: EventUser;
};

export type EventAnnouncement = {
  id: number;
  eventId: number;
  userId: number;
  content: string;
  createdAt: string;
  user: EventUser;
  comments: EventComment[];
};

export type EventDetails = {
  id: number;
  createdById: number;
  title: string;
  description: string | null;
  locationName: string | null;
  googlePlaceId: string | null;
  startsAt: string;
  endsAt: string | null;
  imageUrl: string | null;
  createdBy: EventUser;
  announcements: EventAnnouncement[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// Returns null when the event doesn't exist or the id is invalid
export async function getEvent(eventId: string): Promise<EventDetails | null> {
  const response = await fetch(`${API_URL}/events/${eventId}`, {
    cache: "no-store",
  });

  if (response.status === 400 || response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch event ${eventId}: ${response.status}`);
  }

  return response.json();
}

// Placeholder data used while the event page isn't wired to the backend

const alice: EventUser = {
  id: 1,
  firstName: "Felix",
  lastName: "Larsson",
  imageUrl: null,
};

const bob: EventUser = {
  id: 2,
  firstName: "Sandra",
  lastName: "Kåhre",
  imageUrl: null,
};

const clara: EventUser = {
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
    "Bring a blanket and something to share! We'll meet by the Copper Tents and find a sunny spot.\n\nFrisbee and board games are welcome.",
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
      content: "Welcome everyone! Let me know if you're bringing food so we don't end up with ten bags of chips.",
      createdAt: "2026-09-25T09:30:00.000Z",
      user: alice,
      comments: [
        {
          id: 1,
          announcementId: 1,
          userId: bob.id,
          content: "I'll bring cinnamon buns!",
          createdAt: "2026-09-25T10:05:00.000Z",
          user: bob,
        },
        {
          id: 2,
          announcementId: 1,
          userId: clara.id,
          content: "Fruit salad from me 🍓",
          createdAt: "2026-09-25T11:42:00.000Z",
          user: clara,
        },
      ],
    },
    {
      id: 2,
      eventId: 1,
      userId: alice.id,
      content: "Forecast looks good for Saturday. If it rains we'll move to my place instead.",
      createdAt: "2026-09-28T17:15:00.000Z",
      user: alice,
      comments: [],
    },
  ],
};
