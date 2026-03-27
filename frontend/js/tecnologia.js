const API_URL = "http://localhost:3000/noticias/por-categoria/tecnologia";

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

if (menuBtn) menuBtn.addEventListener("click", toggleMenu);
if (closeMenu) closeMenu.addEventListener("click", toggleMenu);
if (overlay) overlay.addEventListener("click", toggleMenu);

// ===============================
// FECHA
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
// CARGAR NOTICIAS
// ===============================

async function cargarTecnologia() {
  const contenedor = document.getElementById("noticias-container");
  const destacada = document.getElementById("destacada");

  try {
    const respuesta = await fetch(API_URL);
    const noticias = await respuesta.json();

    if (noticias.length === 0) {
      contenedor.innerHTML =
        "<p class='text-center col-span-3'>No hay noticias de tecnología.</p>";
      return;
    }

    // ===============================
    // DESTACADA
    // ===============================

    const principal = noticias[0];

    destacada.innerHTML = `
      <img 
        src="${principal.imagen_url}" 
        class="w-full h-[450px] object-cover"
      />

      <div class="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-black via-black/70 to-transparent text-white">
        <span class="bg-pink-accent px-4 py-1 text-xs font-bold rounded-full uppercase">
          Tecnología
        </span>

        <h2 class="text-3xl md:text-4xl font-black mt-4">
          ${principal.titulo}
        </h2>

        <p class="mt-3 text-gray-200">
          ${principal.copete || ""}
        </p>

        <!-- BOTÓN -->
        <a href="articulo.html?slug=${principal.slug}" 
           class="inline-block mt-4 text-yellow-300 font-bold text-sm">
          LEER MÁS →
        </a>
      </div>
    `;

    // ===============================
    // LISTADO
    // ===============================

    contenedor.innerHTML = "";

    noticias.slice(1).forEach((n) => {
      contenedor.innerHTML += `
        <article class="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden">

          <img src="${n.imagen_url}" class="w-full h-48 object-cover">

          <div class="p-4">
            <h3 class="font-bold text-lg">${n.titulo}</h3>
            <p class="text-sm text-gray-600">${n.copete || ""}</p>

            <!-- BOTÓN CLAVE -->
            <a href="articulo.html?slug=${n.slug}" 
               class="inline-block mt-4 text-pink-accent font-black text-xs tracking-widest hover:translate-x-2 transition-transform">
              LEER MÁS →
            </a>
          </div>

        </article>
      `;
    });

  } catch (error) {
    console.error("Error cargando noticias:", error);

    contenedor.innerHTML =
      "<p class='text-red-500 text-center col-span-3'>Error al cargar noticias</p>";
  }
}

// ===============================
// INIT
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  cargarTecnologia();
});