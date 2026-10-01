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

// Matches the RSVP enum in the Prisma schema
export type Rsvp = "PENDING" | "ACCEPTED" | "MAYBE" | "DECLINED";
