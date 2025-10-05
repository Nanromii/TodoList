CREATE TABLE `users` (
                         `id` INTEGER NOT NULL AUTO_INCREMENT,
                         `username` VARCHAR(255) NOT NULL,
                         `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                         PRIMARY KEY (`id`)
);

CREATE TABLE `todos` (
                         `id` INTEGER NOT NULL AUTO_INCREMENT,
                         `title` VARCHAR(255) NOT NULL,
                         `description` VARCHAR(255),
                         `isDone` BOOLEAN NOT NULL DEFAULT FALSE,
                         `userId` INTEGER NOT NULL,
                         `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                         PRIMARY KEY (`id`),
                         FOREIGN KEY (`userId`) REFERENCES `users`(`id`)
                             ON UPDATE CASCADE
                             ON DELETE CASCADE
);
