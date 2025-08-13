# SQL

Glosario rápido (respuestas de 1 línea) apps.js

localStorage: Almacenamiento clave–valor persistente por dominio, sólo strings.

JSON.stringify/parse: Serializa/deserializa objetos ↔ texto.

addEventListener("click"/"submit"): Declara manejadores para eventos de usuario.

preventDefault(): Evita el comportamiento por defecto (p. ej., enviar/recargar).

FileReader + readAsText: Lee el contenido de archivos locales seleccionados por el usuario.

e.target: Elemento que disparó el evento (aquí, el formulario o el FileReader).

Object.keys(obj): Arreglo con nombres de propiedades enumerables.

map / forEach / join: Construcción de strings HTML desde arreglos.

Template literals: Strings con ${expresiones}.

innerHTML: Inserta HTML (ojo XSS); reemplaza todo el contenido.

Preguntas típicas de examen (con respuestas cortas)

¿Por qué usar JSON.stringify al guardar?
Porque localStorage solo guarda cadenas, no objetos.

¿Qué devuelve leerDeLocalStorage si no hay datos?
Un arreglo vacío [], para evitar null y simplificar el consumo.

¿De dónde salen las columnas de la tabla?
De Object.keys(datos[0]), asumiendo que todos los objetos comparten las mismas claves.

Riesgo de innerHTML con datos de usuario?
XSS. Hay que escapar o usar textContent y crear nodos.

¿Qué limita el parser CSV actual?
No maneja comillas, comas dentro de campos ni \r. Sirve para CSV simples.

¿Qué hace preventDefault() en los formularios?
Evita que el navegador recargue/envié el form. Control total en JS.

¿Por qué los IDs se crean con length + 1?
Es una forma simple de autoincrementar, pero puede romperse si se eliminan registros.

¿Qué pasa si el HTML no tiene una tabla con ese id?
document.getElementById devuelve null y innerHTML fallará (TypeError).

¿Cómo se actualiza la vista tras cargar un CSV?
En onload del FileReader, se guarda y se llama a actualizarTablas().

¿Qué es DOMContentLoaded?
Evento que indica que el DOM está listo para manipular, sin esperar imágenes.

¿Por qué values[i]?.trim() || ""?
Maneja valores faltantes (undefined) y los convierte en "" tras recortar espacios.

¿Qué complejidad tiene mostrarTabla?
Aproximadamente O(n·m), n = filas, m = columnas (recorre todo para renderizar).

Mejoras recomendadas (por si te piden “cómo lo harías mejor”)

CSV robusto: integrar Papa Parse para comillas, separadores personalizados y \r\n.

Escapar HTML: evitar XSS al pintar tablas (crear celdas con textContent).

Tipos correctos: convertir montos a number, fechas a Date o ISO, validar emails/teléfonos.

IDs fiables: crypto.randomUUID() o un contador persistente en localStorage.

Colspan dinámico: usar headers.length en “No hay datos”.

UX: mensajes de error/success, spinners al leer archivos, validaciones en formularios.

CRUD completo: agregar editar/eliminar filas y recalcular IDs o manejar claves estables.

Relaciones: validar que id_cliente exista al crear facturas, e id_factura al crear transacciones.

Mini “chuleta” por bloques (para contestar al vuelo)

LS utils: guardan/leen arrays como JSON string; retorno por defecto [].

Tabla: usa claves del primer objeto como columnas; construye HTML con map/forEach; XSS si no escapas.

CSV: separa por líneas y comas; parser básico; FileReader asincrónico.

Botón CSV: toma 3 archivos si existen y los procesa individualmente.

Formularios: submit + preventDefault; construyen objeto desde inputs; ID autoincremental; guardan, resetean y repintan.

Actualizar: siempre lee de LS y repinta las tres tablas.

DOMContentLoaded: al abrir la página, muestra lo que ya existía.

////////////////////////////////////////////////////////////////////////////////////////////////////

Glosario rápido (para examen) archivo routes.js

Express Router: mini app que maneja rutas de forma modular.

req.params: datos que vienen en la URL (/ruta/:param).

req.body: datos enviados en el cuerpo (POST/PUT) → requiere express.json() en el servidor.

