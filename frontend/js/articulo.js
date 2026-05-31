/**
 * ANGAU PLAY - Lógica de Detalle de Artículo con Fullscreen
 */

const API_BASE = "http://localhost:3000";
let galeriaAutoplayInterval = null; // Guardar referencia para evitar memory leaks

document.addEventListener("DOMContentLoaded", async () => {
	const urlParams = new URLSearchParams(window.location.search);
	const slug = urlParams.get("slug");

	if (!slug) {
		window.location.href = "index.html";
		return;
	}

	try {
		const response = await fetch(`${API_BASE}/noticias/detalle/${slug}`);
		if (!response.ok) throw new Error("Noticia no encontrada");

		const noticia = await response.json();

		// UI Updates
		document.getElementById("loading-state").classList.add("hidden");
		document.getElementById("articulo-content").classList.remove("hidden");

		// Títulos y Meta
		document.title = `${noticia.titulo} | ANGAU PLAY`;
		document.getElementById("articulo-titulo").textContent = noticia.titulo;

		// Categoría (Uso de Optional Chaining para mayor seguridad)
		document.getElementById("articulo-categoria").textContent =
			noticia.Categorium?.nombre || noticia.categoria?.nombre || "General";

		// --- Lógica de Imagen Principal ---
		const imgUrl = noticia.imagen_url || "assets/default-img.jpg";
		const imgElement = document.getElementById("articulo-imagen");
		const linkElement = document.getElementById("articulo-imagen-link");

		if (imgElement && linkElement) {
			imgElement.src = imgUrl;
			linkElement.href = imgUrl;

			// Obtener dimensiones de forma asíncrona
			const imgTemp = new Image();
			imgTemp.src = imgUrl;
			try {
				await imgTemp.decode(); // Espera a que la imagen sea decodificable
				linkElement.setAttribute("data-pswp-width", imgTemp.width);
				linkElement.setAttribute("data-pswp-height", imgTemp.height);
			} catch (e) {
				console.warn(
					"No se pudo precargar las dimensiones de la imagen principal, PhotoSwipe usará el fallback.",
				);
			}
		}

		if (noticia.cuerpo) {
			document.getElementById("articulo-cuerpo").innerHTML = noticia.cuerpo
				.split("\n")
				.filter((p) => p.trim())
				.map((p) => `<p class="mb-6">${esc(p)}</p>`)
				.join("");
		}

		// --- Galería y PhotoSwipe ---
		if (noticia.galeria && noticia.galeria.length > 0) {
			renderizarGaleriaExtra(noticia.galeria);
		}

		// Inicializar siempre al final de la carga de datos
		inicializarPhotoSwipe();

		// --- Cargas secundarias ---
		cargarSugeridas(slug);
		cargarPromos();
	} catch (error) {
		console.error(error);
		document.getElementById("loading-state").classList.add("hidden");
		document.getElementById("articulo-content").innerHTML = `
            <div class="text-center py-20">
                <h2 class="text-2xl font-black text-slate-800 mb-4">Ups! Algo salió mal</h2>
                <p class="text-slate-500 mb-6">No pudimos cargar esta noticia.</p>
                <a href="index.html" class="bg-pink-accent text-white px-6 py-3 rounded-full font-bold hover:opacity-90">
                    Volver al inicio
                </a>
            </div>
        `;
	}
});

/**
 * Renderiza las fotos adicionales debajo del contenido
 */
function renderizarGaleriaExtra(fotos) {
	const cuerpo = document.getElementById("articulo-cuerpo");
	if (!cuerpo) return;

	// Eliminar galería previa si existiese para evitar duplicados
	const galeriaPrevia = document.getElementById("articulo-galeria-dinamica");
	if (galeriaPrevia) galeriaPrevia.remove();

	const divGaleria = document.createElement("div");
	divGaleria.id = "articulo-galeria-dinamica";
	divGaleria.className = "mt-12 border-t pt-8";

	divGaleria.innerHTML = `
        <h3 class="text-xl font-black italic uppercase mb-4 text-purple-main">
            Galería de imágenes
        </h3>

        <div class="relative overflow-hidden rounded-2xl">
            <!-- CONTENEDOR SLIDER -->
            <div id="carousel-galeria" class="flex transition-transform duration-500">
                ${fotos
									.map(
										(f) => `
                    <div class="min-w-full">
                        <a href="${f.url}" class="galeria-link block">
                            <img src="${f.url}" class="w-full h-[300px] object-cover" loading="lazy" onerror="this.src='https://placehold.co/600x300/1e293b/ffffff?text=ANG'">
                        </a>
                    </div>
                `,
									)
									.join("")}
            </div>

            <!-- BOTONES -->
            <button id="prev-galeria" class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white px-3 py-1 rounded-full transition-colors z-10">
                ‹
            </button>

            <button id="next-galeria" class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white px-3 py-1 rounded-full transition-colors z-10">
                ›
            </button>
        </div>
    `;

	cuerpo.appendChild(divGaleria);
	inicializarCarruselGaleria();
}

