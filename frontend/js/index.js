// ===== PROGRAMACIÓN =====
function obtenerProgramacion() {
	return fetch("http://localhost:3000/programas/hoy")
		.then((res) => res.json())
		.catch((err) => {
			console.error("Error al obtener programación:", err);
			return [];
		});
}

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
		const resSup = await fetch(
			`http://localhost:3000/publicidad/activa/encabezado`,
		);
		const promosSup = await resSup.json();

		const slidesContainer = document.getElementById("swiper-slides-container");

		if (slidesContainer && promosSup.length > 0) {
			// 1. Limpiamos y generamos todos los slides
			slidesContainer.innerHTML = promosSup
				.map(
					(p) => `
                <div class="swiper-slide">
                    <a href="${p.link_url}" target="_blank" class="block w-full overflow-hidden rounded-2xl shadow-lg hover:opacity-95 transition">
                        <img src="${p.imagen_url}" alt="Promoción" class="w-full h-auto object-cover border-b-4 border-purple-main">
                    </a>
                </div>
            `,
				)
				.join("");

			// 2. Inicializamos Swiper después de insertar el HTML
			new Swiper("#hero-promos-wrapper", {
				loop: true,
				autoplay: {
					delay: 4000,
					disableOnInteraction: false,
				},
				pagination: {
					el: ".swiper-pagination",
					clickable: true,
				},
				navigation: {
					nextEl: ".swiper-button-next",
					prevEl: ".swiper-button-prev",
				},
			});
		}
	} catch (error) {
		console.error("Error cargando promos:", error);
	}
}
const API = "http://localhost:3000";

async function cargarMarquee() {
	const contenedor = document.getElementById("marquee-container");
	const API = "http://localhost:3000";

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

	try {
		const res = await fetch(`${API}/programas/hoy`);
		const data = await res.json();

		if (!data || data.length === 0) {
			contenedor.innerHTML = `<span class="mx-4 font-bold uppercase text-xs self-center text-white/50">Hoy no hay programación registrada</span>`;
			// Removemos la animación si no hay contenido para que no "vibre" el texto
			contenedor.classList.remove("animate-marquee");
			return;
		}

		const htmlProgramacion = data
			.map((programa) => {
				const vivo = estaEnVivo(programa.hora_inicio, programa.hora_fin);
				const claseVivo = vivo
					? "border-green-500 shadow-lg"
					: "border-white/20";
				const imagenSrc =
					programa.imagen_url || "assets/img/default-programa.jpg";

				return `
            <div class="inline-flex items-center mx-2 flex-shrink-0">
                <div class="relative w-64 h-16 rounded-lg overflow-hidden border-2 ${claseVivo}">
                    <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('${imagenSrc}')"></div>
                    <div class="absolute inset-0 bg-black/60"></div>
                    <div class="absolute inset-0 p-2 flex flex-col justify-center">
                        <span class="text-[8px] font-black uppercase ${vivo ? "text-yellow-neon animate-pulse" : "text-white/70"}">
                            ${vivo ? "EN VIVO 🔴" : `${programa.hora_inicio.slice(0, 5)} - ${programa.hora_fin.slice(0, 5)}`}
                        </span>
                        <h3 class="text-[11px] font-bold text-white uppercase truncate">${programa.nombre}</h3>
                    </div>
                </div>
            </div>`;
			})
			.join("");

		// Definimos el bloque base
		const contenidoBase = `
            <span class="mx-4 font-bold flex items-center gap-2 flex-shrink-0">
                <span class="bg-white text-pink-accent px-2 py-0.5 rounded text-[10px] font-black uppercase">HOY</span>
                PROGRAMACIÓN:
            </span>
            ${htmlProgramacion}
        `;

		// CLAVE: Duplicamos el contenido para que el bucle sea infinito
		contenedor.innerHTML = contenidoBase;
	} catch (error) {
		console.error("Error en marquee:", error);
	}
}
document.addEventListener("DOMContentLoaded", cargarMarquee);

async function chequearLive() {
	const API_KEY = "TU_API_KEY";
	const CHANNEL_ID = "UCwzH2mG2_f12S_LqYw1v6zA";
	const frame = document.getElementById("main-video-frame");

	try {
		const resp = await fetch(
			`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&type=video&eventType=live&key=${API_KEY}`,
		);
		const data = await resp.json();

		if (data.items.length > 0) {
			// ¡Hay un vivo!
			const liveId = data.items[0].id.videoId;
			frame.src = `https://www.youtube.com/embed/${liveId}`;
		} else {
			// No hay vivo, poner video de respaldo
			frame.src = `https://www.youtube.com/embed/VIDEO_DE_RESPALDO_ID`;
		}
	} catch (error) {
		console.error("Error consultando YouTube API", error);
	}
}
