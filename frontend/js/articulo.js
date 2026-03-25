document.addEventListener("DOMContentLoaded", async () => {
  // 1. Obtener el slug de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get("slug");

  if (!slug) {
    window.location.href = "index.html";
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/noticias/detalle/${slug}`,
    );

    // Si el servidor responde 404 (noticia no existe) o 500 (error interno)
    if (!response.ok) {
      window.location.href = "error.html"; // <--- CAMBIO AQUÍ
      return;
    }

    const noticia = await response.json();

    // 3. Llenar la interfaz
    document.getElementById("loading-state").classList.add("hidden");
    document.getElementById("articulo-content").classList.remove("hidden");

    document.title = `${noticia.titulo} | ANGAU PLAY`;
    document.getElementById("articulo-titulo").textContent = noticia.titulo;
    document.getElementById("articulo-categoria").textContent =
      noticia.Categoria ? noticia.Categoria.nombre : "General";
    document.getElementById("articulo-imagen").src = noticia.imagen_url;
    document.getElementById("articulo-imagen").alt = noticia.titulo;

    // Formatear Fecha
    const opciones = { day: "numeric", month: "long", year: "numeric" };
    document.getElementById("articulo-fecha").textContent = new Date(
      noticia.createdAt,
    ).toLocaleDateString("es-AR", opciones);

    // Insertar Cuerpo (usando innerHTML para soportar párrafos de la DB)
    document.getElementById("articulo-cuerpo").innerHTML = noticia.cuerpo;

    // Manejar Video si existe
    if (noticia.video_url) {
      const videoId =
        noticia.video_url.split("v=")[1] || noticia.video_url.split("/").pop();
      document.getElementById("articulo-video").src =
        `https://www.youtube.com/embed/${videoId}`;
      document.getElementById("video-container").classList.remove("hidden");
    }

    // 4. Opcional: Cargar noticias sugeridas en el sidebar
    cargarSugeridas();
  } catch (error) {
    console.error("Falla crítica:", error);
    window.location.href = "error.html"; // <--- TAMBIÉN SI SE CAE EL SERVER
  }
});
async function cargarSugeridas() {
  const res = await fetch("http://localhost:3000/api/noticias");
  const noticias = await res.json();
  const sidebar = document.getElementById("sidebar-recientes");

  // Mostramos 3 noticias que no sean la actual
  sidebar.innerHTML = noticias
    .slice(0, 3)
    .map(
      (n, i) => `
        <div class="group cursor-pointer border-b border-slate-100 pb-4 last:border-0">
            <span class="text-2xl font-black text-slate-100 group-hover:text-red-100 transition-colors">0${i + 1}</span>
            <a href="articulo.html?slug=${n.slug}">
                <h5 class="font-bold -mt-3 pl-4 group-hover:text-red-600 transition-colors">${n.titulo}</h5>
            </a>
        </div>
    `,
    )
    .join("");
}