function inicializarCarruselGaleria() {
	const contenedor = document.getElementById("carousel-galeria");
	if (!contenedor) return;

	const slides = contenedor.children;
	if (slides.length <= 1) {
		// Si hay una sola foto, ocultamos los botones de navegación
		document.getElementById("prev-galeria")?.remove();
		document.getElementById("next-galeria")?.remove();
		return;
	}

	let index = 0;

	const actualizar = () => {
		contenedor.style.transform = `translateX(-${index * 100}%)`;
	};

	const siguienteSlide = () => {
		index = (index + 1) % slides.length;
		actualizar();
	};

	const anteriorSlide = () => {
		index = (index - 1 + slides.length) % slides.length;
		actualizar();
	};

	// Control de Autoplay Seguro
	if (galeriaAutoplayInterval) clearInterval(galeriaAutoplayInterval);

	const iniciarAutoplay = () => {
		galeriaAutoplayInterval = setInterval(siguienteSlide, 4000);
	};

	const reiniciarAutoplay = () => {
		clearInterval(galeriaAutoplayInterval);
		iniciarAutoplay();
	};

	document.getElementById("next-galeria").onclick = () => {
		siguienteSlide();
		reiniciarAutoplay();
	};

	document.getElementById("prev-galeria").onclick = () => {
		anteriorSlide();
		reiniciarAutoplay();
	};

	// Iniciar el ciclo automático inicial
	iniciarAutoplay();
}

/**
 * Inicializa PhotoSwipe para que reconozca la principal y la galería
 */
function inicializarPhotoSwipe() {
	import("https://cdnjs.cloudflare.com/ajax/libs/photoswipe/5.4.2/photoswipe-lightbox.esm.min.js")
		.then((module) => {
			const PhotoSwipeLightbox = module.default;
			const lightbox = new PhotoSwipeLightbox({
				gallery: "#articulo-content",
				children: "#articulo-imagen-link, .galeria-link",
				pswpModule: () =>
					import("https://cdnjs.cloudflare.com/ajax/libs/photoswipe/5.4.2/photoswipe.esm.min.js"),
				padding: {top: 20, bottom: 20, left: 20, right: 20},
				wheelToZoom: true,
			});

			// FILTRO CRÍTICO: Si la imagen no tiene tamaño definido en atributos data-pswp, lo calcula del elemento renderizado
			lightbox.addFilter("itemData", (itemData) => {
				const img = itemData.element.querySelector("img");
				if (img && (!itemData.width || !itemData.height)) {
					itemData.width = img.naturalWidth || 1920;
					itemData.height = img.naturalHeight || 1080;
				}
				return itemData;
			});

			lightbox.init();
		})
		.catch((err) => console.error("Error cargando PhotoSwipe:", err));
}

/**
 * Carga las noticias recomendadas en el sidebar
 */
async function cargarSugeridas(slugActual) {
	try {
		const res = await fetch(`${API_BASE}/noticias?limit=4`);
		if (!res.ok) return;

		const noticias = await res.json();
		const sidebar = document.getElementById("sidebar-recientes");
		if (!sidebar) return;

		sidebar.innerHTML = noticias
			.filter((n) => n.slug !== slugActual)
			.slice(0, 4)
			.map(
				(n, i) => `
                <div class="group cursor-pointer flex gap-4 items-start border-b border-slate-100 pb-4 last:border-0" 
                     onclick="window.location.href='articulo.html?slug=${esc(n.slug)}'">
                    <div class="text-2xl font-black text-slate-200 group-hover:text-pink-accent transition-colors">0${i + 1}</div>
                    <div>
                        <h5 class="font-bold text-sm leading-tight text-slate-800 group-hover:text-purple-main transition-colors line-clamp-2">
                            ${esc(n.titulo)}
                        </h5>
                        <span class="text-[9px] uppercase font-black text-slate-400">
                            ${safeDate(n.fecha_publicacion)}
                        </span>
                    </div>
                </div>
            `,
			)
			.join("");
	} catch (e) {
		console.error("Error cargando sugeridas:", e);
	}
}

/**
 * Carga de banners publicitarios y Swiper
 */
async function cargarPromos() {
	try {
		const resSup = await fetch(`${API_BASE}/publicidad/activa/encabezado`);
		const promosSup = await resSup.json();
		const slidesContainer = document.getElementById("swiper-slides-container");

		if (slidesContainer && promosSup.length > 0) {
			slidesContainer.innerHTML = promosSup
				.map(
					(p) => `
                <div class="swiper-slide">
                    <a href="${esc(p.link_url || '#')}" target="_blank" class="block w-full overflow-hidden rounded-2xl shadow-lg hover:opacity-95 transition">
                        <img src="${esc(p.imagen_url)}" alt="Promoción" class="w-full h-auto object-cover border-b-4 border-purple-main" onerror="this.style.display='none'">
                    </a>
                </div>
            `,
				)
				.join("");

			// Control de seguridad por si Swiper tarda en cargar de forma global
			if (typeof Swiper !== "undefined") {
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
				});
			} else {
				console.warn("Swiper library no está disponible en el alcance global.");
			}
		}

		const resAside = await fetch(`${API_BASE}/publicidad/activa/lateral`);
		const promosAside = await resAside.json();
		const contenedorAside = document.querySelectorAll(".sponsor-slot");

		if (contenedorAside && promosAside && promosAside.length > 0) {
			contenedorAside.forEach((slot) => {
				const p = promosAside[0];
				slot.innerHTML = `
                    <a href="${esc(p.link_url || '#')}" target="_blank" class="block w-full h-full overflow-hidden hover:opacity-95 transition">
                        <img src="${esc(p.imagen_url)}" alt="Patrocinador" class="w-full h-full object-cover" onerror="this.style.display='none'">
                    </a>
                `;
			});
		}
	} catch (error) {
		console.error("Error cargando promos:", error);
	}
}
