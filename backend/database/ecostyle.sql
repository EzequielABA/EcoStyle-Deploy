CREATE DATABASE IF NOT EXISTS ecostyle CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecostyle;

CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    icono VARCHAR(50),
    activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    precio_oferta DECIMAL(10, 2) DEFAULT NULL,
    categoria_id INT NOT NULL,
    stock INT DEFAULT 0,
    imagen VARCHAR(255),
    disponible BOOLEAN DEFAULT TRUE,
    destacado BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE,
    INDEX idx_categoria (categoria_id),
    INDEX idx_precio (precio),
    INDEX idx_disponible (disponible)
) ENGINE=InnoDB;

CREATE TABLE contactos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefono VARCHAR(20),
    asunto VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    leido BOOLEAN DEFAULT FALSE,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE ordenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_orden VARCHAR(20) UNIQUE NOT NULL,
    cliente_nombre VARCHAR(100) NOT NULL,
    cliente_email VARCHAR(150) NOT NULL,
    cliente_telefono VARCHAR(20),
    cliente_direccion TEXT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    estado ENUM('pendiente', 'confirmada', 'enviada', 'entregada', 'cancelada') DEFAULT 'pendiente',
    notas TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_numero_orden (numero_orden),
    INDEX idx_cliente_email (cliente_email),
    INDEX idx_estado (estado),
    INDEX idx_fecha_creacion (fecha_creacion)
) ENGINE=InnoDB;

CREATE TABLE orden_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orden_id INT NOT NULL,
    producto_id INT NOT NULL,
    producto_nombre VARCHAR(150) NOT NULL,
    producto_precio DECIMAL(10, 2) NOT NULL,
    cantidad INT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (orden_id) REFERENCES ordenes(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT,
    INDEX idx_orden_id (orden_id),
    INDEX idx_producto_id (producto_id)
) ENGINE=InnoDB;

INSERT INTO categorias (nombre, descripcion, icono) VALUES
('Hogar Sostenible', 'Productos ecológicos para el hogar', '🏠'),
('Cuidado Personal', 'Cosmética natural y productos de higiene', '🧴'),
('Alimentación', 'Alimentos orgánicos y saludables', '🥗'),
('Moda Consciente', 'Ropa y accesorios sostenibles', '👕'),
('Zero Waste', 'Productos reutilizables y sin plástico', '♻️');


