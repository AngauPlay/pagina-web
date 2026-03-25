const API_URL = "http://localhost:3000/api"; // 🔥 IMPORTANTE

// ===============================
// MENU MOBILE
// ===============================
const menuBtn = document.getElementById("menu-btn");
const closeMenu = document.getElementById("close-menu");
const mobileMenu = document.getElementById("mobile-menu");
const overlay = document.getElementById("overlay");

if (menuBtn) {
  menuBtn.onclick = () => {
    mobileMenu.classList.remove("-translate-x-full");
    overlay.classList.remove("hidden");
  };
}

if (closeMenu) {
  closeMenu.onclick = () => {
    mobileMenu.classList.add("-translate-x-full");
    overlay.classList.add("hidden");
  };
}

// ===============================
// FECHA ACTUAL
// ===============================
function updateDate() {
  const el = document.getElementById("current-date");
  if (!el) return;

  el.textContent = new Date()
    .toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    .toUpperCase();
}

updateDate();

// ===============================
// CONFIG
// ===============================
const ID_ACTUALIDAD = 4; // 🔥 Según tu SQL

// ===============================
// CARGAR NOTICIAS
// ===============================
async function cargarNoticias() {
  try {
    const res = await fetch(`${API_URL}/`);

    // 🔥 VALIDACIÓN CLAVE (evita error JSON)
    if (!res.ok) {
      throw new Error("La API no respondió correctamente");
    }

    const data = await res.json();

    console.log("TODAS LAS NOTICIAS:", data);

    // 🔥 FILTRAR ACTUALIDAD
    const actualidad = data.filter(
      (n) =>
        n.categoria_id == ID_ACTUALIDAD &&
        n.estado === "publicado"
    );

    console.log("ACTUALIDAD:", actualidad);

    const contenedor = document.getElementById("noticias-container");

    if (!actualidad.length) {
      contenedor.innerHTML =
        "<p class='text-red-500 font-bold'>No hay noticias de actualidad</p>";
      return;
    }

    // DESTACADA = PRIMERA
    const destacada = actualidad[0];

    // RESTO
    const otras = actualidad.slice(1);

    renderDestacada(destacada);
    renderNoticias(otras);

  } catch (error) {
    console.error("Error cargando noticias:", error);

    document.getElementById("noticias-container").innerHTML =
      "<p class='text-red-500 font-bold'>Error al cargar noticias</p>";
  }
}

// ===============================
// DESTACADA
// ===============================
function renderDestacada(noticia) {
  const cont = document.getElementById("destacada");

  if (!noticia || !cont) return;

  cont.innerHTML = `
    <div class="overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition duration-300">

      <img src="${noticia.imagen_url}" 
        class="w-full h-[400px] object-cover hover:scale-105 transition duration-500">

      <div class="p-6 bg-white">
        <h2 class="text-3xl font-bold text-gray-800">
          ${noticia.titulo}
        </h2>

        <p class="mt-2 text-gray-600">
          ${noticia.copete || ""}
        </p>
      </div>

    </div>
  `;
}

// ===============================
// LISTADO
// ===============================
function renderNoticias(noticias) {
  const cont = document.getElementById("noticias-container");

  if (!cont) return;

  cont.innerHTML = noticias
    .map(
      (n) => `
    <div class="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden">

      <img src="${n.imagen_url}" 
        class="w-full h-48 object-cover hover:scale-110 transition duration-500">

      <div class="p-4">
        <h3 class="font-bold text-lg text-gray-800">
          ${n.titulo}
        </h3>

        <p class="text-sm text-gray-600">
          ${n.copete || ""}
        </p>
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