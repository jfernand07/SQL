//Localstorage

function guardarEnLocalStorage(key, data) {
localStorage.setItem(key, JSON.stringify(data));
}

function leerDeLocalStorage(key) {
const data = localStorage.getItem(key);
return data ? JSON.parse(data) : [];
}


// visualizar tablas
function mostrarTabla(idTabla, datos) {
const tabla = document.getElementById(idTabla);
if (!datos.length) {
tabla.innerHTML = "<tr><td colspan='10'>No hay datos</td></tr>";
return;
}

// Encabezado
const headers = Object.keys(datos[0]);
let html = "<tr>" + headers.map(h => `<th>${h}</th>`).join("") + "</tr>";

// Filas
datos.forEach(item => {
html += "<tr>" + headers.map(h => `<td>${item[h]}</td>`).join("") + "</tr>";
});

tabla.innerHTML = html;
}


// Cargar CSV

function parseCSV(content) {
const lines = content.split("\n").filter(line => line.trim() !== "");
const headers = lines[0].split(",");
return lines.slice(1).map(line => {
const values = line.split(",");
let obj = {};
headers.forEach((h, i) => obj[h.trim()] = values[i]?.trim() || "");
return obj;
});
}

document.getElementById("btnCargarCSV").addEventListener("click", () => {
const csvClientes = document.getElementById("csvClientes").files[0];
const csvFacturas = document.getElementById("csvFacturas").files[0];
const csvTransacciones = document.getElementById("csvTransacciones").files[0];

if (csvClientes) {
leerArchivoCSV(csvClientes, "clientes");
}
if (csvFacturas) {
leerArchivoCSV(csvFacturas, "facturas");
}
if (csvTransacciones) {
leerArchivoCSV(csvTransacciones, "transacciones");
}
});

function leerArchivoCSV(file, key) {
const reader = new FileReader();
reader.onload = (e) => {
const data = parseCSV(e.target.result);
guardarEnLocalStorage(key, data);
actualizarTablas();
};
reader.readAsText(file);
}


// Formularios manuales


// Usuarios
document.getElementById("formCliente").addEventListener("submit", (e) => {
e.preventDefault();
const clientes = leerDeLocalStorage("clientes");
clientes.push({
id_cliente: clientes.length + 1,
nombre_cliente: document.getElementById("nombreCliente").value,
identificacion: document.getElementById("identificacionCliente").value,
direccion: document.getElementById("direccionCliente").value,
telefono: document.getElementById("telefonoCliente").value,
correo: document.getElementById("correoCliente").value
});
guardarEnLocalStorage("clientes", clientes);
e.target.reset();
actualizarTablas();
});

// Facturas
document.getElementById("formFactura").addEventListener("submit", (e) => {
e.preventDefault();
const facturas = leerDeLocalStorage("facturas");
facturas.push({
id_factura: facturas.length + 1,
numero_factura: document.getElementById("numeroFactura").value,
periodo_facturacion: document.getElementById("periodoFacturacion").value,
monto_facturado: document.getElementById("montoFacturado").value,
monto_pagado: document.getElementById("montoPagado").value,
id_cliente: document.getElementById("idClienteFactura").value
});
guardarEnLocalStorage("facturas", facturas);
e.target.reset();
actualizarTablas();
});

// Transacciones
document.getElementById("formTransaccion").addEventListener("submit", (e) => {
e.preventDefault();
const transacciones = leerDeLocalStorage("transacciones");
transacciones.push({
id_transaccion: transacciones.length + 1,
codigo_transaccion: document.getElementById("codigoTransaccion").value,
fecha_hora: document.getElementById("fechaHora").value,
monto_transaccion: document.getElementById("montoTransaccion").value,
estado: document.getElementById("estado").value,
tipo_transaccion: document.getElementById("tipoTransaccion").value,
plataforma: document.getElementById("plataforma").value,
id_factura: document.getElementById("idFacturaTransaccion").value
});
guardarEnLocalStorage("transacciones", transacciones);
e.target.reset();
actualizarTablas();
});


// Actualizar las tablas

function actualizarTablas() {
mostrarTabla("tablaClientes", leerDeLocalStorage("clientes"));
mostrarTabla("tablaFacturas", leerDeLocalStorage("facturas"));
mostrarTabla("tablaTransacciones", leerDeLocalStorage("transacciones"));
}


// Cargar datos

document.addEventListener("DOMContentLoaded", actualizarTablas);