const API_URL = "https://app-inmobiliario-1.onrender.com";

// 1. Función para cargar inmuebles (Corregida)
async function cargarInmuebles(ciudad = "") {
    const contenedor = document.getElementById('contenedor-inmuebles');
    contenedor.innerHTML = "Cargando..."; // Mensaje temporal

    try {
        const respuesta = await fetch(`${API_URL}/inmuebles`);
        let inmuebles = await respuesta.json();

        if (ciudad !== "") {
            inmuebles = inmuebles.filter(casa =>
                casa.ubicacion.toLowerCase().includes(ciudad.toLowerCase())
            );
        }

        contenedor.innerHTML = ""; // Limpiamos

        const isAdmin = localStorage.getItem('token_admin');

        inmuebles.forEach(casa => {
            const tarjeta = `
                <div class="tarjeta">
                    <img src="${casa.imagen_url || 'https://via.placeholder.com/150'}" alt="casa">
                    <div style="padding: 15px;">
                        <h3>casa</h3>
                        <p>${casa.descripcion}</p>
                        <p><strong>Precio:</strong> $${casa.precio}</p>
                        <p>📍 ${casa.ubicacion}</p>
                        
                        ${isAdmin ? `<button onclick="eliminarInmueble('${casa._id}')" class="btn-eliminar">Eliminar</button>` : ''}
                    </div>
                </div>
            `;
            contenedor.innerHTML += tarjeta;
        });
    } catch (error) {
        console.error("Error al cargar:", error);
        contenedor.innerHTML = "Error al conectar con el servidor.";
    }
}

// 2. Función para eliminar (Asegurando que el ID no sea undefined)
async function eliminarInmueble(id) {
    if (!id || id === 'undefined') {
        alert("Error: ID de casa no encontrado");
        return;
    }

    if (confirm("¿Estás seguro de eliminar este inmueble?")) {
        try {
            const res = await fetch(`${API_URL}/inmuebles/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                alert("Eliminado con éxito");
                cargarInmuebles();
            } else {
                alert("No se pudo eliminar. Revisa los permisos de CORS.");
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    }
}

// 3. Función de filtrado para los botones
function filtrar(nombreCiudad) {
    cargarInmuebles(nombreCiudad);
}

// Iniciar al cargar la página
document.addEventListener('DOMContentLoaded', () => cargarInmuebles());