```jsx

Script base de datos sql

-- 1. Crear base de datos
CREATE DATABASE sistema_pagos_mysql;
USE sistema_pagos_mysql;

-- 2. Tabla de roles
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL
);

INSERT INTO roles (nombre) VALUES ('admin'), ('usuario');

-- 3. Tabla de usuarios
CREATE TABLE usuarios (
	id INT PRIMARY KEY AUTO_INCREMENT,
	nombre VARCHAR(100) NOT NULL,
	email VARCHAR(100) UNIQUE NOT NULL,
	usuario VARCHAR(50) UNIQUE NOT NULL,
	contraseña VARCHAR (255) NOT NULL,
	rol_id INT NOT NULL,
	FOREIGN KEY (rol_id) REFERENCES roles(id)
);

INSERT INTO usuarios (nombre, email, usuario, contraseña, rol_id) VALUES
('Administrador General', 'admin@transacciones.com', 'admin', 'admin123', 1),
('Sebastian Rojas', 'sebastianrojas@correo.com', 'sebasr', '1234', 2),
('Ana Naranjo', 'anan@correo.com', 'anan', '5678', 2);


-- 4. Tabla de clientes
CREATE TABLE clientes (
id_cliente INT AUTO_INCREMENT PRIMARY KEY,
nombre_cliente VARCHAR(100) NOT NULL,
identificacion VARCHAR(20) UNIQUE NOT NULL,
direccion TEXT,
telefono VARCHAR(30),
correo VARCHAR(100) UNIQUE
);

-- 5. Tabla de Facturas
CREATE TABLE facturas (
id_factura INT AUTO_INCREMENT PRIMARY KEY,
numero_factura VARCHAR(20) UNIQUE NOT NULL,
periodo_facturacion DATE NOT NULL,
monto_facturado DECIMAL(12,2) NOT NULL,
monto_pagado DECIMAL(12,2) DEFAULT 0,
id_cliente INT NOT NULL,
FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
ON DELETE CASCADE
);

-- 6. Tabla de transacciones
CREATE TABLE transacciones (
id_transaccion INT AUTO_INCREMENT PRIMARY KEY,
codigo_transaccion VARCHAR(20) UNIQUE NOT NULL,
fecha_hora DATETIME NOT NULL,
monto_transaccion DECIMAL(12,2) NOT NULL,
estado VARCHAR(50) NOT NULL,
tipo_transaccion VARCHAR(50) NOT NULL,
plataforma VARCHAR(50),
id_factura INT NOT NULL,
FOREIGN KEY (id_factura) REFERENCES facturas(id_factura)
ON DELETE CASCADE
);

-- 7. Índices
CREATE INDEX idx_facturas_cliente ON facturas(id_cliente);
CREATE INDEX idx_transacciones_factura ON transacciones(id_factura);