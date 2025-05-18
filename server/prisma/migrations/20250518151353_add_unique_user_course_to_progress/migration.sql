/*
  Warnings:

  - A unique constraint covering the columns `[user_id,course_id]` on the table `CourseProgress` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `CourseProgress_user_id_course_id_key` ON `CourseProgress`(`user_id`, `course_id`);
