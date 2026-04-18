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
		// 1. Obtener datos de la API
		const response = await fetch(`${API_BASE}/noticias/detalle/${slug}`);

		if (!response.ok) {
			window.location.href = "error.html";
			return;
		}

		const noticia = await response.json();

		// 2. Gestionar estados de carga y visibilidad
		document.getElementById("loading-state").classList.add("hidden");
		document.getElementById("articulo-content").classList.remove("hidden");

		// 3. Títulos y Metadatos
		document.title = `${noticia.titulo} | ANGAU PLAY`;
		document.getElementById("articulo-titulo").textContent = noticia.titulo;

		// Categoría dinámica
		const catNombre =
			noticia.Categorium?.nombre || noticia.categoria?.nombre || "General";
		document.getElementById("articulo-categoria").textContent = catNombre;

		// 4. Lógica de Imagen Principal y Pantalla Completa (PhotoSwipe)
		const galeriaPrincipal = document.getElementById("galeria-principal");
		const imgUrl = noticia.imagen_url || "assets/default-img.jpg";
		const imgElement = document.getElementById("articulo-imagen");
		const linkElement = document.getElementById("articulo-imagen-link");

		// Configurar imagen principal
		if (imgElement && linkElement) {
			imgElement.src = imgUrl;
			linkElement.href = imgUrl;

			const imgTemp = new Image();
			imgTemp.onload = function () {
				linkElement.setAttribute("data-pswp-width", this.width);
				linkElement.setAttribute("data-pswp-height", this.height);

				// Si hay galería extra, la cargamos antes de inicializar PhotoSwipe
				if (noticia.galeria && noticia.galeria.length > 0) {
					renderizarGaleriaExtra(noticia.galeria);
				}

				inicializarPhotoSwipe();
			};
			imgTemp.src = imgUrl;
		}
		// 5. Formatear Fecha
		const opciones = {day: "numeric", month: "long", year: "numeric"};
		const fechaObj = new Date(noticia.fecha_publicacion);
		document.getElementById("articulo-fecha").textContent = !isNaN(fechaObj)
			? fechaObj.toLocaleDateString("es-AR", opciones)
			: "Fecha no disponible";

		// 6. Formatear Cuerpo (Saltos de línea a párrafos HTML)
		if (noticia.cuerpo) {
			const cuerpoProcesado = noticia.cuerpo
				.split("\n")
				.filter((parrafo) => parrafo.trim() !== "")
				.map((parrafo) => `<p class="mb-6">${parrafo}</p>`)
				.join("");
			document.getElementById("articulo-cuerpo").innerHTML = cuerpoProcesado;
		}

		// 7. Autor e Iniciales
		const autorNombre = noticia.autor || "Redacción Angau";
		document.getElementById("articulo-autor").textContent = autorNombre;

		const iniciales = autorNombre
			.split(" ")
			.filter((n) => n.length > 0)
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.substring(0, 2);
		document.getElementById("autor-iniciales").textContent = iniciales || "AP";

		// 8. Integración de Video YouTube
		if (noticia.video_url) {
			let videoId = "";
			if (noticia.video_url.includes("v=")) {
				videoId = noticia.video_url.split("v=")[1]?.split("&")[0];
			} else {
				videoId = noticia.video_url.split("/").pop();
			}

			if (videoId) {
				document.getElementById("articulo-video").src =
					`https://www.youtube.com/embed/${videoId}`;
				document.getElementById("video-container").classList.remove("hidden");
			}
		}

		// 9. Cargar noticias laterales
		cargarSugeridas();
	} catch (error) {
		console.error("Falla crítica en la carga del artículo:", error);
		// Opcional: mostrar un mensaje de error amigable en la UI
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
	const lightbox = new PhotoSwipeLightbox({
		// Seleccionamos ambos: el link principal y los de la galería extra
		gallery: "#articulo-content",
		children: "#articulo-imagen-link, .galeria-link",
		pswpModule: () =>
			import("https://cdnjs.cloudflare.com/ajax/libs/photoswipe/5.4.2/photoswipe.esm.min.js"),
	});
	lightbox.init();
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
