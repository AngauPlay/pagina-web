let paginaActual = 1;
const LIMITE = 5;

document.addEventListener("DOMContentLoaded", () => {
	cargarPagina(1);
});

async function cargarPagina(page) {
	const contenedor = document.getElementById("agenda-container");
	const paginacion = document.getElementById("paginacion-agenda");

	try {
		const res = await fetch(
			`http://localhost:3000/agenda?page=${page}&limit=${LIMITE}`,
		);
		const json = await res.json();

		if (!json.data || json.data.length === 0) {
			contenedor.innerHTML =
				"<p class='text-slate-400 italic col-span-full text-center py-10'>No hay eventos disponibles.</p>";
			if (paginacion) paginacion.innerHTML = "";
			return;
		}

		paginaActual = json.page;

		contenedor.innerHTML = json.data
			.map((evento) => {
				const fechaFormateada = safeDate(evento.fecha);
				const imagenHtml = evento.imagen_url
					? `<img src="${esc(evento.imagen_url)}" class="w-full h-48 object-cover" onerror="this.src='https://placehold.co/600x400/1e293b/ffffff?text=No+Disponible'"/>`
					: `<div class="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-xs">Sin imagen</div>`;

				return `
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 hover:shadow-2xl transition duration-300 flex flex-col">
            ${imagenHtml}
            <div class="p-3 flex flex-col justify-between flex-1">
              <h3 class="font-black text-sm mb-1 line-clamp-2">${esc(evento.titulo)}</h3>
              <div>
                <p class="text-[10px] text-slate-500">📅 ${fechaFormateada}</p>
                <p class="text-[10px] text-slate-500">⏰ ${safeStr(evento.hora)}</p>
                <p class="text-[10px] text-slate-600">📍 ${esc(safeStr(evento.lugar))}</p>
              </div>
            </div>
          </div>`;
			})
			.join("");

		if (paginacion) {
			paginacion.innerHTML = renderizarPaginacion(json);
		}
	} catch (error) {
		console.error(error);
		if (contenedor) {
			contenedor.innerHTML =
				"<p class='text-red-500 text-center py-10 font-bold col-span-full'>Error al cargar la agenda</p>";
		}
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
		if (fin < totalPages - 1)
			html += `<span class="px-2 text-slate-400">...</span>`;
		html += `<button onclick="cargarPagina(${totalPages})" class="px-3 py-2 rounded-lg font-bold text-sm bg-white text-purple-main hover:bg-purple-main hover:text-white border border-purple-main transition">${totalPages}</button>`;
	}

	html += `<button onclick="cargarPagina(${totalPages})" class="px-3 py-2 rounded-lg font-bold text-sm transition ${page === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-purple-main hover:bg-purple-main hover:text-white border border-purple-main"}">»</button>`;

	return html;
}
