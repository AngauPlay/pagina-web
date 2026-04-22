/**
 * ANGAU PLAY - Lógica de Detalle de Artículo con Fullscreen
 */

const PhotoSwipeLightbox = window.PhotoSwipeLightbox;

const API_BASE = "http://localhost:3000";

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
			await imgTemp.decode(); // Espera a que la imagen sea decodificable
			linkElement.setAttribute("data-pswp-width", imgTemp.width);
			linkElement.setAttribute("data-pswp-height", imgTemp.height);
		}

		// --- Cuerpo del Artículo ---
		if (noticia.cuerpo) {
			document.getElementById("articulo-cuerpo").innerHTML = noticia.cuerpo
				.split("\n")
				.filter((p) => p.trim())
				.map((p) => `<p class="mb-6">${p}</p>`)
				.join("");
		}

		// --- Galería y PhotoSwipe ---
		if (noticia.galeria?.length > 0) {
			renderizarGaleriaExtra(noticia.galeria);
		}

		// Inicializar siempre al final de la carga de datos
		inicializarPhotoSwipe();

		// --- Cargas secundarias ---
		cargarSugeridas(slug); // Pasar slug para filtrar
		cargarPromos();
	} catch (error) {
		console.error("Falla crítica:", error);
		// Redirigir o mostrar error amigable
		// window.location.href = "error.html";
	}
});

/**
 * Renderiza las fotos adicionales debajo del contenido
 */
function renderizarGaleriaExtra(fotos) {
	// Creamos un contenedor para la galería si no existe
	const cuerpo = document.getElementById("articulo-cuerpo");
	const divGaleria = document.createElement("div");
	divGaleria.className =
		"grid grid-cols-2 md:grid-cols-3 gap-4 mt-12 border-t pt-8";
	divGaleria.id = "galeria-extra";

	// Título de la sección
	const tituloGaleria = document.createElement("h3");
	tituloGaleria.className =
		"col-span-full text-xl font-black italic uppercase mb-4 text-purple-main";
	tituloGaleria.innerText = "Galería de imágenes";
	divGaleria.appendChild(tituloGaleria);

	fotos.forEach((foto) => {
		const item = document.createElement("div");
		item.className = "overflow-hidden rounded-xl bg-slate-200 aspect-video";

		// El enlace debe estar dentro de #galeria-principal o compartir el mismo selector
		// Para simplificar, haremos que PhotoSwipe busque en todo el artículo
		item.innerHTML = `
            <a href="${foto.url}" target="_blank" class="galeria-link">
                <img src="${foto.url}" class="w-full h-full object-cover hover:scale-110 transition duration-500 shadow-lg">
            </a>
        `;
		divGaleria.appendChild(item);

		// Obtener dimensiones de cada foto de la galería
		const imgT = new Image();
		imgT.onload = () => {
			const a = item.querySelector("a");
			a.setAttribute("data-pswp-width", imgT.width);
			a.setAttribute("data-pswp-height", imgT.height);
		};
		imgT.src = foto.url;
	});

	cuerpo.appendChild(divGaleria);
}

/**
 * Inicializa PhotoSwipe para que reconozca la principal y la galería
 */
function inicializarPhotoSwipe() {
	// Importamos dinámicamente el Lightbox desde la CDN
	import("https://cdnjs.cloudflare.com/ajax/libs/photoswipe/5.4.2/photoswipe-lightbox.esm.min.js")
		.then((module) => {
			const PhotoSwipeLightbox = module.default;
			const lightbox = new PhotoSwipeLightbox({
				gallery: "#articulo-content",
				children: "#articulo-imagen-link, .galeria-link",
				// El core también debe ser cargado correctamente
				pswpModule: () =>
					import("https://cdnjs.cloudflare.com/ajax/libs/photoswipe/5.4.2/photoswipe.esm.min.js"),
			});
			lightbox.init();
		})
		.catch((err) => console.error("Error cargando PhotoSwipe:", err));
}

/**
 * Carga las noticias recomendadas en el sidebar
 */
async function cargarSugeridas() {
	try {
		const res = await fetch(`${API_BASE}/noticias`);
		if (!res.ok) return;

		const noticias = await res.json();
		const sidebar = document.getElementById("sidebar-recientes");
		if (!sidebar) return;

		const urlParams = new URLSearchParams(window.location.search);
		const slugActual = urlParams.get("slug");

		sidebar.innerHTML = noticias
			.filter((n) => n.slug !== slugActual)
			.slice(0, 4)
			.map(
				(n, i) => `
                <div class="group cursor-pointer flex gap-4 items-start border-b border-slate-100 pb-4 last:border-0" 
                     onclick="window.location.href='articulo.html?slug=${n.slug}'">
                    <div class="text-2xl font-black text-slate-200 group-hover:text-pink-accent transition-colors">0${i + 1}</div>
                    <div>
                        <h5 class="font-bold text-sm leading-tight text-slate-800 group-hover:text-purple-main transition-colors line-clamp-2">
                            ${n.titulo}
                        </h5>
                        <span class="text-[9px] uppercase font-black text-slate-400">
                            ${new Date(n.fecha_publicacion).toLocaleDateString("es-AR")}
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

		const contenedorInf = document.getElementById("footer-promos-wrapper");
		if (contenedorInf && promosInf.length > 0) {
			const p = promosInf[0];
			contenedorInf.innerHTML = `
                <a href="${p.link_url}" target="_blank" class="block w-full overflow-hidden rounded-2xl shadow-lg hover:opacity-95 transition">
                    <img src="${p.imagen_url}" alt="Promoción" class="w-full h-auto object-cover border-t-4 border-pink-accent">
                </a>
            `;
		}
		const contenedorAside = document.querySelectorAll(".sponsor-slot");
		if (contenedorAside) {
			contenedorAside.forEach((slot) => {
				slot.innerHTML = `
					<a href="https://www.angau.com.ar" target="_blank" class="block w-full h-full overflow-hidden rounded-2xl shadow-lg hover:opacity-95 transition">
						<img src="assets/patrocinador-ejemplo.jpg" alt="Patrocinador" class="w-full h-full object-cover border-4 border-purple-main">
					</a>
				`;
			});
		}
	} catch (error) {
		console.error("Error cargando promos:", error);
	}
}
cargarPromos();
