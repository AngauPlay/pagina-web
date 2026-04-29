// ===== PROGRAMACIÓN =====
function obtenerProgramacion() {
	return fetch("http://localhost:3000/programas/hoy")
		.then((res) => res.json())
		.catch((err) => {
			console.error("Error al obtener programación:", err);
			return [];
		});
}

function estaEnVivo(inicio, fin) {
	if (!inicio || !fin) return false;

	const ahora = new Date();
	const actual = ahora.getHours() * 60 + ahora.getMinutes();

	const [hi, mi] = inicio.split(":").map(Number);
	const [hf, mf] = fin.split(":").map(Number);

	const ini = hi * 60 + mi;
	const finM = hf * 60 + mf;

	return actual >= ini && actual <= finM;
}
async function renderProgramacion() {
	const contenedor = document.getElementById("programacion-container");

	try {
		const res = await fetch("http://localhost:3000/programas/hoy");
		const data = await res.json();

		if (!data || data.length === 0) {
			contenedor.innerHTML = "<p>No hay programación hoy</p>";
			return;
		}

		// Cambiamos (p) por (programa) para que coincida con el resto de tu código
		contenedor.innerHTML = data
			.map((programa) => {
				const vivo = estaEnVivo(programa.hora_inicio, programa.hora_fin);
				const claseVivo = vivo ? "border-green-500" : "border-pink-500";

				// Ahora 'programa.imagen_url' sí funcionará
				const imagenSrc = programa.imagen_url
					? programa.imagen_url
					: "assets/img/default-programa.jpg";

				return `
        <div class="relative rounded-xl overflow-hidden shadow-lg cursor-pointer group h-28">

    <!-- IMAGEN DE FONDO -->
    <div 
  class="absolute inset-0 bg-cover bg-center bg-no-repeat"
  style="background-image: url('${imagenSrc}')"
></div>


    <!-- OVERLAY OSCURO -->
    <div class="absolute inset-0 bg-black/50"></div>

    <!-- CONTENIDO -->
    <div class="absolute bottom-2 left-3 right-3 text-white z-10">
      
      <span class="text-[10px] font-bold ${
				vivo ? "text-yellow-neon" : "text-white/80"
			} uppercase">
        ${
					vivo
						? "EN VIVO 🔴"
						: `${programa.hora_inicio.substring(0, 5)} - ${programa.hora_fin.substring(0, 5)}`
				}
      </span>

      <h3 class="font-bold text-sm leading-tight">
        ${programa.nombre}
      </h3>

      <p class="text-[10px] text-white/80 italic">
        ${programa.staff || ""}
      </p>

    </div>

  </div>
`;
			})
			.join("");
	} catch (error) {
		console.error("Error cargando programación:", error);
		contenedor.innerHTML = "<p>Error cargando programación</p>";
	}
}
async function cargarGrillaEnModal() {
	try {
		const res = await fetch("http://localhost:3000/programas");
		const data = await res.json();

		const diasNombres = [
			"Domingo",
			"Lunes",
			"Martes",
			"Miércoles",
			"Jueves",
			"Viernes",
			"Sábado",
		];

		const horasSet = new Set();
		data.forEach((p) => {
			horasSet.add(p.hora_inicio.slice(0, 5));
		});

		const horas = Array.from(horasSet).sort();

		const grilla = {};
		horas.forEach((h) => {
			grilla[h] = Array(7).fill(null);
		});

		data.forEach((p) => {
			const hora = p.hora_inicio.slice(0, 5);
			grilla[hora][p.dia_semana] = p;
		});

		contenedorModal.innerHTML = `
      <table class="w-full text-sm border">
        <thead>
          <tr class="bg-purple-main text-white">
            <th class="p-3">Hora</th>
            ${diasNombres.map((d) => `<th class="p-3">${d}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${horas
						.map(
							(hora) => `
            <tr class="border-t">
              <td class="p-3 font-bold bg-gray-100">${hora}</td>
              ${grilla[hora]
								.map((p) => {
									if (!p) return `<td></td>`;

									return `
                    <td class="p-2">
                      <div class="bg-pink-accent text-white p-3 rounded-xl text-center font-bold">
                        ${p.nombre}
                      </div>
                    </td>
                  `;
								})
								.join("")}
            </tr>
          `,
						)
						.join("")}
        </tbody>
      </table>
    `;
	} catch (error) {
		console.error(error);
	}
}

const btnGrilla = document.getElementById("btn-ver-grilla");
const modal = document.getElementById("modal-programacion");
const cerrarModal = document.getElementById("cerrar-modal");
const contenedorModal = document.getElementById("grilla-modal-contenido");

btnGrilla.addEventListener("click", async () => {
	modal.classList.remove("hidden");

	// Cargar solo una vez
	if (contenedorModal.innerHTML === "") {
		await cargarGrillaEnModal();
	}
});

cerrarModal.addEventListener("click", () => {
	modal.classList.add("hidden");
});

// ===== NOTICIAS =====
async function cargarNoticias() {
	const contenedorNoticias = document.getElementById("noticias-container");
	const contenedorHero = document.getElementById("hero-noticia");

	try {
		const respuesta = await fetch("http://localhost:3000/noticias");
		const noticias = await respuesta.json();

		if (!noticias || noticias.length === 0) {
			contenedorHero.innerHTML =
				"<p class='text-white italic'>No hay noticias destacadas.</p>";
			contenedorNoticias.innerHTML = "<p>No hay noticias publicadas.</p>";
			return;
		}

		// 1. NOTICIA PRINCIPAL (Indice 0)
		const principal = noticias[0];
		// Accedemos a Categorium.nombre según tu JSON
		const catPrincipal = principal.Categorium
			? principal.Categorium.nombre
			: "General";

		contenedorHero.innerHTML = `
      <article class="relative group overflow-hidden rounded-3xl bg-slate-900 shadow-2xl cursor-pointer" 
               onclick="window.location.href='articulo.html?slug=${principal.slug}'">
        <img
          src="${principal.imagen_url}"
          class="w-full h-[450px] object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
          alt="${principal.titulo}"
        />
        <div class="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent">
          <span class="bg-pink-accent text-white text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest">
            ${catPrincipal}
          </span>
          <h3 class="text-3xl md:text-5xl font-black text-white mt-4 leading-tight">
            ${principal.titulo}
          </h3>
          <p class="text-gray-300 mt-4 text-lg max-w-2xl hidden md:block">
            ${principal.copete}
          </p>
        </div>
      </article>
    `;

		// 2. RESTO DE NOTICIAS (Slice desde 1)
		const restoNoticias = noticias.slice(1);

		if (restoNoticias.length > 0) {
			contenedorNoticias.innerHTML = restoNoticias
				.map((noticia) => {
					const catNombre = noticia.Categorium
						? noticia.Categorium.nombre
						: "General";

					return `
          <article class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-slate-100 group">
            <div class="relative overflow-hidden">
              <img src="${noticia.imagen_url}" alt="${noticia.titulo}" class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
              <span class="absolute top-4 left-4 bg-pink-accent text-white text-[10px] font-black px-2 py-1 rounded uppercase">
                ${catNombre}
              </span>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-black leading-tight text-slate-800 group-hover:text-pink-accent transition-colors">
                ${noticia.titulo}
              </h3>
              <p class="text-slate-500 mt-3 text-sm line-clamp-2">${noticia.copete}</p>
              <a href="articulo.html?slug=${noticia.slug}" class="inline-block mt-4 text-pink-accent font-black text-xs tracking-widest hover:translate-x-2 transition-transform">
                LEER MÁS →
              </a>
            </div>
          </article>
        `;
				})
				.join("");
		} else {
			contenedorNoticias.innerHTML =
				"<p class='col-span-3 text-center text-slate-400'>No hay más noticias anteriores.</p>";
		}
	} catch (error) {
		console.error("Error al cargar noticias:", error);
		if (contenedorNoticias)
			contenedorNoticias.innerHTML =
				"<p>Error al conectar con el servidor.</p>";
	}
}

// IMPORTANTE: Asegúrate de llamar a la función al cargar la página
document.addEventListener("DOMContentLoaded", () => {
	cargarNoticias();
	renderProgramacion();
	cargarPromos();
});
// LÓGICA DEL MENÚ
const menuBtn = document.getElementById("menu-btn");
const closeMenu = document.getElementById("close-menu");
const mobileMenu = document.getElementById("mobile-menu");
const overlay = document.getElementById("overlay");

function toggleMenu() {
	mobileMenu.classList.toggle("-translate-x-full");
	overlay.classList.toggle("hidden");
	document.body.classList.toggle("menu-open");
}

menuBtn.addEventListener("click", toggleMenu);
closeMenu.addEventListener("click", toggleMenu);
overlay.addEventListener("click", toggleMenu);

async function cargarPromos() {
	try {
		// 1. Cargamos la promo del encabezado
		const resSup = await fetch(
			`http://localhost:3000/publicidad/activa/encabezado`,
		);
		const promosSup = await resSup.json();

		const contenedorSup = document.getElementById("hero-promos-wrapper");
		if (contenedorSup && promosSup.length > 0) {
			const p = promosSup[0];
			contenedorSup.innerHTML = `
                <a href="${p.link_url}" target="_blank" class="block w-full overflow-hidden rounded-2xl shadow-lg hover:opacity-95 transition">
                    <img src="${p.imagen_url}" alt="Promoción" class="w-full h-auto object-cover border-b-4 border-purple-main">
                </a>
            `;
		}

		// 2. Cargamos la promo de abajo (si tienes)
		const resInf = await fetch(`http://localhost:3000/publicidad/activa/pie`);
		const promosInf = await resInf.json();

		const contenedorInf = document.getElementById("bottom-promos-wrapper");
		if (contenedorInf && promosInf.length > 0) {
			const p = promosInf[0];
			contenedorInf.innerHTML = `
                <a href="${p.link_url}" target="_blank" class="block w-full overflow-hidden rounded-2xl shadow-lg hover:opacity-95 transition">
                    <img src="${p.imagen_url}" alt="Promoción" class="w-full h-auto object-cover border-t-4 border-pink-accent">
                </a>
            `;
		}
	} catch (error) {
		console.error("Error cargando promos:", error);
	}

	const API = "http://localhost:3000";

	async function cargarMarquee() {
		try {
			const res = await fetch(`${API}/noticias`);
			const noticias = await res.json();

			const contenedor = document.getElementById("marquee-container");

			// Filtrar solo publicadas
			const publicadas = noticias.filter((n) => n.estado === "publicado");

			const htmlNoticias = publicadas
				.map(
					(n) => `
        <span class="mx-4 text-white/90 cursor-pointer hover:underline"
          onclick="window.location.href='articulo.html?slug=${n.slug}'">
          ${n.titulo}
        </span>
        <span class="mx-4 opacity-30">|</span>
      `,
				)
				.join("");

			contenedor.innerHTML += htmlNoticias;
		} catch (error) {
			console.error("Error cargando marquee:", error);
		}
	}

	// Ejecutar
	cargarMarquee();
}
