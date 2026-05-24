document.addEventListener("DOMContentLoaded", () => {
	cargarGrilla();
	cargarPromos();
	crearLightbox();
});

let lightbox = null;

function crearLightbox() {
	const div = document.createElement("div");
	div.id = "lightbox-programas";
	div.className = "fixed inset-0 bg-black/80 z-[200] hidden items-center justify-center p-4 backdrop-blur-sm";
	div.style.display = "none";
	div.innerHTML = `
		<button id="cerrar-lightbox" class="absolute top-4 right-4 text-white text-4xl hover:text-pink-accent transition z-10">&times;</button>
		<div class="flex flex-col items-center gap-4 max-w-4xl w-full">
			<img id="lightbox-img" class="max-h-[80vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl" src="" alt="">
			<p id="lightbox-caption" class="text-white/80 text-sm font-medium text-center"></p>
		</div>
	`;
	document.body.appendChild(div);

	div.addEventListener("click", (e) => {
		if (e.target === div) cerrarLightbox();
	});
	document.getElementById("cerrar-lightbox").onclick = cerrarLightbox;
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape") cerrarLightbox();
	});

	lightbox = div;
}

function abrirLightbox(src, nombre) {
	if (!lightbox) return;
	document.getElementById("lightbox-img").src = src;
	document.getElementById("lightbox-caption").textContent = nombre || "";
	lightbox.style.display = "flex";
	document.body.style.overflow = "hidden";
}

function cerrarLightbox() {
	if (!lightbox) return;
	lightbox.style.display = "none";
	document.body.style.overflow = "";
}

function estaAlAire(inicio, fin) {
	const ahora = new Date();
	const actual = ahora.getHours() * 60 + ahora.getMinutes();
	const [hi, mi] = (inicio || "").split(":").map(Number);
	const [hf, mf] = (fin || "").split(":").map(Number);
	if (isNaN(hi) || isNaN(hf)) return false;
	return actual >= hi * 60 + mi && actual <= hf * 60 + mf;
}

async function cargarGrilla() {
	try {
		const res = await fetch("http://localhost:3000/programas");
		const data = await res.json();

		const contenedor = document.getElementById("grilla-semanal");
		const diasNombres = [
			"Domingo", "Lunes", "Martes", "Miércoles",
			"Jueves", "Viernes", "Sábado",
		];

		const horasSet = new Set();
		data.forEach((p) => {
			const h = safeSlice(p.hora_inicio, 0, 5);
			if (h) horasSet.add(h);
		});

		const horas = Array.from(horasSet).sort();
		const grilla = {};
		horas.forEach((h) => { grilla[h] = Array(7).fill(null); });

		data.forEach((p) => {
			const hora = safeSlice(p.hora_inicio, 0, 5);
			if (hora && p.dia_semana !== undefined && p.dia_semana !== null) {
				grilla[hora][p.dia_semana] = p;
			}
		});

		contenedor.innerHTML = `
      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse min-w-[800px]">
          <thead>
            <tr class="bg-purple-main text-white">
              <th class="p-3 sticky left-0 bg-purple-main z-10 text-left">Hora</th>
              ${diasNombres.map((d) => `<th class="p-3 text-center">${d.substring(0, 3)}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${horas.map((hora) => `
              <tr class="border-t hover:bg-gray-50 transition">
                <td class="p-3 font-bold text-slate-700 sticky left-0 bg-gray-50 border-r z-10">${hora}</td>
                ${grilla[hora].map((p) => {
                  if (!p) return `<td class="p-2 border-r border-gray-100"></td>`;

                  const alAire = estaAlAire(p.hora_inicio, p.hora_fin);
                  const imgSrc = p.imagen_url || "https://placehold.co/150x80/1e293b/ffffff?text=ANG";
                  const inicio = safeSlice(p.hora_inicio, 0, 5);
                  const fin = safeSlice(p.hora_fin, 0, 5);

                  return `
                    <td class="p-2 border-r border-gray-100 align-top">
                      <div class="${alAire ? "ring-2 ring-green-500 ring-offset-1" : ""} bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition">
                        <img src="${esc(imgSrc)}" alt="${esc(p.nombre)}" class="w-full h-20 object-cover cursor-pointer" onclick="abrirLightbox('${esc(imgSrc)}', '${esc(p.nombre)}')" onerror="this.src='https://placehold.co/150x80/1e293b/ffffff?text=ANG'">
                        <div class="p-2 text-center">
                          <div class="text-xs font-bold text-slate-800 leading-tight truncate">${esc(p.nombre)}</div>
                          <div class="text-[9px] text-gray-500 mt-0.5 truncate">${esc(safeStr(p.staff))}</div>
                          <div class="text-[8px] text-gray-400 font-semibold mt-1">${inicio} a ${fin}</div>
                        </div>
                      </div>
                    </td>
                  `;
                }).join("")}
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
	} catch (error) {
		console.error("Error cargando grilla:", error);
		const cont = document.getElementById("grilla-semanal");
		if (cont) {
			cont.innerHTML = `
        <div class="text-center py-10 text-red-500 font-bold">
          Error al cargar la programación.
          <button onclick="cargarGrilla()" class="block mx-auto mt-2 text-pink-accent underline">Reintentar</button>
        </div>`;
		}
	}
}

async function cargarPromos() {
	try {
		const res = await fetch("http://localhost:3000/publicidad/activa/encabezado");
		if (!res.ok) return;
		const promos = await res.json();
		const slides = document.getElementById("swiper-slides-container");

		if (slides && promos && promos.length > 0) {
			slides.innerHTML = promos.map((p) => `
            <div class="swiper-slide">
              <a href="${esc(p.link_url || "#")}" target="_blank" class="block w-full overflow-hidden rounded-2xl shadow-lg hover:opacity-95 transition">
                <img src="${esc(p.imagen_url)}" alt="Promoción" class="w-full h-auto object-cover border-b-4 border-purple-main" onerror="this.style.display='none'">
              </a>
            </div>`
			).join("");

			new Swiper("#hero-promos-wrapper", {
				loop: true,
				autoplay: { delay: 4000, disableOnInteraction: false },
				pagination: { el: ".swiper-pagination", clickable: true },
				navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
			});
		}
	} catch (error) {
		console.error("Error cargando promos:", error);
	}
}