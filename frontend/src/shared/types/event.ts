import { Prisma } from "@prisma/types";

export type ExtendedEvent = Prisma.EventGetPayload<{
  include: {
    createdBy: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
        imageUrl: true;
      };
    };
    invitees: {
      include: {
        user: {
          select: {
            id: true;
            firstName: true;
            lastName: true;
            imageUrl: true;
          };
        };
      };
    };
    announcements: {
      include: {
        user: {
          select: {
            id: true;
            firstName: true;
            lastName: true;
            imageUrl: true;
          };
        };
        comments: {
          include: {
            user: {
              select: {
                id: true;
                firstName: true;
                lastName: true;
                imageUrl: true;
              };
            };
          };
        };
      };
    };
  };
}>;

export type ExtendedAnnouncment = Prisma.AnnouncementGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
        imageUrl: true;
      };
    };
    comments: {
      include: {
        user: {
          select: {
            id: true;
            firstName: true;
            lastName: true;
            imageUrl: true;
          };
        };
      };
    };
  };
}>;

export type ExtendedComment = Prisma.CommentGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
        imageUrl: true;
      };
    };
  };
}>;

export type ExtendedInvitee = Prisma.InviteeGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
        imageUrl: true;
      };
    };
  };
}>;
