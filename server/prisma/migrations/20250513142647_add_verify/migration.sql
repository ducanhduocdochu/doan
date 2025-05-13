/*
  Warnings:

  - You are about to drop the column `is_verify` on the `instructorprofile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `instructorprofile` DROP COLUMN `is_verify`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `is_verify` BOOLEAN NOT NULL DEFAULT false;
