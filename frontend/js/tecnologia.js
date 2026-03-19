// ===============================
// MENU HAMBURGUESA
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
// FECHA ACTUAL
// ===============================

function updateDate() {
  const dateElement = document.getElementById("current-date");

  if (!dateElement) return;

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  let dateString = new Date().toLocaleDateString("es-ES", options);
  dateElement.textContent = dateString.toUpperCase();
}

updateDate();


// ===============================
// CARGAR NOTICIAS TECNOLOGIA
// ===============================

async function cargarTecnologia() {

  const contenedor = document.getElementById("noticias-container");
  const destacada = document.getElementById("destacada");

  try {

    const respuesta = await fetch("/api/noticias?categoria=tecnologia");
    const noticias = await respuesta.json();

    if (!noticias || noticias.length === 0) {
      contenedor.innerHTML =
        "<p class='text-center col-span-3'>No hay noticias de tecnología todavía.</p>";
      return;
    }

    // ===============================
    // NOTICIA PRINCIPAL
    // ===============================

    const principal = noticias[0];

    destacada.innerHTML = `
      <img 
        src="${principal.imagen_url}" 
        class="w-full h-[450px] object-cover opacity-70 hover:scale-105 transition duration-700"
      />

      <div class="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-black via-black/70 to-transparent text-white">
        <span class="bg-pink-accent text-white text-xs font-black px-4 py-1 rounded-full uppercase">
          Tecnología
        </span>

        <h2 class="text-3xl md:text-4xl font-black mt-4">
          ${principal.titulo}
        </h2>

        <p class="mt-3 text-gray-200 max-w-2xl">
          ${principal.copete || ""}
        </p>

        <a href="/noticia/${principal.slug}" 
           class="inline-block mt-4 text-yellow-300 font-bold">
           Leer noticia →
        </a>
      </div>
    `;

    // ===============================
    // LISTADO DE NOTICIAS
    // ===============================

    contenedor.innerHTML = "";

    noticias.slice(1).forEach((noticia) => {
      contenedor.innerHTML += `
        <article class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-slate-100 group">

          <div class="relative overflow-hidden">
            <img 
              src="${noticia.imagen_url}" 
              alt="${noticia.titulo}"
              class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          <div class="p-6">
            <h3 class="text-xl font-black leading-tight text-slate-800 group-hover:text-pink-accent transition-colors">
              ${noticia.titulo}
            </h3>

            <p class="text-slate-500 mt-3 text-sm">
              ${noticia.copete || ""}
            </p>

            <a href="/noticia/${noticia.slug}" 
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
      "<p class='text-red-500 text-center col-span-3'>Error al conectar con el servidor.</p>";
  }
}


// ===============================
// INICIAR
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  cargarTecnologia();
});