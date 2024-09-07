/*
  Warnings:

  - A unique constraint covering the columns `[defaultSlug,projectId]` on the table `statuses` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "statuses" ADD COLUMN     "defaultSlug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "statuses_defaultSlug_projectId_key" ON "statuses"("defaultSlug", "projectId");