INSERT INTO `productos` (`id`, `nombre`, `descripcion`, `precio`, `precio_oferta`, `categoria_id`, `stock`, `imagen`, `disponible`, `destacado`, `fecha_creacion`, `fecha_actualizacion`) VALUES
(1, 'Cepillo de Bambú', 'Cepillo dental 100% biodegradable hecho de bambú orgánico', 250.00, 199.00, 2, 50, 'https://ecostyle.infinityfree.me/images/mokups-Ecostyle/cuidado-personal/Cepillo-de-Bambu.jpg', 1, 1, '2025-11-10 22:18:38', '2025-11-11 02:02:52'),
(2, 'Bolsas Reutilizables Set x5', 'Set de bolsas de tela orgánica para compras', 450.00, NULL, 5, 30, 'https://ecostyle.infinityfree.me/images/mokups-Ecostyle/zero-waste/Bolsas-Reutilizables-Set.jpg', 1, 1, '2025-11-10 22:18:38', '2025-11-11 02:12:50'),
(3, 'Jabón Artesanal Natural', 'Jabón hecho a mano con aceites esenciales', 180.00, 150.00, 2, 100, 'https://ecostyle.infinityfree.me/images/mokups-Ecostyle/cuidado-personal/Jabon-Artesanal-Natural.jpg', 1, 0, '2025-11-10 22:18:38', '2025-11-11 02:02:27'),
(4, 'Botella de Acero Inoxidable', 'Botella térmica reutilizable 500ml', 650.00, NULL, 5, 25, 'https://ecostyle.infinityfree.me/images/mokups-Ecostyle/zero-waste/Botella-de-Acero-Inoxidable.png', 1, 1, '2025-11-10 22:18:38', '2025-11-11 02:13:15'),
(5, 'Shampoo Sólido Orgánico', 'Shampoo sin sulfatos ni parabenos', 320.00, 280.00, 2, 40, 'shampoo-solido.jpg', 1, 0, '2025-11-10 22:18:38', '2025-11-10 22:18:38'),
(6, 'Camiseta de Algodón Orgánico', 'Camiseta unisex 100% algodón orgánico', 850.00, NULL, 4, 20, 'https://ecostyle.infinityfree.me/images/mokups-Ecostyle/moda/Camiseta-de-Algodon-Organico.png', 1, 0, '2025-11-10 22:18:38', '2025-11-11 01:11:01'),
(7, 'Aceite de Coco Virgen', 'Aceite de coco prensado en frío 500ml', 420.00, NULL, 3, 31, 'https://ecostyle.infinityfree.me/images/mokups-Ecostyle/alimentacion/Aceite-de-Coco-Virgen.jpg', 1, 0, '2025-11-10 22:18:38', '2025-11-11 01:26:41'),
(8, 'Esponja Vegetal Natural', 'Esponja biodegradable de luffa', 120.00, 99.00, 1, 60, 'https://ecostyle.infinityfree.me/images/mokups-Ecostyle/hogar/Esponja-Vegetal-Natural.png', 1, 0, '2025-11-10 22:18:38', '2025-11-11 01:59:32'),
(9, 'Café Orgánico en Grano', 'Café 100% orgánico de comercio justo 250g', 380.00, NULL, 3, 45, 'https://ecostyle.infinityfree.me/images/mokups-Ecostyle/alimentacion/Cafe-Organico-en-Grano.jpg', 1, 1, '2025-11-10 22:18:38', '2025-11-11 01:02:54'),
(10, 'Cubiertos de Bambú Portátiles', 'Set de cubiertos reutilizables con estuche', 290.00, NULL, 5, 55, 'https://ecostyle.infinityfree.me/images/mokups-Ecostyle/zero-waste/Cubiertos-de-Bambu-Portatiles.jpg', 1, 0, '2025-11-10 22:18:38', '2025-11-11 02:13:31'),
(11, 'Granola Artesanal con Miel y Almendras', 'Con frutos secos, miel pura y avena natural.', 380.00, 350.00, 3, 30, 'https://ecostyle.infinityfree.me/images/mokups-Ecostyle/alimentacion/Aceite-de-Coco-Virgen.jpg', 1, 1, '2025-11-11 00:56:22', '2025-11-11 00:56:22'),
(12, 'Semillas de Chía Orgánicas (250g)', 'Ricas en omega 3, calcio y antioxidantes.', 320.00, 290.00, 3, 40, 'https://ecostyle.infinityfree.me/images/mokups-Ecostyle/alimentacion/Semillas-de-Chia-Organicas.png', 1, 0, '2025-11-11 00:56:22', '2025-11-11 00:56:22'),
(13, 'Mantequilla de Maní Natural', 'Elaborada sin azúcar ni conservantes.', 350.00, 320.00, 3, 40, 'https://ecostyle.infinityfree.me/images/mokups-Ecostyle/alimentacion/Mantequilla-de-Mani-Natural.png', 1, 0, '2025-11-11 01:01:31', '2025-11-11 01:01:31'),
(14, 'Miel Orgánica Pura (500ml)', 'Extraída de colmenas naturales, sin aditivos ni conservantes.', 420.00, 390.00, 3, 60, 'https://ecostyle.infinityfree.me/images/mokups-Ecostyle/alimentacion/Miel-Organica-Pura.png', 1, 0, '2025-11-11 01:01:31', '2025-11-11 01:01:31'),
(15, 'Bolso Ecológico de Yute Natural', 'Fabricado con fibras 100% naturales de yute, este bolso combina durabilidad y estilo.', 550.00, 500.00, 4, 20, 'https://ecostyle.infinityfree.me/images/mokups-Ecostyle/moda/Bolso-Ecologico-de-Yute.jpg', 1, 0, '2025-11-11 01:09:16', '2025-11-11 01:09:16'),
(16, 'Gorra Reciclada EcoStyle', 'Elaborada con materiales reciclados y visera flexible.', 480.00, 460.00, 4, 50, 'https://ecostyle.infinityfree.me/images/mokups-Ecostyle/moda/Gorra-Reciclada.png', 1, 0, '2025-11-11 01:09:16', '2025-11-11 01:09:16'),
(17, 'Mochila Reciclada EcoPack', 'Confeccionada a partir de botellas PET recicladas, esta mochila combina estilo y responsabilidad ambiental.', 2500.00, 2200.00, 4, 80, 'https://ecostyle.infinityfree.me/images/mokups-Ecostyle/moda/Mochila-Reciclada-EcoPack.png', 1, 1, '2025-11-11 01:12:33', '2025-11-11 01:12:33'),
(18, 'Detergente Ecológico Concentrado', 'Limpiador natural formulado sin fosfatos ni colorantes. A base de extractos vegetales y aceites esenciales.', 480.00, 450.00, 1, 60, 'https://ecostyle.infinityfree.me/images/mokups-Ecostyle/hogar/Detergente-Ecologico-Concentrado.jpg', 1, 0, '2025-11-11 01:22:13', '2025-11-11 01:22:13'),
(19, 'Limpiador Multiusos de Vinagre y Limón', 'Producto biodegradable y eficaz para limpiar superficies, vidrios y cocinas.', 320.00, 300.00, 1, 90, 'https://ecostyle.infinityfree.me/images/mokups-Ecostyle/hogar/Limpiador-Multiusos-de-Vinagre-y-Limón.jpg', 1, 0, '2025-11-11 01:22:13', '2025-11-11 01:22:13'),
(20, 'Jabón de Carbón Activado', 'Elaborado con carbón vegetal activo, ideal para piel grasa o con acné.', 270.00, 240.00, 2, 0, 'https://ecostyle.infinityfree.me/images/mokups-Ecostyle/cuidado-personal/Jabon-de-Carbon-Activado.png', 1, 0, '2025-11-11 01:58:31', '2025-11-11 01:58:31'),
(21, 'Jabón Artesanal de Avena y Miel', 'Elaborado a mano con glicerina vegetal, avena molida y miel pura.', 250.00, 220.00, 2, 30, 'https://ecostyle.infinityfree.me/images/mokups-Ecostyle/cuidado-personal/Jabon-Artesanal-de-Avena-y-Miel.jpg', 1, 0, '2025-11-11 02:07:51', '2025-11-11 02:07:51'),
(22, 'Jabón Natural de Lavanda', 'Elaborado con aceite esencial de lavanda.', 280.00, 250.00, 2, 25, 'https://ecostyle.infinityfree.me/images/mokups-Ecostyle/cuidado-personal/Jabon-Natural-de-Lavanda.jpg', 1, 0, '2025-11-11 02:07:51', '2025-11-11 02:07:51');