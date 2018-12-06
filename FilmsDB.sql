-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-07-2018 a las 21:29:27
-- Versión del servidor: 10.1.30-MariaDB
-- Versión de PHP: 7.2.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `FilmsDB`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `film`
--

CREATE TABLE `film` (
  `idFilm` bigint(20) UNSIGNED NOT NULL,
  `filmName` varchar(50) DEFAULT NULL,
  `filmDuration` int(11) DEFAULT NULL,
  `memoryAddress` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sees`
--

CREATE TABLE `sees` (
  `viewDate` date DEFAULT NULL,
  `idFilm` bigint(20) UNSIGNED NOT NULL,
  `userName` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `userName` varchar(50) NOT NULL,
  `passwords` varchar(255) DEFAULT NULL,
  `userEmail` varchar(254) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resetPasswordCode`
--

CREATE TABLE passwordResetCode (
  userEmail varchar(254) NOT NULL,
  resetCode int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`userName`, `passwords`, `userEmail`) VALUES
('Ignacio', 'Root1224', 'ignaciocabrera1224@gmail.com');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `film`
--
ALTER TABLE `film`
  ADD PRIMARY KEY (`idFilm`),
  ADD UNIQUE KEY `idFilm` (`idFilm`);

--
-- Indices de la tabla `sees`
--
ALTER TABLE `sees`
  ADD PRIMARY KEY (`userName`),
  ADD UNIQUE KEY `idFilm` (`idFilm`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userName`);

--
-- Indices de la tabla passwordresetcode
--
ALTER TABLE `passwordresetcode` 
  ADD PRIMARY KEY (userEmail);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `film`
--
ALTER TABLE `film`
  MODIFY `idFilm` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `sees`
--
ALTER TABLE `sees`
  MODIFY `idFilm` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `sees`
--
ALTER TABLE `sees`
  ADD CONSTRAINT `fk_film` FOREIGN KEY (`idFilm`) REFERENCES `film` (`idFilm`),
  ADD CONSTRAINT `fk_user` FOREIGN KEY (`userName`) REFERENCES `user` (`userName`);
COMMIT;

--
-- Filtros para la tabla `resetpasswordcode`
--
ALTER TABLE `passwordresetcode`
  ADD CONSTRAINT `fk_passwordresetcode` FOREIGN KEY (`userEmail`) REFERENCES `user` (`userEmail`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
