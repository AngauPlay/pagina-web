let lightbox = null;
const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

document.addEventListener("DOMContentLoaded", () => {
	cargarCarrusel();
	cargarPromos();
	crearLightbox();
});

function crearLightbox() {
	const div = document.createElement("div");
	div.id = "lightbox-programas";
	div.className = "fixed inset-0 bg-black/90 z-[200] hidden items-center justify-center p-4 backdrop-blur-sm";
	div.style.display = "none";
	div.innerHTML = `
		<button id="cerrar-lightbox" class="absolute top-4 right-4 text-white text-4xl hover:text-pink-accent transition z-10">&times;</button>
		<div class="flex flex-col md:flex-row items-center gap-6 max-w-4xl w-full">
			<img id="lightbox-img" class="max-h-[70vh] w-full md:w-1/2 object-contain rounded-2xl shadow-2xl" src="" alt="">
			<div class="text-white md:w-1/2 space-y-3 text-center md:text-left">
				<h2 id="lightbox-nombre" class="text-2xl md:text-3xl font-black"></h2>
				<p id="lightbox-horario" class="text-lg text-pink-accent font-bold"></p>
				<p id="lightbox-staff" class="text-base text-white/70"></p>
			</div>
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

function abrirLightbox(programa) {
	if (!lightbox) return;
	document.getElementById("lightbox-img").src = programa.imagen_url || "https://placehold.co/600x400/1e293b/ffffff?text=ANG";
	document.getElementById("lightbox-nombre").textContent = programa.nombre || "";
	document.getElementById("lightbox-horario").textContent = `${safeSlice(programa.hora_inicio, 0, 5)} — ${safeSlice(programa.hora_fin, 0, 5)}`;
	document.getElementById("lightbox-staff").textContent = programa.staff ? `Conductores: ${programa.staff}` : "";
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

async function cargarCarrusel() {
	try {
		const res = await fetch("http://localhost:3000/programas");
		const data = await res.json();

		const porDia = [[], [], [], [], [], [], []];
		data.forEach((p) => {
			if (p.dia_semana !== undefined && p.dia_semana !== null) {
				porDia[p.dia_semana].push(p);
			}
		});

		porDia.forEach((dia) =>
			dia.sort((a, b) => (a.hora_inicio || "").localeCompare(b.hora_inicio || ""))
		);

		const hoy = new Date().getDay();

		const contenedor = document.getElementById("grilla-semanal");
		contenedor.innerHTML = `
			<div class="swiper" id="swiper-programacion">
				<div class="swiper-wrapper">
					${porDia.map((programas, index) => {
						const esHoy = index === hoy;
						return `
							<div class="swiper-slide">
								<div class="flex items-center gap-3 mb-4">
									<h2 class="text-xl font-black ${esHoy ? "text-pink-accent" : "text-slate-500"} uppercase">${DIAS[index]}</h2>
									${esHoy ? '<span class="bg-pink-accent text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">HOY</span>' : ""}
								</div>
								${programas.length === 0
									? '<p class="text-slate-400 italic text-sm">Sin programación</p>'
									: `<div class="flex gap-3 overflow-x-auto pb-3" style="scrollbar-width: thin;">
										${programas.map((p) => {
											const alAire = esHoy && estaAlAire(p.hora_inicio, p.hora_fin);
											const imgSrc = p.imagen_url || "https://placehold.co/200x150/1e293b/ffffff?text=ANG";
											const encoded = esc(JSON.stringify(p).replace(/"/g, "&quot;"));
											return `
												<div class="flex-shrink-0 w-36 md:w-44 cursor-pointer group" onclick='abrirLightbox(${encoded})'>
													<div class="relative rounded-xl overflow-hidden ${alAire ? "ring-2 ring-green-500 ring-offset-2" : "shadow-md"} hover:shadow-xl transition">
														<img src="${esc(imgSrc)}" alt="${esc(p.nombre)}" class="w-full h-28 md:h-36 object-cover group-hover:scale-105 transition duration-300" onerror="this.src='https://placehold.co/200x150/1e293b/ffffff?text=ANG'">
														${alAire ? '<span class="absolute top-1 left-1 bg-green-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded animate-pulse">🔴 EN VIVO</span>' : ""}
													</div>
													<p class="text-xs font-bold text-slate-700 mt-1.5 truncate text-center">${esc(p.nombre)}</p>
												</div>
											`;
										}).join("")}
									</div>`
								}
							</div>
						`;
					}).join("")}
				</div>

				<div class="flex justify-center gap-3 mt-8">
					<button class="btn-prev-programacion cursor-pointer bg-purple-main hover:opacity-90 text-white px-5 py-2 rounded-lg font-bold text-sm transition">&larr; Anterior</button>
					<button class="btn-next-programacion cursor-pointer bg-purple-main hover:opacity-90 text-white px-5 py-2 rounded-lg font-bold text-sm transition">Siguiente &rarr;</button>
				</div>
			</div>
		`;

		new Swiper("#swiper-programacion", {
			initialSlide: hoy,
			slidesPerView: 1,
			navigation: {
				nextEl: ".btn-next-programacion",
				prevEl: ".btn-prev-programacion",
			},
		});
	} catch (error) {
		console.error("Error cargando programación:", error);
		const cont = document.getElementById("grilla-semanal");
		if (cont) {
			cont.innerHTML = `
				<div class="text-center py-10 text-red-500 font-bold">
					Error al cargar la programación.
					<button onclick="cargarCarrusel()" class="block mx-auto mt-2 text-pink-accent underline">Reintentar</button>
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