-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 18-03-2025 a las 02:42:13
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bd_farma`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `ID_Categoria` int(11) NOT NULL,
  `nombre_categoria` varchar(100) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `imagen_categoria` varchar(255) DEFAULT NULL,
  `fecha_actualizacion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `categoria` (`ID_Categoria`, `nombre_categoria`, `descripcion`, `imagen_categoria`, `fecha_actualizacion`) VALUES
(1, 'Analgésicos', 'Medicamentos para el dolor', 'analgesicos.jpg', '2023-10-01 10:00:00'),
(2, 'Antibióticos', 'Medicamentos para infecciones', 'antibioticos.jpg', '2023-10-01 10:05:00'),
(3, 'Antihistamínicos', 'Medicamentos para alergias', 'antihistaminicos.jpg', '2023-10-01 10:10:00'),
(4, 'Antiinflamatorios', 'Medicamentos para inflamaciones', 'antiinflamatorios.jpg', '2023-10-01 10:15:00'),
(5, 'Vitaminas', 'Suplementos vitamínicos', 'vitaminas.jpg', '2023-10-01 10:20:00'),
(6, 'Antipiréticos', 'Medicamentos para la fiebre', 'antipireticos.jpg', '2023-10-01 10:25:00'),
(7, 'Antidepresivos', 'Medicamentos para la depresión', 'antidepresivos.jpg', '2023-10-01 10:30:00'),
(8, 'Antiacidos', 'Medicamentos para la acidez', 'antiacidos.jpg', '2023-10-01 10:35:00');

-- --------------------------------------------------------


