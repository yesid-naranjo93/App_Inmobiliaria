const API_URL = "https://app-inmobiliario-1.onrender.com";

async function cargarInmuebles() {
    const contenedor = document.getElementById('contenedor-inmuebles');

    try {
        const respuesta = await fetch(`${API_URL}/inmuebles`);
        const inmuebles = await respuesta.json();

        // Limpiamos el contenedor antes de cargar
        contenedor.innerHTML = "";

        // Verificamos si el usuario es administrador una sola vez
        const isAdmin = localStorage.getItem('token_admin');

        inmuebles.forEach(casa => {
            // Creamos la tarjeta
            const tarjeta = document.createElement('div');
            tarjeta.classList.add('tarjeta-inmueble');

            tarjeta.innerHTML = `
                <img src="${casa.imagen || 'https://via.placeholder.com/150'}" alt="${casa.titulo}">
                <div class="contenido">
                    <h3>${casa.titulo}</h3>
                    <p>${casa.descripcion}</p>
                    <span class="precio">$${casa.precio}</span>
                    
                    ${isAdmin ? `<button class="btn-eliminar" onclick="eliminarInmueble('${casa._id}')">Eliminar</button>` : ''}
                </div>
            `;
            contenedor.appendChild(tarjeta);
        });

    } catch (error) {
        console.error("Error al cargar inmuebles:", error);
    }
}

async function eliminarInmueble(id) {
    if (!confirm("¿Estás seguro de que deseas eliminar este inmueble?")) return;

    try {
        const token = localStorage.getItem('token_admin');
        const respuesta = await fetch(`${API_URL}/inmuebles/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const resultado = await respuesta.json();

        if (respuesta.ok) {
            alert("Inmueble eliminado con éxito");
            cargarInmuebles(); // Recargamos la lista
        } else {
            alert("Error: " + resultado.detail);
        }
    } catch (error) {
        console.error("Error al eliminar:", error);
    }
}

// Llamamos a la función al cargar la página
document.addEventListener('DOMContentLoaded', cargarInmuebles);