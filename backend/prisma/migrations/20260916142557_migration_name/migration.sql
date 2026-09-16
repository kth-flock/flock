/*
  Warnings:

  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "RSVP" AS ENUM ('PENDING', 'ACCEPTED', 'MAYBE', 'DECLINED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "imageUrl" TEXT,
ALTER COLUMN "name" SET NOT NULL;

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "hostId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "locationName" TEXT,
    "googlePlaceId" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3),
    "imageUrl" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invitee" (
    "eventId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "rsvp" "RSVP" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Invitee_pkey" PRIMARY KEY ("eventId","userId")
);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitee" ADD CONSTRAINT "Invitee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitee" ADD CONSTRAINT "Invitee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
