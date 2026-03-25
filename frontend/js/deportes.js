const API_URL = "http://localhost:3000/noticias/por-categoria/deportes";

// ===============================
// MENU
// ===============================
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

// ===============================
// FECHA
// ===============================
function updateDate() {
  const el = document.getElementById("current-date");
  if (!el) return;

  const date = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  el.textContent = date.toUpperCase();
}
updateDate();

// ===============================
// CARGAR NOTICIAS DEPORTES
// ===============================
async function cargarDeportes() {
  const contenedor = document.getElementById("noticias-container");
  const destacada = document.getElementById("destacada");

  if (!contenedor || !destacada) return;

  try {
    const res = await fetch(`${API_URL}/por-categoria/deportes`);
    const data = await res.json();

    if (!data || data.length === 0) {
      contenedor.innerHTML = "<p>No hay noticias deportivas</p>";
      return;
    }

    // ===============================
    // DESTACADA
    // ===============================
    const principal = data[0];

    destacada.innerHTML = `
      <img src="${principal.imagen_url}" 
           class="w-full h-[420px] object-cover opacity-70">

      <div class="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black text-white">
        <span class="bg-green-500 text-xs px-3 py-1 rounded font-bold">
          Deportes
        </span>

        <h2 class="text-3xl font-black mt-3">
          ${principal.titulo}
        </h2>

        <p class="mt-2 text-gray-200">
          ${principal.copete || ""}
        </p>

        <a href="/noticia/${principal.slug}" 
           class="inline-block mt-4 text-yellow-400 font-bold text-sm">
          LEER NOTICIA →
        </a>
      </div>
    `;

    // ===============================
    // LISTADO
    // ===============================
    contenedor.innerHTML = "";

    data.slice(1).forEach((n) => {
      contenedor.innerHTML += `
        <article class="bg-white rounded-xl overflow-hidden shadow group">

          <div class="overflow-hidden">
            <img src="${n.imagen_url}" 
                 class="w-full h-48 object-cover group-hover:scale-110 transition duration-500">
          </div>

          <div class="p-4">
            <h3 class="font-bold text-lg">${n.titulo}</h3>

            <p class="text-sm text-gray-500 mt-2">
              ${n.copete || ""}
            </p>

            <a href="/noticia/${n.slug}" 
               class="inline-block mt-3 text-pink-accent font-bold text-xs hover:underline">
              LEER MÁS →
            </a>
          </div>

        </article>
      `;
    });

  } catch (err) {
    console.error("Error:", err);
    contenedor.innerHTML = "<p>Error al cargar noticias</p>";
  }
}

document.addEventListener("DOMContentLoaded", cargarDeportes);
