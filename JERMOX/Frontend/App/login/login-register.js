const app = document.getElementById("app");
const API_URL = "http://localhost:4000/api";

function navigateTo(route) {
window.history.pushState({}, route, window.location.origin + route);
renderRoute(route);
}

function renderRoute(route) {
if (route === "/register") renderRegister();
else if (route === "/login") renderLogin();
else if (route === "/dashboard") renderDashboard();
else renderLogin();
}

// Registro
function renderRegister() {
app.innerHTML = `
    <h2>Registro</h2>
    <form id="registerForm">
    <input type="text" id="nombre" placeholder="Nombre" required>
    <input type="email" id="email" placeholder="Correo electrónico" required>
    <input type="password" id="password" placeholder="Contraseña" required>
    <input type="tel" id="telefono" placeholder="Teléfono" required>
    <button type="submit">Registrarse</button>
    </form>
    <p>¿Ya tienes cuenta? <a href="/login" onclick="navigateTo('/login'); return false;">Inicia sesión</a></p>
`;

document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = {
    nombre: document.getElementById("nombre").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    telefono: document.getElementById("telefono").value
    };

    const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
    });

    const data = await res.json();
    alert(data.msg);
    if (res.ok) navigateTo("/login");
});
}

// Login
function renderLogin() {
app.innerHTML = `
    <h2>Iniciar Sesión</h2>
    <form id="loginForm">
    <input type="email" id="email" placeholder="Correo electrónico" required>
    <input type="password" id="password" placeholder="Contraseña" required>
    <button type="submit">Ingresar</button>
    </form>
    <p>¿No tienes cuenta? <a href="/register" onclick="navigateTo('/register'); return false;">Regístrate</a></p>
`;

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const credentials = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
    };

    const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
    });

    const data = await res.json();

    if (res.ok) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    navigateTo("/dashboard");
    } else {
    alert(data.msg);
    }
});
}

// Dashboard
function renderDashboard() {
const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
    navigateTo("/login");
    return;
}

app.innerHTML = `
    <h2>Bienvenido, ${user.nombre}</h2>
    <p>Email: ${user.email}</p>
    <p>Teléfono: ${user.telefono}</p>
    <button onclick="logout()">Cerrar sesión</button>
`;
}

function logout() {
localStorage.removeItem("token");
localStorage.removeItem("user");
navigateTo("/login");
}

// Detectar navegación
window.onpopstate = () => renderRoute(window.location.pathname);

// Iniciar SPA
renderRoute(window.location.pathname);


