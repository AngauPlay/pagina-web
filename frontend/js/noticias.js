const API = "http://localhost:3000";
let paginaActual = 1;
const LIMITE = 30;

document.addEventListener("DOMContentLoaded", () => {
	cargarPagina(1);
});

async function cargarPagina(page) {
	const contenedor = document.getElementById("contenedor-categorias");
	const paginacion = document.getElementById("paginacion");

	try {
		const res = await fetch(`${API}/noticias?page=${page}&limit=${LIMITE}`);
		const json = await res.json();

		if (!json.data || json.data.length === 0) {
			contenedor.innerHTML = "<p class='text-slate-500 text-center py-10'>No hay noticias disponibles.</p>";
			if (paginacion) paginacion.innerHTML = "";
			return;
		}

		paginaActual = json.page;

		contenedor.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        ${json.data.map((n) => `
          <article class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border group">
            <div class="relative overflow-hidden">
              <img src="${esc(n.imagen_url)}" alt="${esc(n.titulo)}"
                   class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" onerror="this.src='https://placehold.co/400x300/1e293b/ffffff?text=ANG'"/>
              <span class="absolute top-4 left-4 bg-pink-accent text-white text-[10px] font-black px-2 py-1 rounded uppercase">${esc(n.Categorium?.nombre || "General")}</span>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-black text-slate-800 group-hover:text-pink-accent transition">${esc(n.titulo)}</h3>
              <p class="text-slate-500 mt-3 text-sm line-clamp-2">${esc(safeStr(n.copete))}</p>
              <a href="articulo.html?slug=${esc(n.slug)}" class="inline-block mt-4 text-pink-accent font-black text-xs hover:translate-x-2 transition">LEER MÁS →</a>
            </div>
          </article>`
		).join("")}
      </div>`;

		if (paginacion) {
			paginacion.innerHTML = renderizarPaginacion(json);
		}

		window.scrollTo({top: 0, behavior: "smooth"});
	} catch (error) {
		console.error(error);
		if (contenedor) contenedor.innerHTML = "<p class='text-red-500 text-center py-10'>Error cargando noticias</p>";
	}
}

function renderizarPaginacion(json) {
	const {page, totalPages} = json;
	if (totalPages <= 1) return "";

	const rango = 2;
	let html = "";

	html += `<button onclick="cargarPagina(1)" class="px-3 py-2 rounded-lg font-bold text-sm transition ${page === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-purple-main hover:bg-purple-main hover:text-white border border-purple-main"}">«</button>`;

	let inicio = Math.max(1, page - rango);
	let fin = Math.min(totalPages, page + rango);

	if (inicio > 1) {
		html += `<button onclick="cargarPagina(1)" class="px-3 py-2 rounded-lg font-bold text-sm bg-white text-purple-main hover:bg-purple-main hover:text-white border border-purple-main transition">1</button>`;
		if (inicio > 2) html += `<span class="px-2 text-slate-400">...</span>`;
	}

	for (let i = inicio; i <= fin; i++) {
		html += `<button onclick="cargarPagina(${i})" class="px-3 py-2 rounded-lg font-bold text-sm transition ${i === page ? "bg-purple-main text-white" : "bg-white text-purple-main hover:bg-purple-main hover:text-white border border-purple-main"}">${i}</button>`;
	}

	if (fin < totalPages) {
		if (fin < totalPages - 1) html += `<span class="px-2 text-slate-400">...</span>`;
		html += `<button onclick="cargarPagina(${totalPages})" class="px-3 py-2 rounded-lg font-bold text-sm bg-white text-purple-main hover:bg-purple-main hover:text-white border border-purple-main transition">${totalPages}</button>`;
	}

	html += `<button onclick="cargarPagina(${totalPages})" class="px-3 py-2 rounded-lg font-bold text-sm transition ${page === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-purple-main hover:bg-purple-main hover:text-white border border-purple-main"}">»</button>`;

	return html;
}