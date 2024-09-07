/*
  Warnings:

  - The primary key for the `member_on_project` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[userId,projectId]` on the table `member_on_project` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "member_on_project" DROP CONSTRAINT "member_on_project_pkey",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "member_on_project_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "member_on_project_userId_projectId_key" ON "member_on_project"("userId", "projectId");
