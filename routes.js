// routes.js
const express = require("express");
const router = express.Router();
const db = require("./db");

/* CLIENTES */

// Obtener todos los clientes
router.get("/clientes", (req, res) => {
db.query("SELECT * FROM clientes", (err, results) => {
if (err) throw err;
res.json(results);
});
});

// Agregar cliente
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

// Eliminar cliente
router.delete("/clientes/:id", (req, res) => {
const { id } = req.params;
db.query("DELETE FROM clientes WHERE id_cliente = ?", [id], (err) => {
if (err) throw err;
res.json({ mensaje: "🗑️ Cliente eliminado" });
});
});

/* FACTURAS */

// Obtener todas las facturas
router.get("/facturas", (req, res) => {
db.query("SELECT * FROM facturas", (err, results) => {
if (err) throw err;
res.json(results);
});
});

// Agregar factura
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

// Eliminar factura
router.delete("/facturas/:id", (req, res) => {
const { id } = req.params;
db.query("DELETE FROM facturas WHERE id_factura = ?", [id], (err) => {
if (err) throw err;
res.json({ mensaje: "🗑️ Factura eliminada" });
});
});

/* TRANSACCIONES */

// Obtener todas las transacciones
router.get("/transacciones", (req, res) => {
db.query("SELECT * FROM transacciones", (err, results) => {
if (err) throw err;
res.json(results);
});
});

// Agregar transacción
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

// Eliminar transacción
router.delete("/transacciones/:id", (req, res) => {
const { id } = req.params;
db.query("DELETE FROM transacciones WHERE id_transaccion = ?", [id], (err) => {
if (err) throw err;
res.json({ mensaje: "🗑️ Transacción eliminada" });
});
});

module.exports = router;