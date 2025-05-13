-- CreateTable
CREATE TABLE `InstructorProfile` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `bio` VARCHAR(191) NOT NULL,
    `occupation` VARCHAR(191) NOT NULL,
    `education` VARCHAR(191) NOT NULL,
    `language` VARCHAR(191) NOT NULL,
    `paypal_email` VARCHAR(191) NOT NULL,
    `cv` VARCHAR(191) NOT NULL,
    `is_verify` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `InstructorProfile_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `InstructorProfile` ADD CONSTRAINT `InstructorProfile_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
