const API_BASE = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get("slug");

  if (!slug) {
    window.location.href = "index.html";
    return;
  }

  try {
    // Ajustamos la ruta a tu backend: /noticias/detalle/ o /noticias/
    const response = await fetch(`${API_BASE}/noticias/detalle/${slug}`);

    if (!response.ok) {
      window.location.href = "error.html";
      return;
    }

    const noticia = await response.json();

    // 1. Mostrar contenedor principal
    document.getElementById("loading-state").classList.add("hidden");
    document.getElementById("articulo-content").classList.remove("hidden");

    // 2. Títulos y Meta
    document.title = `${noticia.titulo} | ANGAU PLAY`;
    document.getElementById("articulo-titulo").textContent = noticia.titulo;

    // Manejo flexible de Categoria/categoria
    const catNombre = noticia.Categorium.nombre
      ? noticia.Categorium.nombre
      : noticia.categoria
        ? noticia.categoria.nombre
        : "General";
    document.getElementById("articulo-categoria").textContent = catNombre;

    // 3. Imagen con fallback
    const imgElement = document.getElementById("articulo-imagen");
    imgElement.src = noticia.imagen_url || "assets/default-img.jpg";
    imgElement.alt = noticia.titulo;

    // 4. Formatear Fecha
    const opciones = { day: "numeric", month: "long", year: "numeric" };
    document.getElementById("articulo-fecha").textContent = new Date(
      noticia.fecha_publicacion,
    ).toLocaleDateString("es-AR", opciones);

    // 5. Formatear Cuerpo (Convertir saltos de línea en párrafos <p>)
    const cuerpoProcesado = noticia.cuerpo
      .split("\n")
      .filter((parrafo) => parrafo.trim() !== "")
      .map((parrafo) => `<p class="mb-6">${parrafo}</p>`)
      .join("");
    document.getElementById("articulo-cuerpo").innerHTML = cuerpoProcesado;

    // 6. Autor e Iniciales
    const autorNombre = noticia.autor || "Redacción Angau";
    document.getElementById("articulo-autor").textContent = autorNombre;
    const iniciales = autorNombre
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
    document.getElementById("autor-iniciales").textContent = iniciales;

    // 7. Video YouTube
    if (noticia.video_url) {
      const videoId =
        noticia.video_url.split("v=")[1]?.split("&")[0] ||
        noticia.video_url.split("/").pop();
      document.getElementById("articulo-video").src =
        `https://www.youtube.com/embed/${videoId}`;
      document.getElementById("video-container").classList.remove("hidden");
    }

    cargarSugeridas();
  } catch (error) {
    console.error("Falla crítica:", error);
    // window.location.href = "error.html";
  }
});

async function cargarSugeridas() {
  try {
    // Nota: Asegúrate que esta ruta sea la que devuelve el array de noticias
    const res = await fetch(`${API_BASE}/noticias`);
    const noticias = await res.json();
    const sidebar = document.getElementById("sidebar-recientes");

    // Filtramos para no mostrar la misma noticia que estamos leyendo
    const urlParams = new URLSearchParams(window.location.search);
    const slugActual = urlParams.get("slug");

    sidebar.innerHTML = noticias
      .filter((n) => n.slug !== slugActual)
      .slice(0, 4) // Mostramos 4 sugeridas
      .map(
        (n, i) => `
                <div class="group cursor-pointer flex gap-4 items-start border-b border-slate-100 pb-4 last:border-0" onclick="window.location.href='articulo.html?slug=${n.slug}'">
                    <div class="text-2xl font-black text-slate-200 group-hover:text-pink-accent transition-colors">0${i + 1}</div>
                    <div>
                        <h5 class="font-bold text-sm leading-tight text-slate-800 group-hover:text-purple-main transition-colors line-clamp-2">
                            ${n.titulo}
                        </h5>
                        <span class="text-[9px] uppercase font-black text-slate-400">${new Date(n.fecha_publicacion).toLocaleDateString()}</span>
                    </div>
                </div>
            `,
      )
      .join("");
  } catch (e) {
    console.error("Error en sugeridas:", e);
  }
}
