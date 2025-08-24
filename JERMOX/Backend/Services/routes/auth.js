// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { addUser, findUserByEmail } = require("../models/users");

const router = express.Router();
const SECRET_KEY = "mi_secreto_super_seguro";

// Registro
router.post("/register", async (req, res) => {
const { nombre, email, password, telefono } = req.body;

  // validar usuario duplicado
if (findUserByEmail(email)) {
    return res.status(400).json({ msg: "El usuario ya existe" });
}

  // hash de la contraseña
const hashedPassword = await bcrypt.hash(password, 10);

const newUser = {
    id: Date.now(),
    nombre,
    email,
    telefono,
    password: hashedPassword
};

addUser(newUser);
res.json({ msg: "Usuario registrado con éxito" });
});

// Login
router.post("/login", async (req, res) => {
const { email, password } = req.body;
const user = findUserByEmail(email);

if (!user) return res.status(400).json({ msg: "Usuario no encontrado" });

const validPassword = await bcrypt.compare(password, user.password);
if (!validPassword) return res.status(400).json({ msg: "Contraseña incorrecta" });

const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

res.json({
    msg: "Login exitoso",
    token,
    user: { nombre: user.nombre, email: user.email, telefono: user.telefono }
});
});

// Ruta protegida
router.get("/dashboard", (req, res) => {
const authHeader = req.headers["authorization"];
if (!authHeader) return res.status(401).json({ msg: "Token requerido" });

const token = authHeader.split(" ")[1];
try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ msg: "Acceso concedido", user: decoded });
} catch (err) {
    res.status(403).json({ msg: "Token inválido o expirado" });
}
});

module.exports = router;
