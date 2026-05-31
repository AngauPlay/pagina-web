const API = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", cargarNoticias);

async function cargarNoticias() {
  const contenedor = document.getElementById("contenedor-categorias");

  try {
    const res = await fetch(`${API}/noticias`);
    const noticias = await res.json();

    if (!noticias || noticias.length === 0) {
      contenedor.innerHTML = "<p>No hay noticias disponibles</p>";
      return;
    }

    // Ordenar por fecha más reciente primero
    noticias.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    contenedor.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        ${
          noticias.map((n) => {
            const categoria = n.Categorium
              ? n.Categorium.nombre
              : "General";

            return `
              <article class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border group">

                <div class="relative overflow-hidden">
                  
                  <img 
                    src="${n.imagen_url}" 
                    alt="${n.titulo}"
                    class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  <!-- ETIQUETA -->
                  <span class="absolute top-4 left-4 bg-pink-accent text-white text-[10px] font-black px-2 py-1 rounded uppercase">
                    ${categoria}
                  </span>

                </div>

                <div class="p-6">

                  <p class="text-xs text-slate-400 mb-2">
                    ${new Date(n.createdAt).toLocaleDateString("es-AR")}
                  </p>

                  <h3 class="text-xl font-black text-slate-800 group-hover:text-pink-accent transition">
                    ${n.titulo}
                  </h3>

                  <p class="text-slate-500 mt-3 text-sm line-clamp-2">
                    ${n.copete || ""}
                  </p>

                  <a href="articulo.html?slug=${n.slug}" 
                     class="inline-block mt-4 text-pink-accent font-black text-xs hover:translate-x-2 transition">
                    LEER MÁS →
                  </a>

                </div>

              </article>
            `;
          }).join("")
        }
      </div>
    `;

  } catch (error) {
    console.error(error);
    contenedor.innerHTML = "<p>Error cargando noticias</p>";
  }
}