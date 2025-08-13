// server.js

const express = require('express');
const cors = require('cors');
const db = require('./db');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();

app.use(cors());
app.use(express.json());


// conexión con la base de datos

db.query('SELECT 1', (err) => {
if (err) {
console.error('No se pudo conectar a la base de datos', err);
} else {
console.log('Conexión a la base de datos exitosa');
}
});


// archivos del frontend

app.use(express.static(path.join(__dirname, '../frontend')));

//CRUD Clientes

app.get('/clientes', (req, res) => {
db.query('SELECT * FROM clientes', (err, results) => {
if (err) return res.status(500).json({ error: 'Error al obtener clientes' });
res.json(results);
});
});

app.get('/clientes/:id', (req, res) => {
const { id } = req.params;
db.query('SELECT * FROM clientes WHERE id_cliente = ?', [id], (err, results) => {
if (err) return res.status(500).json({ error: 'Error al obtener cliente' });
res.json(results[0]);
});
});

app.post('/clientes', (req, res) => {
const { nombre_cliente, identificacion, direccion, telefono, correo } = req.body;
db.query(
'INSERT INTO clientes (nombre_cliente, identificacion, direccion, telefono, correo) VALUES (?, ?, ?, ?, ?)',
[nombre_cliente, identificacion, direccion, telefono, correo],
(err, result) => {
if (err) return res.status(500).json({ error: 'Error creando cliente' });
res.json({ id_cliente: result.insertId, ...req.body });
}
);
});

app.put('/clientes/:id', (req, res) => {
const { id } = req.params;
const { nombre_cliente, identificacion, direccion, telefono, correo } = req.body;
db.query(
'UPDATE clientes SET nombre_cliente = ?, identificacion = ?, direccion = ?, telefono = ?, correo = ? WHERE id_cliente = ?',
[nombre_cliente, identificacion, direccion, telefono, correo, id],
(err) => {
if (err) return res.status(500).json({ error: 'Error actualizando cliente' });
res.json({ id_cliente: id, ...req.body });
}
);
});

app.delete('/clientes/:id', (req, res) => {
const { id } = req.params;
db.query('DELETE FROM clientes WHERE id_cliente = ?', [id], (err) => {
if (err) return res.status(500).json({ error: 'Error eliminando cliente' });
res.status(204).send();
});
});

/* =CRUD FACTURAS */
app.get('/facturas', (req, res) => {
db.query(
`SELECT f.*, c.nombre_cliente
FROM facturas f
INNER JOIN clientes c ON f.id_cliente = c.id_cliente`,
(err, results) => {
if (err) return res.status(500).json({ error: 'Error al obtener facturas' });
res.json(results);
}
);
});

app.get('/facturas/:id', (req, res) => {
const { id } = req.params;
db.query('SELECT * FROM facturas WHERE id_factura = ?', [id], (err, results) => {
if (err) return res.status(500).json({ error: 'Error al obtener factura' });
res.json(results[0]);
});
});

app.post('/facturas', (req, res) => {
const { numero_factura, periodo_facturacion, monto_facturado, monto_pagado, id_cliente } = req.body;
db.query(
'INSERT INTO facturas (numero_factura, periodo_facturacion, monto_facturado, monto_pagado, id_cliente) VALUES (?, ?, ?, ?, ?)',
[numero_factura, periodo_facturacion, monto_facturado, monto_pagado || 0, id_cliente],
(err, result) => {
if (err) return res.status(500).json({ error: 'Error creando factura' });
res.json({ id_factura: result.insertId, ...req.body });
}
);
});

app.put('/facturas/:id', (req, res) => {
const { id } = req.params;
const { numero_factura, periodo_facturacion, monto_facturado, monto_pagado, id_cliente } = req.body;
db.query(
'UPDATE facturas SET numero_factura = ?, periodo_facturacion = ?, monto_facturado = ?, monto_pagado = ?, id_cliente = ? WHERE id_factura = ?',
[numero_factura, periodo_facturacion, monto_facturado, monto_pagado, id_cliente, id],
(err) => {
if (err) return res.status(500).json({ error: 'Error actualizando factura' });
res.json({ id_factura: id, ...req.body });
}
);
});

app.delete('/facturas/:id', (req, res) => {
const { id } = req.params;
db.query('DELETE FROM facturas WHERE id_factura = ?', [id], (err) => {
if (err) return res.status(500).json({ error: 'Error eliminando factura' });
res.status(204).send();
});
});

