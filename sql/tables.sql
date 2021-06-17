CREATE TABLE `user` (
  `id` int(25) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `surname` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `role` enum('client','professor','admin') NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8

CREATE TABLE `equipment` (
  `id` int(25) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `brand` varchar(50) NOT NULL,
  `type` varchar(50) NOT NULL,
  `model` varchar(50) NOT NULL,
  `status` enum('working','out of service') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `client_visit` (
  `clientId` int(25) unsigned NOT NULL,
  `visitDay` enum('Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo') COLLATE utf8mb4_spanish2_ci NOT NULL,
  `visitDateTime` datetime NOT NULL,
  PRIMARY KEY (`clientId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

CREATE TABLE `professor_schedule` (
  `professorId` int(25) unsigned NOT NULL,
  `day` enum('Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo') COLLATE utf8mb4_spanish2_ci NOT NULL,
  `startHour` time NOT NULL,
  `finishHour` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;CREATE TABLE `user` (
  `id` int(25) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `surname` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `role` enum('client','professor','admin') NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8

CREATE TABLE `equipment` (
  `id` int(25) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `brand` varchar(50) NOT NULL,
  `type` varchar(50) NOT NULL,
  `model` varchar(50) NOT NULL,
  `status` enum('working','out of service') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `client_visit` (
  `clientId` int(25) unsigned NOT NULL,
  `visitDay` enum('Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo') COLLATE utf8mb4_spanish2_ci NOT NULL,
  `visitDateTime` datetime NOT NULL,
  PRIMARY KEY (`clientId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

CREATE TABLE `professor_schedule` (
  `professorId` int(25) unsigned NOT NULL,
  `day` enum('Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo') COLLATE utf8mb4_spanish2_ci NOT NULL,
  `startHour` time NOT NULL,
  `finishHour` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;