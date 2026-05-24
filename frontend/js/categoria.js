const API = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", async () => {
	const params = new URLSearchParams(window.location.search);
	const categoria = params.get("categoria");

	if (!categoria) {
		window.location.href = "index.html";
		return;
	}

	document.getElementById("titulo-categoria").textContent = categoria.toUpperCase();

	try {
		const res = await fetch(`${API}/noticias`);
		const noticias = await res.json();

		const filtradas = noticias.filter(
			(n) => n.Categorium?.nombre?.toLowerCase() === categoria.toLowerCase(),
		);

		if (filtradas.length === 0) {
			document.getElementById("destacada").innerHTML = "<p>No hay noticias en esta categoría.</p>";
			return;
		}

		const principal = filtradas[0];

		document.getElementById("destacada").innerHTML = `
      <article class="relative rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
        onclick="window.location.href='articulo.html?slug=${esc(principal.slug)}'">
        <img src="${esc(principal.imagen_url)}" 
             class="w-full h-[400px] object-cover opacity-70" onerror="this.src='https://placehold.co/1200x600/1e293b/ffffff?text=ANG'"/>
        <div class="absolute bottom-0 p-6 bg-gradient-to-t from-black/80 w-full text-white">
          <h3 class="text-3xl font-black">${esc(principal.titulo)}</h3>
          <p class="text-sm mt-2">${esc(safeStr(principal.copete))}</p>
        </div>
      </article>
    `;

		const resto = filtradas.slice(1);

		document.getElementById("noticias-container").innerHTML = resto
			.map(
				(n) => `
        <article class="bg-white rounded-xl overflow-hidden shadow hover:shadow-xl cursor-pointer"
          onclick="window.location.href='articulo.html?slug=${esc(n.slug)}'">
          <img src="${esc(n.imagen_url)}" class="h-48 w-full object-cover" onerror="this.src='https://placehold.co/400x300/1e293b/ffffff?text=ANG'"/>
          <div class="p-4">
            <h4 class="font-bold text-slate-800">${esc(n.titulo)}</h4>
            <p class="text-sm text-gray-500">${esc(safeStr(n.copete))}</p>
            <span class="text-xs text-pink-accent font-bold mt-2 inline-block">LEER MÁS →</span>
          </div>
        </article>
      `,
			)
			.join("");
	} catch (error) {
		console.error("Error cargando categoría:", error);
		const d = document.getElementById("destacada");
		if (d) d.innerHTML = `<div class="text-center py-10"><p class="text-red-500 font-medium">Error al cargar las noticias.</p><button onclick="location.reload()" class="text-pink-accent underline mt-2">Reintentar</button></div>`;
	}
});

async function cargarPromos() {
	try {
		const resSup = await fetch("http://localhost:3000/publicidad/activa/encabezado");
		const promosSup = await resSup.json();
		const slidesContainer = document.getElementById("swiper-slides-container");

		if (slidesContainer && promosSup && promosSup.length > 0) {
			slidesContainer.innerHTML = promosSup.map((p) => `
                <div class="swiper-slide">
                    <a href="${esc(p.link_url || '#')}" target="_blank" class="block w-full overflow-hidden rounded-2xl shadow-lg hover:opacity-95 transition">
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
cargarPromos();