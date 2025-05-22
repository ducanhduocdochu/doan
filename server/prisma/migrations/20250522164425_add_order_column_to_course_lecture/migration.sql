/*
  Warnings:

  - Added the required column `order` to the `CourseLecture` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `courselecture` ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `duration` INTEGER NULL,
    ADD COLUMN `order` INTEGER NOT NULL;
