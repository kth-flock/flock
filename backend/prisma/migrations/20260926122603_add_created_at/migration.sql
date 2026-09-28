-- RenameColumn
ALTER TABLE "User" RENAME COLUMN "first_name" TO "firstName";
ALTER TABLE "User" RENAME COLUMN "last_name" TO "lastName";

-- AlterTable
ALTER TABLE "User" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