db.query(sql, params, callback): ejecuta SQL en MySQL con parámetros seguros.

Consultas parametrizadas: evitan inyección SQL.

REST:

GET → obtener datos

POST → insertar datos

DELETE → eliminar datos

(PUT/PATCH serían para actualizar)

throw err: lanza error y lo envía al manejador global.

Preguntas típicas y respuestas rápidas

¿Qué hace router.get("/clientes", ...)?
Devuelve todos los clientes de la base en formato JSON.

¿Por qué usar ? en las consultas?
Para proteger contra inyección SQL y dejar que el driver haga el escape.

¿Diferencia entre req.params y req.body?
params: en la URL; body: en el cuerpo de la petición.

¿Qué pasa si no configuramos express.json()?
req.body vendrá como undefined.

¿Qué tipo de respuesta envía el servidor?
JSON (res.json(...)).

¿Se validan los datos antes de insertar?
No, aquí se asume que son válidos (debería validarse antes de guardar).

¿Qué pasa si intentas eliminar un cliente con facturas asociadas?
Depende de la configuración de claves foráneas en MySQL (ON DELETE RESTRICT o CASCADE).

¿Qué módulo maneja la conexión MySQL?
El archivo db.js que se importa al inicio.

///////////////////////////////////////////////////////////////////



server .js

1. Importaciones y configuración del Router
const express = require("express");
const router = express.Router();
const db = require("./db");


express: Importa el framework Express para crear las rutas.

router: Crea un enrutador de Express para definir los endpoints sin tener que usar app directamente.

db: Importa la conexión a la base de datos definida en el archivo db.js.

