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

		const categorias = {};

		noticias.forEach((n) => {
			const cat = n.Categorium ? n.Categorium.nombre : "General";
			if (!categorias[cat]) categorias[cat] = [];
			categorias[cat].push(n);
		});

		contenedor.innerHTML = Object.keys(categorias)
			.map((categoria) => {
				const lista = categorias[categoria];
				return `
        <section class="mb-20">
          <h2 class="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-10 flex items-center gap-2">
            <span class="w-2 h-8 bg-purple-main"></span> ${esc(categoria)}
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${lista.map((n) => `
                <article class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border group">
                  <div class="relative overflow-hidden">
                    <img src="${esc(n.imagen_url)}" alt="${esc(n.titulo)}"
                         class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" onerror="this.src='https://placehold.co/400x300/1e293b/ffffff?text=ANG'"/>
                    <span class="absolute top-4 left-4 bg-pink-accent text-white text-[10px] font-black px-2 py-1 rounded uppercase">${esc(categoria)}</span>
                  </div>
                  <div class="p-6">
                    <h3 class="text-xl font-black text-slate-800 group-hover:text-pink-accent transition">${esc(n.titulo)}</h3>
                    <p class="text-slate-500 mt-3 text-sm line-clamp-2">${esc(safeStr(n.copete))}</p>
                    <a href="articulo.html?slug=${esc(n.slug)}" class="inline-block mt-4 text-pink-accent font-black text-xs hover:translate-x-2 transition">LEER MÁS →</a>
                  </div>
                </article>`
			).join("")}
          </div>
        </section>`;
			})
			.join("");
	} catch (error) {
		console.error(error);
		if (contenedor) contenedor.innerHTML = "<p class='text-red-500 text-center py-10'>Error cargando noticias</p>";
	}
}