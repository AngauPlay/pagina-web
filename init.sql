-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Servidor: db
-- Tiempo de generación: 24-03-2026 a las 20:10:48
-- Versión del servidor: 11.4.10-MariaDB-ubu2404
-- Versión de PHP: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "-03:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `angau`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`, `slug`) VALUES
(1, 'Actualidad', 'actualidad'),
(2, 'Deportes', 'deportes'),
(3, 'Tecnología', 'tecnologia'),
(4, 'Cultura', 'cultura'),
(5, 'Economía', 'economia'),
(6, 'Espectáculos', 'espectaculos'),
(7, 'Salud', 'salud');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `noticias`
--

CREATE TABLE `noticias` (
  `id` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `copete` text NOT NULL,
  `cuerpo` longtext NOT NULL,
  `imagen_url` varchar(255) NOT NULL,
  `fecha_publicacion` timestamp NULL DEFAULT current_timestamp(),
  `categoria_id` int(11) NOT NULL,
  `autor` varchar(100) NOT NULL,
  `estado` enum('borrador','publicado') NOT NULL DEFAULT 'borrador'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `noticias`
--

INSERT INTO `noticias` (`id`, `titulo`, `slug`, `copete`, `cuerpo`, `imagen_url`, `fecha_publicacion`, `categoria_id`, `autor`, `estado`) VALUES
(1, 'Docker revoluciona el desarrollo local', 'docker-revoluciona-desarrollo', 'El uso de contenedores facilita la configuración de entornos PHP y MariaDB.', 'Configurar una base de datos ahora es tan simple como escribir un archivo YAML y ejecutar un comando. Esto elimina el clásico problema de \"en mi máquina funciona\".', 'https://picsum.photos/800/400?random=1', '2026-03-21 19:06:51', 3, 'Juan Pérez', 'publicado'),
(2, 'Final apasionante en el torneo local', 'final-apasionante-torneo', 'El equipo visitante logró la victoria en el último minuto del encuentro.', 'Con un gol de media distancia, se cerró una jornada histórica para el deporte regional. La hinchada celebró hasta altas horas de la madrugada.', 'https://picsum.photos/800/400?random=2', '2026-03-21 19:06:51', 2, 'Ana Gomez', 'publicado'),
(3, 'Nuevas tendencias en el mercado digital', 'tendencias-mercado-digital', 'La economía se transforma hacia modelos de suscripción y servicios en la nube.', 'Analistas aseguran que las empresas que no se adapten a la transformación digital perderán competitividad en los próximos dos años.', 'https://picsum.photos/800/400?random=3', '2026-03-21 19:06:51', 5, 'Carlos Slim', 'borrador');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('administrador','editor') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indices de la tabla `noticias`
--
ALTER TABLE `noticias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug_unico` (`slug`),
  ADD KEY `fk_categoria` (`categoria_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `noticias`
--
ALTER TABLE `noticias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `noticias`
--
ALTER TABLE `noticias`
  ADD CONSTRAINT `fk_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
