const agendaContainer = document.getElementById("agenda-container");

async function cargarAgenda() {
  try {
    const res = await fetch("http://localhost:3000/agenda");
    const data = await res.json();

    if (!data.length) {
      agendaContainer.innerHTML = "<p>No hay eventos disponibles.</p>";
      return;
    }

    agendaContainer.innerHTML = data
      .map((evento) => {
        return `
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition">

          ${
            evento.imagen_url
              ? `<img src="${evento.imagen_url}" class="w-full h-48 object-cover"/>`
              : `<div class="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">Sin imagen</div>`
          }

          <div class="p-5">
            <h3 class="font-black text-lg mb-2">${evento.titulo}</h3>

            <p class="text-sm text-slate-500 mb-2">
              📅 ${new Date(evento.fecha).toLocaleDateString()} - ⏰ ${evento.hora}
            </p>

            <p class="text-sm text-slate-600 mb-3">
              📍 ${evento.lugar}
            </p>

            <p class="text-sm text-slate-700">
              ${evento.descripcion || ""}
            </p>
          </div>
        </div>
      `;
      })
      .join("");
  } catch (error) {
    console.error(error);
    agendaContainer.innerHTML =
      "<p class='text-red-500'>Error al cargar la agenda</p>";
  }
}

cargarAgenda();