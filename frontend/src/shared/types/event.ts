import type { Prisma } from "@prisma/types";

type PublicUserSelect = {
  select: {
    id: true;
    firstName: true;
    lastName: true;
    imageUrl: true;
  };
};

type WithUser = {
  include: {
    user: PublicUserSelect;
  };
};

export type ExtendedEvent = Prisma.EventGetPayload<{
  include: {
    createdBy: PublicUserSelect;
    invitees: WithUser;
    announcements: {
      include: {
        user: PublicUserSelect;
        comments: WithUser;
      };
    };
  };
}>;

export type ExtendedAnnouncement = Prisma.AnnouncementGetPayload<{
  include: {
    user: PublicUserSelect;
    comments: WithUser;
  };
}>;

export type ExtendedComment = Prisma.CommentGetPayload<WithUser>;

export type ExtendedInvitee = Prisma.InviteeGetPayload<WithUser>;
