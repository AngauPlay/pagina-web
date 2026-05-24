const agendaContainer = document.getElementById("agenda-container");

async function cargarAgenda() {
	try {
		const res = await fetch("http://localhost:3000/agenda");
		const data = await res.json();

		if (!data.length) {
			agendaContainer.innerHTML = "<p class='text-slate-500 text-center py-10'>No hay eventos disponibles.</p>";
			return;
		}

		agendaContainer.innerHTML = data.map((evento) => {
			const fechaFormateada = safeDate(evento.fecha);
			const imagenHtml = evento.imagen_url
				? `<img src="${esc(evento.imagen_url)}" class="w-full h-72 object-cover" onerror="this.src='https://placehold.co/600x400/1e293b/ffffff?text=No+Disponible'"/>`
				: `<div class="w-full h-72 bg-gray-200 flex items-center justify-center text-gray-500">Sin imagen</div>`;

			return `
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 hover:shadow-2xl transition duration-300 flex flex-col">
            ${imagenHtml}
            <div class="p-4 flex flex-col justify-between flex-1">
              <div>
                <h3 class="font-black text-lg mb-2 line-clamp-2">${esc(evento.titulo)}</h3>
                <p class="text-xs text-slate-500 mb-2">📅 ${fechaFormateada}</p>
                <p class="text-xs text-slate-500 mb-2">⏰ ${safeStr(evento.hora)}</p>
                <p class="text-xs text-slate-600 mb-2">📍 ${esc(safeStr(evento.lugar))}</p>
              </div>
              <p class="text-sm text-slate-700 line-clamp-3">${esc(safeStr(evento.descripcion))}</p>
            </div>
          </div>`;
		}).join("");
	} catch (error) {
		console.error(error);
		if (agendaContainer) {
			agendaContainer.innerHTML = "<p class='text-red-500 text-center py-10 font-bold'>Error al cargar la agenda</p>";
		}
	}
}

cargarAgenda();