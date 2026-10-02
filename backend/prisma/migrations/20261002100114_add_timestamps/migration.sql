/*
  Warnings:

  - You are about to drop the column `acceptedAt` on the `Friendship` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Friendship" DROP COLUMN "acceptedAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3);
