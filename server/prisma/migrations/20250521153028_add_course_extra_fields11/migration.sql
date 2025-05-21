/*
  Warnings:

  - You are about to drop the column `createdAt` on the `cartcourse` table. All the data in the column will be lost.
  - You are about to drop the column `fullDescription` on the `course` table. All the data in the column will be lost.
  - You are about to drop the column `targetStudents` on the `course` table. All the data in the column will be lost.
  - You are about to drop the column `chapterNumber` on the `courselecture` table. All the data in the column will be lost.
  - You are about to drop the column `chapterTitle` on the `courselecture` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `courserating` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `favoritecourse` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `cartcourse` DROP COLUMN `createdAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `course` DROP COLUMN `fullDescription`,
    DROP COLUMN `targetStudents`,
    ADD COLUMN `full_description` TEXT NULL,
    ADD COLUMN `target_students` TEXT NULL;

-- AlterTable
ALTER TABLE `courselecture` DROP COLUMN `chapterNumber`,
    DROP COLUMN `chapterTitle`,
    ADD COLUMN `chapter_number` INTEGER NULL,
    ADD COLUMN `chapter_title` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `courserating` DROP COLUMN `createdAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `favoritecourse` DROP COLUMN `createdAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
