/*
  Warnings:

  - You are about to drop the column `is_verified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `method` on the `users` table. All the data in the column will be lost.
  - Added the required column `client_id` to the `accounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "client_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "is_verified",
DROP COLUMN "method",
ADD COLUMN     "is_enabled" BOOLEAN NOT NULL DEFAULT false;
