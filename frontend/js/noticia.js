const API_URL = "http://localhost:3000/api/noticias";

function obtenerId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function cargarNoticia() {
  const contenedor = document.getElementById("noticia-container");
  const id = obtenerId();

  if (!id) {
    contenedor.innerHTML = "<p>Error: ID no válido</p>";
    return;
  }

  try {
    const res = await fetch(API_URL);
    const noticias = await res.json();

    // 🔥 Buscar por ID (más seguro que slug)
    const noticia = noticias.find(n => n.id == id);

    if (!noticia) {
      contenedor.innerHTML = "<p>No se encontró la noticia</p>";
      return;
    }

    contenedor.innerHTML = `
      <h1 class="text-3xl font-bold mb-4">${noticia.titulo}</h1>

      <img src="${noticia.imagen_url}" 
           class="w-full h-96 object-cover mb-6"/>

      <p class="text-gray-600 mb-4">
        ${noticia.Categoria ? noticia.Categoria.nombre : "General"}
      </p>

      <p class="text-lg mb-6">
        ${noticia.copete}
      </p>

      <div>
        ${noticia.contenido || "Contenido no disponible"}
      </div>
    `;

  } catch (error) {
    console.error(error);
    contenedor.innerHTML = "<p>Error al cargar</p>";
  }
}

document.addEventListener("DOMContentLoaded", cargarNoticia);