CREATE TABLE `users`
(
    `id`        INTEGER      NOT NULL AUTO_INCREMENT,
    `username`  VARCHAR(255) NOT NULL,
    `createdAt` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `password`  varchar(255) not null,
    PRIMARY KEY (`id`)
);

CREATE TABLE `todos`
(
    `id`          INTEGER      NOT NULL AUTO_INCREMENT,
    `title`       VARCHAR(255) NOT NULL,
    `description` VARCHAR(255),
    `isDone`      BOOLEAN      NOT NULL DEFAULT FALSE,
    `userId`      INTEGER      NOT NULL,
    `createdAt`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE `roles`
(
    `id`          INTEGER      NOT NULL AUTO_INCREMENT,
    `name`        VARCHAR(255) NOT NULL,
    `description` VARCHAR(255),
    `createdAt`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
);

select * from roles;
select * from users;
select * from users_roles_roles;