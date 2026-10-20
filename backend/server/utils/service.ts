import { prisma } from "../prisma";
import { EventId } from "@flock/shared/schemas/event";
import { UserId } from "@flock/shared/schemas/user";
import { NotFoundError, ForbiddenError } from "./errors";

export async function assertEventHost(
  eventId: EventId,
  userId: UserId,
  forbiddenMessage: string,
) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { createdById: true },
  });

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  if (event.createdById !== userId) {
    throw new ForbiddenError(forbiddenMessage);
  }
}
