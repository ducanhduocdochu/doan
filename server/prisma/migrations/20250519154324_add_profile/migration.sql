-- AlterTable
ALTER TABLE `instructorprofile` ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `avatar_url` VARCHAR(191) NULL,
    ADD COLUMN `is_verified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `linkedin_url` VARCHAR(191) NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `rating_avg` DOUBLE NULL,
    ADD COLUMN `total_courses` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `total_students` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `website_url` VARCHAR(191) NULL;
