const API = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const categoria = params.get("categoria");

  if (!categoria) {
    window.location.href = "index.html";
    return;
  }

  // Título dinámico
  document.getElementById("titulo-categoria").textContent =
    categoria.toUpperCase();

  try {
    const res = await fetch(`${API}/noticias`);
    const noticias = await res.json();

    // Filtrar por categoría
    const filtradas = noticias.filter(
      (n) =>
        n.Categorium?.nombre.toLowerCase() === categoria.toLowerCase()
    );

    if (filtradas.length === 0) {
      document.getElementById("destacada").innerHTML =
        "<p>No hay noticias en esta categoría.</p>";
      return;
    }

    // =========================
    // 🔥 NOTICIA DESTACADA
    // =========================
    const principal = filtradas[0];

    document.getElementById("destacada").innerHTML = `
      <article class="relative rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
        onclick="window.location.href='articulo.html?slug=${principal.slug}'">

        <img src="${principal.imagen_url}" 
             class="w-full h-[400px] object-cover opacity-70"/>

        <div class="absolute bottom-0 p-6 bg-gradient-to-t from-black/80 w-full text-white">
          <h3 class="text-3xl font-black">${principal.titulo}</h3>
          <p class="text-sm mt-2">${principal.copete}</p>
        </div>
      </article>
    `;

    // =========================
    // 📰 RESTO DE NOTICIAS
    // =========================
    const resto = filtradas.slice(1);

    document.getElementById("noticias-container").innerHTML = resto
      .map(
        (n) => `
        <article class="bg-white rounded-xl overflow-hidden shadow hover:shadow-xl cursor-pointer"
          onclick="window.location.href='articulo.html?slug=${n.slug}'">

          <img src="${n.imagen_url}" class="h-48 w-full object-cover"/>

          <div class="p-4">
            <h4 class="font-bold text-slate-800">${n.titulo}</h4>
            <p class="text-sm text-gray-500">${n.copete}</p>

            <span class="text-xs text-pink-accent font-bold mt-2 inline-block">
              LEER MÁS →
            </span>
          </div>
        </article>
      `
      )
      .join("");

  } catch (error) {
    console.error("Error cargando categoría:", error);
  }
});