2. CRUD de Clientes
Obtener todos los clientes
router.get("/clientes", (req, res) => {
  db.query("SELECT * FROM clientes", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


Método GET.

Consulta todos los registros de la tabla clientes.

Devuelve un JSON con los datos obtenidos.

Agregar cliente
router.post("/clientes", (req, res) => {
  const { nombre_cliente, identificacion, direccion, telefono, correo } = req.body;
  db.query(
    "INSERT INTO clientes (nombre_cliente, identificacion, direccion, telefono, correo) VALUES (?, ?, ?, ?, ?)",
    [nombre_cliente, identificacion, direccion, telefono, correo],
    (err) => {
      if (err) throw err;
      res.json({ mensaje: "✅ Cliente agregado" });
    }
  );
});


Método POST.

Recibe datos en el body y los inserta en la tabla clientes.

Usa ? como placeholders para prevenir inyección SQL.

Devuelve un mensaje de confirmación.

Eliminar cliente
router.delete("/clientes/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM clientes WHERE id_cliente = ?", [id], (err) => {
    if (err) throw err;
    res.json({ mensaje: "🗑️ Cliente eliminado" });
  });
});


Método DELETE.

Elimina un cliente por su id_cliente recibido en la URL.

Devuelve mensaje de confirmación.

3. CRUD de Facturas
Obtener todas las facturas
router.get("/facturas", (req, res) => {
  db.query("SELECT * FROM facturas", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


Similar a clientes, pero con la tabla facturas.

Agregar factura
router.post("/facturas", (req, res) => {
  const { numero_factura, periodo_facturacion, monto_facturado, monto_pagado, id_cliente } = req.body;
  db.query(
    "INSERT INTO facturas (numero_factura, periodo_facturacion, monto_facturado, monto_pagado, id_cliente) VALUES (?, ?, ?, ?, ?)",
    [numero_factura, periodo_facturacion, monto_facturado, monto_pagado, id_cliente],
    (err) => {
      if (err) throw err;
      res.json({ mensaje: "✅ Factura agregada" });
    }
  );
});


Inserta una nueva factura asociada a un cliente.

Eliminar factura
router.delete("/facturas/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM facturas WHERE id_factura = ?", [id], (err) => {
    if (err) throw err;
    res.json({ mensaje: "🗑️ Factura eliminada" });
  });
});


Elimina factura por id_factura.

4. CRUD de Transacciones
Obtener todas las transacciones
router.get("/transacciones", (req, res) => {
  db.query("SELECT * FROM transacciones", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


Devuelve todas las transacciones registradas.

Agregar transacción
router.post("/transacciones", (req, res) => {
  const { codigo_transaccion, fecha_hora, monto_transaccion, estado, tipo_transaccion, plataforma, id_factura } = req.body;
  db.query(
    "INSERT INTO transacciones (codigo_transaccion, fecha_hora, monto_transaccion, estado, tipo_transaccion, plataforma, id_factura) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [codigo_transaccion, fecha_hora, monto_transaccion, estado, tipo_transaccion, plataforma, id_factura],
    (err) => {
      if (err) throw err;
      res.json({ mensaje: "✅ Transacción agregada" });
    }
  );
});


Inserta una transacción asociada a una factura.

Eliminar transacción
router.delete("/transacciones/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM transacciones WHERE id_transaccion = ?", [id], (err) => {
    if (err) throw err;
    res.json({ mensaje: "🗑️ Transacción eliminada" });
  });
});


Elimina una transacción por su id_transaccion.

5. Exportar Rutas
module.exports = router;


Permite que el archivo sea importado en el server.js o app.js para montar todas las rutas en la aplicación.

Si quieres, puedo hacerte el diagrama de flujo de estas rutas para que veas el ciclo completo de Cliente → Factura → Transacción. Así quedaría más visual y fácil de entender.

Tú dijiste:
si
ChatGPT Plus

Aquí tienes la explicación visual del archivo routes.js:

Clientes

GET /clientes → Lista todos los clientes desde la tabla clientes.

POST /clientes → Inserta un nuevo cliente con sus datos básicos.

DELETE /clientes/:id → Elimina un cliente usando id_cliente.

Facturas

GET /facturas → Lista todas las facturas desde la tabla facturas.

POST /facturas → Inserta una factura asociada a un cliente (id_cliente).

DELETE /facturas/:id → Elimina una factura usando id_factura.

Transacciones

GET /transacciones → Lista todas las transacciones desde la tabla transacciones.

POST /transacciones → Inserta una transacción asociada a una factura (id_factura).

DELETE /transacciones/:id → Elimina una transacción usando id_transaccion.

La relación es jerárquica:
Clientes → Facturas → Transacciones
Cada entidad depende de la anterior a través de claves foráneas (id_cliente, id_factura).

////////////////////////////////////////////////////

Importar la librería

const mysql = require('mysql2');


Carga el paquete mysql2, que permite conectar y hacer consultas a bases de datos MySQL.

Crear la conexión

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',   
  database: 'sistema_pagos_mysql', 
  port: 3307            
});


host: Dirección del servidor (aquí, local).

user: Usuario para conectarse.

password: Contraseña del usuario.

database: Base de datos que vamos a usar.

port: Puerto del servidor MySQL (por defecto sería 3306, pero aquí es 3307).

Conectar y manejar errores

connection.connect(err => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
        return;
    }
    console.log('✅ Conectado a MySQL');
});


connection.connect() intenta abrir la conexión.

Si ocurre un error (err no es null), se muestra en consola y se detiene.

Si todo va bien, muestra "✅ Conectado a MySQL".

Exportar la conexión

module.exports = connection;


Esto permite que otros archivos (por ejemplo routes.js) puedan usar esta conexión para ejecutar consultas.

//////////////////////////////////////////////


📌 Guía para conectar MySQL a tu proyecto Node.js
1️⃣ Instalar MySQL y crear tu base de datos

Asegúrate de tener MySQL instalado y ejecutándose.

Abre tu consola de MySQL (o usa una herramienta como MySQL Workbench o phpMyAdmin).

Crea la base de datos:

CREATE DATABASE sistema_pagos_mysql;
USE sistema_pagos_mysql;


Crea las tablas que tu proyecto necesita.
Ejemplo (según tu routes.js):

CREATE TABLE clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre_cliente VARCHAR(100),
    identificacion VARCHAR(50),
    direccion VARCHAR(150),
    telefono VARCHAR(20),
    correo VARCHAR(100)
);

CREATE TABLE facturas (
    id_factura INT AUTO_INCREMENT PRIMARY KEY,
    numero_factura VARCHAR(50),
    periodo_facturacion VARCHAR(50),
    monto_facturado DECIMAL(10,2),
    monto_pagado DECIMAL(10,2),
    id_cliente INT,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);

