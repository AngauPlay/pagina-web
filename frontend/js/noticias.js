const API = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", cargarNoticiasPorCategoria);

async function cargarNoticiasPorCategoria() {
  const contenedor = document.getElementById("contenedor-categorias");

  try {
    const res = await fetch("http://localhost:3000/noticias");
    const noticias = await res.json();

    if (!noticias || noticias.length === 0) {
      contenedor.innerHTML = "<p>No hay noticias disponibles</p>";
      return;
    }

    // 🔥 Agrupar por categoría
    const categorias = {};

    noticias.forEach((n) => {
      const cat = n.Categorium ? n.Categorium.nombre : "General";

      if (!categorias[cat]) {
        categorias[cat] = [];
      }

      categorias[cat].push(n);
    });

    // 🔥 Render
    contenedor.innerHTML = Object.keys(categorias)
      .map((categoria) => {
        const lista = categorias[categoria];

        return `
        <section class="mb-20">

          <!-- TITULO -->
          <h2 class="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-10 flex items-center gap-2">
            <span class="w-2 h-8 bg-purple-main"></span> ${categoria}
          </h2>

          <!-- GRID (TODAS IGUALES) -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${
              lista
                .map(
                  (n) => `
                <article class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border group">
                  
                  <div class="relative overflow-hidden">
                    <img src="${n.imagen_url}" alt="${n.titulo}"
                         class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"/>
                    
                    <span class="absolute top-4 left-4 bg-pink-accent text-white text-[10px] font-black px-2 py-1 rounded uppercase">
                      ${categoria}
                    </span>
                  </div>

                  <div class="p-6">
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
              `
                )
                .join("")
            }
          </div>

        </section>
        `;
      })
      .join("");
  } catch (error) {
    console.error(error);
    contenedor.innerHTML = "<p>Error cargando noticias</p>";
  }
}

document.addEventListener("DOMContentLoaded", cargarNoticiasPorCategoria);