const form = document.getElementById('formulario-login');
const API_URL = "https://app-inmobiliario-1.onrender.com";

// Manejo del Login (Botón Entrar)
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;

    const respuesta = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await respuesta.json();

    if (data.token) {
        localStorage.setItem('token_admin', data.token);
        alert("Bienvenido Felipe");
        window.location.href = "index.html";
    } else {
        document.getElementById('mensaje-error').innerText = data.error || "Error al iniciar sesión";
    }
});

// Manejo del Registro (Botón Crear Admin)
document.getElementById('btn-registrar').addEventListener('click', async () => {
    const username = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        alert("Por favor completa ambos campos");
        return;
    }

    const respuesta = await fetch(`${API_URL}/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, rol: "admin" })
    });

    const data = await respuesta.json();
    alert(data.mensaje || "Error al registrar");
});