-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado`
--

CREATE TABLE `estado` (
  `ID_ESTADO` int(11) NOT NULL,
  `nombre_estado` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `estado` (`ID_ESTADO`, `nombre_estado`) VALUES
(1, 'Activo'),
(2, 'Inactivo');

-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `imagen`
--
CREATE TABLE `imagen` (
  `ID_Imagen` int(11) NOT NULL,
  `imagen_producto` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `ID_Usuario` int(11) DEFAULT NULL,
  `ID_Producto` int(11) DEFAULT NULL,
  `ID_Ubicacion` int(11) DEFAULT NULL,
  `ID_Laboratorio` int(11) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `imagen` (`ID_Imagen`, `imagen_producto`, `descripcion`, `ID_Usuario`, `ID_Producto`, `ID_Ubicacion`, `ID_Laboratorio`) VALUES
(1, 'Paracetamol.jpg', 'Imagen del producto 1', 1, 1, 1, 1),
(2, 'Amoxicilina.jpg', 'Imagen del producto 2', 2, 2, 2, 2),
(3, 'Loratadina.jpg', 'Imagen del producto 3', 3, 3, 3, 3),
(4, 'Ibuprofeno.jpg', 'Imagen del producto 4', 4, 4, 4, 4),
(5, 'Vitamina.jpg', 'Imagen del producto 5', 5, 5, 5, 5),
(6, 'Dexametasona.jpg', 'Imagen del producto 6', 6, 6, 6, 6),
(7, 'Fluoxetina.jpg', 'Imagen del producto 7', 7, 7, 7, 7),
(8, 'Omeprazol.jpg', 'Imagen del producto 8', 8, 8, 8, 8);

-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `laboratorio`
--

CREATE TABLE `laboratorio` (
  `ID_Laboratorio` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `correo_electronico` varchar(100) DEFAULT NULL,
  `pagina_web` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `laboratorio` (`ID_Laboratorio`, `nombre`, `direccion`, `ciudad`, `telefono`, `correo_electronico`, `pagina_web`) VALUES
(1, 'Laboratorios Lafrancol', 'Carrera 42 # 3 Sur – 81', 'Medellín', '604-3199900', 'contacto@lafrancol.com', 'https://www.lafrancol.com'),
(2, 'Tecnoquímicas S.A.', 'Avenida Pasoancho # 41-81', 'Cali', '602-3313131', 'info@tecnoquimicas.com', 'https://www.tecnoquimicas.com'),
(3, 'Laboratorios MK', 'Carrera 9 # 100-7', 'Bogotá', '601-6200600', 'servicio@mk.com.co', 'https://www.mklab.co'),
(4, 'Laboratorios Farmalisto', 'Calle 93B # 17-25', 'Bogotá', '601-5087555', 'contacto@farmalisto.com.co', 'https://www.farmalisto.com.co'),
(5, 'Laboratorios Baxter', 'Autopista Norte # 118-30', 'Bogotá', '601-6581000', 'baxter@baxter.com', 'https://www.baxter.com.co'),
(6, 'Laboratorio Roemmers', 'Calle 100 # 8A-55', 'Bogotá', '601-7440909', 'contacto@roemmers.com.co', 'https://www.roemmers.com.co'),
(7, 'Laboratorios Abbott', 'Carrera 15 # 103-30', 'Bogotá', '601-5309900', 'abbott@abbott.com.co', 'https://www.abbott.com.co'),
(8, 'Laboratorios Genfar', 'Carrera 51 # 12 Sur – 168', 'Itagüí', '604-3720000', 'servicio@genfar.com.co', 'https://www.genfar.com'),
(9, 'Laboratorios Pfizer', 'Calle 93A # 13-24', 'Bogotá', '601-6002300', 'pfizer@pfizer.com.co', 'https://www.pfizer.com.co'),
(10, 'Laboratorios Synthesis', 'Carrera 67 # 75-36', 'Barranquilla', '605-3457890', 'contacto@synthesis.com.co', 'https://www.synthesis.com.co'),
(11, 'Laboratorios Alianza', 'Calle 80 # 68G – 59', 'Bogotá', '601-2939292', 'alianza@labalianza.com', 'https://www.labalianza.com'),
(12, 'Laboratorios Servier', 'Carrera 7 # 71-52 Torre B', 'Bogotá', '601-7423000', 'contacto@servier.com.co', 'https://www.servier.com.co');



-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimiento`
--
CREATE TABLE `movimiento` (
  `ID_STOCK` int(11) NOT NULL,
  `ProductoID_Producto` int(11) NOT NULL,
  `PresentacionID_Presentacion` int(11) NOT NULL,
  `UsuarioID_Usuario` int(11) DEFAULT NULL,
  `fecha_hora_movimiento` datetime NOT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `unidad_por_blister` int(11) DEFAULT NULL,
  `cantidad_blister` int(11) DEFAULT NULL,
  `tipo_movimiento` enum('Entrada','Salida', 'Devolucion','Descarte') DEFAULT NULL,
  `motivo` enum('Venta','Entrada_producto','Devolucion_producto','Error_venta','Vencimiento','Defectuoso') DEFAULT NULL,
  `observaciones` varchar(255) DEFAULT NULL,
  `valor_unitario_movimiento` decimal(10,2) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `total_venta` decimal(10,2) DEFAULT NULL,
  `UbicacionID_Ubicacion` int(11) DEFAULT NULL,
  `iva_aplicado` decimal(19,2) DEFAULT NULL,
  `movimiento_referencia` INT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `movimiento` 
(`ID_STOCK`, `ProductoID_Producto`, `PresentacionID_Presentacion`, `UsuarioID_Usuario`, `fecha_hora_movimiento`, `cantidad`, `unidad_por_blister`, `cantidad_blister`, `tipo_movimiento`, `motivo`, `observaciones`, `valor_unitario_movimiento`, `subtotal`, `total_venta`, `UbicacionID_Ubicacion`, `iva_aplicado`) 
VALUES
-- Entrada de Cápsulas (Paracetamol) 5 blister de 10 unidades = 50 unidades
(1, 1, 1, 1, '2023-10-01 12:00:00', NULL, 5, 10, 'Entrada', 'Entrada_producto', 'reponer_producto', NULL, NULL, NULL, 1, NULL),

-- Salida de Tabletas (Amoxicilina) 10 blister de 20 unidades = 200 unidades
(2, 2, 2, 2, '2023-10-01 12:05:00', NULL, 10, 20, 'Salida', 'Venta', 'ninguna', 10.00, 200.00, 238.00, 2, 38.00),

-- Ajuste de Jarabe (Loratadina) 30 frascos
(3, 3, 3, 3, '2023-10-01 12:10:00', 30, NULL, NULL, 'Ajuste', 'Error_venta', 'ninguna', 15.00, 450.00, 450.00, 3, 0.00),

-- Entrada de Gotas (Ibuprofeno) 40 frascos
(4, 4, 4, 4, '2023-10-01 12:15:00', 40, NULL, NULL, 'Entrada', 'Entrada_producto', 'ninguna', NULL, NULL, NULL, 4, NULL),

-- Salida de Crema (Vitamina C) 50 frascos
(5, 5, 5, 5, '2023-10-01 12:20:00', 50, NULL, NULL, 'Salida', 'Venta', 'ninguna', 25.00, 1250.00, 1487.50, 5, 237.50),

-- Entrada de Inyectable (Dexametasona) 60 frascos
(6, 6, 6, 6, '2023-10-01 12:25:00', 60, NULL, NULL, 'Entrada', 'Entrada_producto', 'ninguna', NULL, NULL, NULL, 6, NULL),

-- Salida de Tabletas (Fluoxetina) 20 blister de 40 unidades = 800 unidades
(7, 7, 2, 7, '2023-10-01 12:30:00', NULL, 20, 40, 'Salida', 'Venta', 'ninguna', 35.00, 2450.00, 2915.50, 7, 465.50),

-- Entrada de Cápsulas (Omeprazol) 25 blister de 50 unidades = 1250 unidades
(8, 8, 1, 8, '2023-10-01 12:35:00', NULL, 25, 50, 'Entrada', 'Entrada_producto', 'ninguna', NULL, NULL, NULL, 8, NULL);



-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `presentacion`
--

CREATE TABLE `presentacion` (
  `ID_Presentacion` int(11) NOT NULL,
  `nombre_presentacion` varchar(100) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `presentacion` (`ID_Presentacion`, `nombre_presentacion`, `descripcion`) VALUES
(1, 'Cápsulas', 'Cápsulas '),
(2, 'Tabletas', 'Tabletas'),
(3, 'Jarabe', 'Jarabe líquido'),
(4, 'Gotas', 'Gotas'),
(5, 'Crema', 'Crema'),
(6, 'Inyectable', 'Solución inyectable');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `ID_PRODUCTO` int(11) NOT NULL,
  `fecha_entrada` date DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `valor_unitario` decimal(19,2) NOT NULL,
  `LaboratorioID_Laboratorio` int(11) DEFAULT NULL,
  `CategoriaID_Categoria` int(11) DEFAULT NULL,
  `PresentacionID_Presentacion` int(11) DEFAULT NULL,
  `EstadoID_Estado` int(11) DEFAULT NULL,
  `stock_minimo` int(11) NOT NULL,
  `contenido_neto` varchar(50) DEFAULT NULL,
  `cantidad_frascos` int(11) DEFAULT NULL,
   `unidades_por_blister` int(11) DEFAULT NULL,
  `cantidad_blister` int(11) DEFAULT NULL,
  `cantidad_unidades` int(11) DEFAULT NULL,
  `fecha_actualizacion` datetime DEFAULT NULL,
  `lote` varchar(50) NOT NULL,
  `fecha_vencimiento` date NOT NULL,
  `codigo_barras` varchar(255) DEFAULT NULL,
  `IVA` decimal(19,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `producto` (`ID_PRODUCTO`, `fecha_entrada`, `nombre`, `descripcion`, `valor_unitario`, `LaboratorioID_Laboratorio`, `CategoriaID_Categoria`, `PresentacionID_Presentacion`, `EstadoID_Estado`, `stock_minimo`, `contenido_neto`, `cantidad_frascos`, `unidades_por_blister`, `cantidad_blister`, `cantidad_unidades`, `fecha_actualizacion`, `lote`, `fecha_vencimiento`, `codigo_barras`, `IVA`) VALUES
(1, '2023-10-01', 'Paracetamol', 'Analgésico y antipirético', 5.00, 1, 1, 1, 1, 50, NULL, NULL, 10, 5, 50, '2023-10-01 13:00:00', 'LOT123', '2026-10-01', '1234567890123', NULL),
(2, '2023-10-01', 'Amoxicilina', 'Antibiótico de amplio espectro', 10.00, 2, 2, 2, 1, 60, NULL, NULL, 20, 10, 200, '2023-10-01 13:05:00', 'LOT456', '2026-10-01', '2345678901234', NULL),
(3, '2023-10-01', 'Loratadina', 'Antihistamínico', 15.00, 3, 3, 3, 1, 40, '100 ml', 10, NULL, NULL, NULL, '2023-10-01 13:10:00', 'LOT789', '2026-10-01', '3456789012345', NULL),
(4, '2023-10-01', 'Ibuprofeno', 'Antiinflamatorio no esteroideo', 20.00, 4, 4, 4, 1, 60, '50 ml', 20, NULL, NULL, NULL, '2023-10-01 13:15:00', 'LOT101', '2026-10-01', '4567890123456', NULL),
(5, '2023-10-01', 'Vitamina C', 'Suplemento vitamínico', 25.00, 5, 5, 5, 1, 100, '30 g', 30, NULL, NULL, NULL, '2023-10-01 13:20:00', 'LOT112', '2026-10-01', '5678901234567', NULL),
(6, '2023-10-01', 'Dexametasona', 'Corticosteroide', 30.00, 6, 6, 6, 1, 50, NULL, NULL, 30, 15, 450, '2023-10-01 13:25:00', 'LOT131', '2026-10-01', '6789012345678', NULL),
(7, '2023-10-01', 'Fluoxetina', 'Antidepresivo', 35.00, 7, 7, 2, 1, 20, NULL, NULL, 40, 20, 800, '2023-10-01 13:30:00', 'LOT415', '2026-10-01', '7890123456789', NULL),
(8, '2023-10-01', 'Omeprazol', 'Antiacido', 40.00, 8, 8, 2, 1, 10, NULL, NULL, 50, 25, 1250, '2023-10-01 13:35:00', 'LOT161', '2026-10-01', '8901234567890', NULL);


-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `ID_ROL` int(11) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `permisos` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `rol` (`ID_ROL`, `descripcion`, `permisos`) VALUES
(1, 'Admin', 'Todos los permisos'),
(2, 'Empleado', 'Registrar producto, entradas y salidas, ver informes');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ubicacion`
--

CREATE TABLE `ubicacion` (
  `ID_Ubicacion` int(11) NOT NULL,
  `nombre_ubicacion` varchar(100) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `ubicacion` (`ID_Ubicacion`, `nombre_ubicacion`, `descripcion`) VALUES
(1, 'Almacén 1', 'Almacén principal'),
(2, 'Almacén 2', 'Almacén secundario'),
(3, 'Estantería A', 'Estantería para medicamentos comunes'),
(4, 'Estantería B', 'Estantería para medicamentos controlados'),
(5, 'Refrigerador 1', 'Refrigerador para medicamentos termolábiles'),
(6, 'Refrigerador 2', 'Refrigerador para vacunas'),
(7, 'Estantería C', 'Estantería para productos de venta libre'),
(8, 'Estantería D', 'Estantería para productos de higiene personal');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `ID_Usuario` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `nombre_usuario` varchar(100) DEFAULT NULL,
  `contrasena_usuario` varchar(255) DEFAULT NULL,
  `fecha_registro` datetime DEFAULT NULL,
  `ROLID_ROL` int(11) DEFAULT NULL,
  `reset_token` varchar(255) NULL,
  `reset_token_expires` datetime NULL,
  `reset_code`varchar(255) NULL,
  `reset_code_expires` datetime NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `usuario` (`ID_Usuario`, `nombre`, `apellido`, `correo`, `nombre_usuario`, `contrasena_usuario`, `fecha_registro`, `ROLID_ROL`) VALUES
(1, 'Cristian', 'Aguilera', 'cristianagui1101@gmail.com', 'cris123', '12345678', '2025-02-01 14:00:00', 1),
(2, 'Laura', 'Fernández', 'laura.fernandez@yahoo.com', 'laura_f', 'Lau9876*', '2023-10-01 14:05:00', 2),
(3, 'Javier', 'Gómez', 'javier.gomez@hotmail.com', 'javierg', 'Jav!4567', '2023-10-01 14:10:00', 2),
(4, 'María', 'Pérez', 'maria.perez@gmail.com', 'mariap', 'Mar#3210', '2023-10-01 14:15:00', 2),
(5, 'Andrés', 'Martínez', 'andres.martinez@gmail.com', 'andresm', 'And$6543', '2023-10-01 14:20:00', 2),
(6, 'Sofía', 'Torres', 'sofia.torres@outlook.com', 'sofiat', 'Sof%9871', '2023-10-01 14:25:00', 2),
(7, 'Diego', 'Hernández', 'diego.hernandez@gmail.com', 'diegoh', 'Die&3456', '2023-10-01 14:30:00', 2),
(8, 'Valentina', 'Ruiz', 'valentina.ruiz@gmail.com', 'valentinar', 'Val!2345', '2023-10-01 14:35:00', 2);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`ID_Categoria`);


--
-- Indices de la tabla `estado`
--
ALTER TABLE `estado`
  ADD PRIMARY KEY (`ID_ESTADO`);

--
-- Indices de la tabla `imagen`
--
ALTER TABLE `imagen`
  ADD PRIMARY KEY (`ID_Imagen`),
  ADD KEY `ID_Usuario` (`ID_Usuario`),
  ADD KEY `ID_Producto` (`ID_Producto`),
  ADD KEY `ID_Ubicacion` (`ID_Ubicacion`),
  ADD KEY `ID_Laboratorio` (`ID_Laboratorio`);

--
-- Indices de la tabla `laboratorio`
--
ALTER TABLE `laboratorio`
  ADD PRIMARY KEY (`ID_Laboratorio`);

--
-- Indices de la tabla `movimiento`
--
ALTER TABLE `movimiento`
  ADD PRIMARY KEY (`ID_STOCK`),
  ADD KEY `ProductoID_Producto` (`ProductoID_Producto`),
  ADD KEY `PresentacionID_Presentacion` (`PresentacionID_Presentacion`),
  ADD KEY `UsuarioID_Usuario` (`UsuarioID_Usuario`),
  ADD KEY `UbicacionID_Ubicacion` (`UbicacionID_Ubicacion`);

--
-- Indices de la tabla `presentacion`
--
ALTER TABLE `presentacion`
  ADD PRIMARY KEY (`ID_Presentacion`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`ID_PRODUCTO`),
  ADD KEY `LaboratorioID_Laboratorio` (`LaboratorioID_Laboratorio`),
  ADD KEY `CategoriaID_Categoria` (`CategoriaID_Categoria`),
  ADD KEY `PresentacionID_Presentacion` (`PresentacionID_Presentacion`),
  ADD KEY `EstadoID_Estado` (`EstadoID_Estado`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`ID_ROL`);

--
-- Indices de la tabla `ubicacion`
--
ALTER TABLE `ubicacion`
  ADD PRIMARY KEY (`ID_Ubicacion`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`ID_Usuario`),
  ADD KEY `ROLID_ROL` (`ROLID_ROL`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `ID_Categoria` int(11) NOT NULL AUTO_INCREMENT;



--
-- AUTO_INCREMENT de la tabla `estado`
--
ALTER TABLE `estado`
  MODIFY `ID_ESTADO` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `imagen`
--
ALTER TABLE `imagen`
  MODIFY `ID_Imagen` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `laboratorio`
--
ALTER TABLE `laboratorio`
  MODIFY `ID_Laboratorio` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `movimiento`
--
ALTER TABLE `movimiento`
  MODIFY `ID_STOCK` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `presentacion`
--
ALTER TABLE `presentacion`
  MODIFY `ID_Presentacion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `ID_PRODUCTO` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `ID_ROL` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ubicacion`
--
ALTER TABLE `ubicacion`
  MODIFY `ID_Ubicacion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `ID_Usuario` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--


--
-- Filtros para la tabla `imagen`
--
ALTER TABLE `imagen`
  ADD CONSTRAINT `imagen_ibfk_1` FOREIGN KEY (`ID_Usuario`) REFERENCES `usuario` (`ID_Usuario`),
  ADD CONSTRAINT `imagen_ibfk_2` FOREIGN KEY (`ID_Producto`) REFERENCES `producto` (`ID_PRODUCTO`),
  ADD CONSTRAINT `imagen_ibfk_3` FOREIGN KEY (`ID_Ubicacion`) REFERENCES `ubicacion` (`ID_Ubicacion`),
  ADD CONSTRAINT `imagen_ibfk_4` FOREIGN KEY (`ID_Laboratorio`) REFERENCES `laboratorio` (`ID_Laboratorio`);

--
-- Filtros para la tabla `movimiento`
--
ALTER TABLE `movimiento`
  ADD CONSTRAINT `movimiento_ibfk_1` FOREIGN KEY (`ProductoID_Producto`) REFERENCES `producto` (`ID_PRODUCTO`),
  ADD CONSTRAINT `movimiento_ibfk_2` FOREIGN KEY (`PresentacionID_Presentacion`) REFERENCES `presentacion` (`ID_Presentacion`),
  ADD CONSTRAINT `movimiento_ibfk_3` FOREIGN KEY (`UsuarioID_Usuario`) REFERENCES `usuario` (`ID_Usuario`),
  ADD CONSTRAINT `movimiento_ibfk_4` FOREIGN KEY (`UbicacionID_Ubicacion`) REFERENCES `ubicacion` (`ID_Ubicacion`);

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`LaboratorioID_Laboratorio`) REFERENCES `laboratorio` (`ID_Laboratorio`) ON DELETE SET NULL,
  ADD CONSTRAINT `producto_ibfk_2` FOREIGN KEY (`CategoriaID_Categoria`) REFERENCES `categoria` (`ID_Categoria`),
  ADD CONSTRAINT `producto_ibfk_3` FOREIGN KEY (`PresentacionID_Presentacion`) REFERENCES `presentacion` (`ID_Presentacion`),
  ADD CONSTRAINT `producto_ibfk_4` FOREIGN KEY (`EstadoID_Estado`) REFERENCES `estado` (`ID_ESTADO`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`ROLID_ROL`) REFERENCES `rol` (`ID_ROL`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;