const esAdmin = localStorage.getItem('token_admin') !== null;
let botonesHtml = "";
if (esAdmin) {
    botonesHtml = `<button onclick="eliminarInmuebles('${casa._id} ')" class="btn-eliminar">Eliminar</button>`;
}

async function cargarInmuebles(ciudad = "") { 
    try {
        const respuesta = await fetch('https://app-inmobiliario-1.onrender.com/inmuebles');
        let  inmuebles = await respuesta.json();
        
        const contenedor = document.getElementById('contenedor-inmuebles');
        contenedor.innerHTML = ''; // Limpiar el mensaje de "cargando"

        // Si el usuario eligió una ciudad, filtramos la lista
        if (ciudad !== "") {
            inmuebles = inmuebles.filter (casa =>
            casa.ubicacion.toLowerCase().includes(ciudad.toLowerCase())
            );
        }

        if (inmuebles.length === 0) {
            contenedor.innerHTML = "<P>No hay inmuebles en esta yona aun.></p>";
            return;
        }
        inmuebles.forEach(casa => {
            const tarjeta = `
                <div class="tarjeta">
                    <img src="${casa.imagen_url}" alt="${casa.titulo}">
                    <div style= "padding: 15px;">
                    <h3>${casa.titulo}</h3>
                    <p>${casa.descripcion}</p>
                    <p><strong>Precio:</strong> $${casa.precio}</p>
                    <p>📍 ${casa.ubicacion}</p>
                    <button onclick="eliminarInmueble('${casa.id}')" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; margin-top: 10px;">
                    🗑️ Eliminar
                </button>
                    </div>
                </div>
            `;
            contenedor.innerHTML += tarjeta;
        });
    } catch (error) {
        console.error("Error al cargar:", error);
    }
}
// Función que llaman los botones de filtro
function filtrar(nombreCiudad){
    cargarInmuebles(nombreCiudad);
}
// Ejecutar la función cuando abra la página
cargarInmuebles();

async function eliminarInmueble(id) {
    if (confirm("¿Estás seguro de eliminar este inmueble?")) {
        try {
            const respuesta = await fetch(`https://app-inmobiliario-1.onrender.com/inmuebles/${id}`, {
                method: 'DELETE'
            });
            if (respuesta.ok) {
                alert("Eliminado con éxito");
                cargarInmuebles(); // Recarga la lista automáticamente
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    }
}