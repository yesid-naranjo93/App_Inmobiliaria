const form = document.getElementById('formulario-login');
const API_URL = "https://app-inmobiliario-1.onrender.com";

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;

    const respuesta = await fetch(`${API_URL}/inmuebles`);
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
        document.getElementById('mensaje-error').innerText = data.error;
    }
    document.getElementById('btn-registrar').addEventListener('click', async () => {
        const username = document.getElementById('usuario').value;
        const password = documento.getElementById('password').value;

        const respuesta = await fecth(`${API_URL/registrar, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, rol: "admin" })

        });
        const data = await respuesta.json();
        alert(data.mensaje || "Error al registrar");
    }
  
    )
})