CREATE TABLE transacciones (
    id_transaccion INT AUTO_INCREMENT PRIMARY KEY,
    codigo_transaccion VARCHAR(50),
    fecha_hora DATETIME,
    monto_transaccion DECIMAL(10,2),
    estado VARCHAR(50),
    tipo_transaccion VARCHAR(50),
    plataforma VARCHAR(50),
    id_factura INT,
    FOREIGN KEY (id_factura) REFERENCES facturas(id_factura)
);

2️⃣ Crear el proyecto Node.js

Si no tienes un proyecto Node, créalo:

mkdir sistema-pagos
cd sistema-pagos
npm init -y

3️⃣ Instalar dependencias necesarias
npm install express mysql2 body-parser cors


express → para el servidor.

mysql2 → para conectar MySQL.

body-parser → para leer datos JSON enviados por el cliente.

cors → para permitir peticiones desde el navegador.

4️⃣ Crear el archivo db.js

Este archivo conecta con la base de datos:

const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',      // o tu IP/servidor
  user: 'root',           // tu usuario
  password: 'admin',      // tu contraseña
  database: 'sistema_pagos_mysql',
  port: 3307               // puerto MySQL (por defecto 3306)
});

connection.connect(err => {
  if (err) {
    console.error('❌ Error conectando a MySQL:', err);
    return;
  }
  console.log('✅ Conectado a MySQL');
});

module.exports = connection;

5️⃣ Crear el archivo routes.js

Aquí defines todas las rutas para clientes, facturas y transacciones (ya lo tienes listo con tus consultas SQL).

6️⃣ Crear el archivo server.js

Este será tu punto de entrada:

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const routes = require('./routes');

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api', routes);

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

7️⃣ Iniciar el servidor
node server.js


Si todo está bien, deberías ver:

✅ Conectado a MySQL
🚀 Servidor corriendo en http://localhost:3000

8️⃣ Probar la conexión

Puedes usar Postman, Insomnia o tu navegador para probar:

Obtener clientes:

GET http://localhost:3000/api/clientes


Agregar cliente:

POST http://localhost:3000/api/clientes
Content-Type: application/json

{
  "nombre_cliente": "Juan Pérez",
  "identificacion": "123456789",
  "direccion": "Calle Falsa 123",
  "telefono": "3001234567",
  "correo": "juan@example.com"





  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////

  // routes/clientes.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// 📌 Crear cliente
router.post('/', (req, res) => {
    const { nombre_cliente, identificacion, direccion, telefono, correo } = req.body;
    const sql = 'INSERT INTO clientes (nombre_cliente, identificacion, direccion, telefono, correo) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [nombre_cliente, identificacion, direccion, telefono, correo], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Cliente creado', id: result.insertId });
    });
});

// 📌 Leer todos los clientes
router.get('/', (req, res) => {
    db.query('SELECT * FROM clientes', (err, rows) => {
        if (err) return res.status(500).json({ error: err });
        res.json(rows);
    });
});

// 📌 Leer un cliente por ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM clientes WHERE id_cliente = ?', [req.params.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err });
        res.json(rows[0]);
    });
});

// 📌 Actualizar cliente
router.put('/:id', (req, res) => {
    const { nombre_cliente, identificacion, direccion, telefono, correo } = req.body;
    const sql = 'UPDATE clientes SET nombre_cliente=?, identificacion=?, direccion=?, telefono=?, correo=? WHERE id_cliente=?';
    db.query(sql, [nombre_cliente, identificacion, direccion, telefono, correo, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Cliente actualizado' });
    });
});

// 📌 Eliminar cliente
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM clientes WHERE id_cliente = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Cliente eliminado' });
    });
});

module.exports = router;



// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const clientesRoutes = require('./routes/clientes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api/clientes', clientesRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});



{
    "nombre_cliente": "Carlos Ruiz",
    "identificacion": "987654321",
    "direccion": "Calle 10 #5-50",
    "telefono": "3001122334",
    "correo": "carlos@example.com"
}



{
    "nombre_cliente": "Carlos Ruiz",
    "identificacion": "987654321",
    "direccion": "Calle 10 #5-55",
    "telefono": "3001122334",
    "correo": "carlos@example.com"
}

