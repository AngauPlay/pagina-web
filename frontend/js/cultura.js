const API_URL = "http://localhost:3000/noticias/por-categoria/cultura";

// ===============================
// MENU
// ===============================
const menuBtn = document.getElementById("menu-btn");
const closeMenu = document.getElementById("close-menu");
const mobileMenu = document.getElementById("mobile-menu");
const overlay = document.getElementById("overlay");

menuBtn.onclick = () => {
  mobileMenu.classList.remove("-translate-x-full");
  overlay.classList.remove("hidden");
};

closeMenu.onclick = () => {
  mobileMenu.classList.add("-translate-x-full");
  overlay.classList.add("hidden");
};

// ===============================
// FECHA
// ===============================
const fecha = new Date();
const fechaEl = document.getElementById("current-date");
if (fechaEl) {
  fechaEl.innerText = fecha.toLocaleDateString("es-AR").toUpperCase();
}

// ===============================
// CARGAR NOTICIAS
// ===============================
async function cargarNoticias() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    if (!data || data.length === 0) {
      document.getElementById("noticias-container").innerHTML =
        "<p class='text-center'>No hay noticias de cultura</p>";
      return;
    }

    const destacada = data.find((n) => n.destacada) || data[0];
    const otras = data.filter((n) => n !== destacada);

    renderDestacada(destacada);
    renderNoticias(otras);

  } catch (error) {
    console.error("Error:", error);
    document.getElementById("noticias-container").innerHTML =
      "<p class='text-red-500 font-bold'>Error al cargar noticias</p>";
  }
}

// ===============================
// DESTACADA
// ===============================
function renderDestacada(noticia) {
  const cont = document.getElementById("destacada");
  if (!noticia) return;

  cont.innerHTML = `
    <img src="${noticia.imagen_url}" 
         class="w-full h-[400px] object-cover hover:scale-105 transition duration-500">

    <div class="p-6 bg-white">
      <h2 class="text-3xl font-bold">${noticia.titulo}</h2>
      <p class="mt-2 text-gray-600">${noticia.copete || ""}</p>

      <a href="articulo.html?slug=${noticia.slug}" 
         class="inline-block mt-4 text-pink-accent font-black text-xs tracking-widest hover:translate-x-2 transition-transform">
        LEER MÁS →
      </a>
    </div>
  `;
}

// ===============================
// LISTADO
// ===============================
function renderNoticias(noticias) {
  const cont = document.getElementById("noticias-container");

  cont.innerHTML = noticias
    .map(
      (n) => `
    <div class="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden">

      <img src="${n.imagen_url}" 
           class="w-full h-48 object-cover hover:scale-110 transition duration-500">

      <div class="p-4">
        <h3 class="font-bold text-lg">${n.titulo}</h3>
        <p class="text-sm text-gray-600">${n.copete || ""}</p>

        <a href="articulo.html?slug=${n.slug}" 
           class="inline-block mt-4 text-pink-accent font-black text-xs tracking-widest hover:translate-x-2 transition-transform">
          LEER MÁS →
        </a>
      </div>

    </div>
  `
    )
    .join("");
}

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", cargarNoticias);