/*
  Warnings:

  - Made the column `order` on table `statuses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `order` on table `tasks` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "statuses" ALTER COLUMN "order" SET NOT NULL;

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "order" SET NOT NULL;
