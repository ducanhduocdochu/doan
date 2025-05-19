/*
  Warnings:

  - You are about to drop the column `is_verified` on the `instructorprofile` table. All the data in the column will be lost.
  - You are about to drop the column `rating_avg` on the `instructorprofile` table. All the data in the column will be lost.
  - You are about to drop the column `total_courses` on the `instructorprofile` table. All the data in the column will be lost.
  - You are about to drop the column `total_students` on the `instructorprofile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `instructorprofile` DROP COLUMN `is_verified`,
    DROP COLUMN `rating_avg`,
    DROP COLUMN `total_courses`,
    DROP COLUMN `total_students`;