/* CRUD TRANSACCIONES*/
app.get('/transacciones', (req, res) => {
    db.query(
    `SELECT f.*, c.nombre_cliente
    FROM facturas f
    INNER JOIN clientes c ON f.id_cliente = c.id_cliente`,
    (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener facturas' });
    res.json(results);
    }
    );
    });
    
    app.get('/transacciones:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM facturas WHERE id_factura = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener factura' });
    res.json(results[0]);
    });
    });
    
    app.post('/transacciones', (req, res) => {
    const { codigo_transaccion,fecha_hora, monto_transaccion, estado, tipo_transaccion, plataforma, id_factura } = req.body;
    db.query(
    'INSERT INTO facturas (codigo_transaccion, fecha_hora, monto_transaccion, estado, tipo_transaccion, plataforma, id_transaccion) VALUES (?, ?, ?, ?, ?)',
    [codigo_transaccion,fecha_hora, monto_transaccion, estado, tipo_transaccion, plataforma, id_factura || 0, id_cliente],
    (err, result) => {
    if (err) return res.status(500).json({ error: 'Error creando factura' });
    res.json({ id_transaccion: result.insertId, ...req.body });
    }
    );
    });
    
    app.put('/transacciones/:id', (req, res) => {
    const { id } = req.params;
    const { codigo_transaccion,fecha_hora, monto_transaccion, estado, tipo_transaccion, plataforma, id_factura } = req.body;
    db.query(
    'UPDATE transaccion SET Codigo_transaccion = ?, fecha_hora = ?, monto_transaccion, estado= ? tipo_transaccion=? , plataforma=?, id_factura = ? WHERE id_transaccion = ?',
    [codigo_transaccion,fecha_hora, monto_transaccion, estado, tipo_transaccion, plataforma, id_factura],
    (err) => {
    if (err) return res.status(500).json({ error: 'Error actualizando factura' });
    res.json({ id_factura: id, ...req.body });
    }
    );
    });
    
    app.delete('/transacciones/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM facturas WHERE id_transaccion = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Error eliminando factura' });
    res.status(204).send();
    });
    });

/* ============================
CARGA DE CSV
============================ */
const upload = multer({ dest: 'uploads/' }); //* configuracion de la biblioteca con node.js

// Cargar clientes.csv
app.post('/upload-csv/clientes', upload.single('file'), (req, res) => {
procesarCSV(req, res, 'clientes', ['nombre_cliente', 'identificacion', 'direccion', 'telefono', 'correo']);
});

// Cargar facturas.csv
app.post('/upload-csv/facturas', upload.single('file'), (req, res) => {
procesarCSV(req, res, 'facturas', ['numero_factura', 'periodo_facturacion', 'monto_facturado', 'monto_pagado', 'id_cliente']);
});

// Cargar transacciones.csv
app.post('/upload-csv/transacciones', upload.single('file'), (req, res) => {
procesarCSV(req, res, 'transacciones', ['codigo_transaccion', 'fecha_hora', 'monto_transaccion', 'estado', 'tipo_transaccion', 'plataforma', 'id_factura']);
});

// Función genérica para procesar CSV
function procesarCSV(req, res, tabla, campos) {
if (!req.file) {
return res.status(400).json({ error: 'No se recibió ningún archivo' });
}
const filePath = req.file.path;
const registros = [];

fs.createReadStream(filePath)
.pipe(csv())
.on('data', (row) => {
if (campos.every(c => row[c] !== undefined && row[c] !== '')) {
registros.push(campos.map(c => row[c]));
}
})
.on('end', () => {
fs.unlinkSync(filePath);
if (registros.length === 0) {
return res.status(400).json({ error: `El archivo CSV no contiene registros válidos para la tabla ${tabla}.` });
}
const placeholders = campos.map(() => '?').join(', ');
const insertQuery = `INSERT INTO ${tabla} (${campos.join(', ')}) VALUES (${placeholders})`;

db.query(`INSERT INTO ${tabla} (${campos.join(', ')}) VALUES ?`, [registros], (err) => {
if (err) return res.status(500).json({ error: `Error al importar CSV a ${tabla}` });
res.json({ mensaje: `✅ CSV importado exitosamente en ${tabla}` });
});
})
.on('error', (error) => {
fs.unlinkSync(filePath);
return res.status(500).json({ error: 'Error leyendo archivo CSV' });
});
}

/* FRONTEND */
app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

/*START SERVER */
const PORT = 3000;
app.listen(PORT, () => {
console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
