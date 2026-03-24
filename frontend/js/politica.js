const API_URL = "http://localhost:3000/api/noticias";

// MENU
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

// FECHA
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

// CARGAR NOTICIAS
async function cargarNoticias() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    console.log("TODAS LAS NOTICIAS:", data);

    // 🔥 FILTRO FLEXIBLE (IMPORTANTE)
    const politica = data.filter(n => {
      if (!n.categoria) return false;

      return n.categoria.toLowerCase().trim() === "politica";
    });

    console.log("NOTICIAS POLITICA:", politica);

    if (politica.length === 0) {
      document.getElementById("noticias-container").innerHTML =
        "<p class='text-red-500 font-bold'>No hay noticias de política</p>";
      return;
    }

    const destacada =
      politica.find(n => n.destacada === true) || politica[0];

    const principales = politica.slice(0, 3);
    const otras = politica.slice(3);

    renderDestacada(destacada);
    renderPrincipales(principales);
    renderNoticias(otras);

  } catch (error) {
    console.error("Error cargando noticias:", error);

    document.getElementById("noticias-container").innerHTML =
      "<p class='text-red-500 font-bold'>Error al cargar noticias</p>";
  }
}

// DESTACADA
function renderDestacada(noticia) {
  if (!noticia) return;

  document.getElementById("destacada").innerHTML = `
    <img src="${noticia.imagen_url}" class="w-full h-[400px] object-cover rounded-xl">
    <div class="p-6 bg-white">
      <h2 class="text-3xl font-bold">${noticia.titulo}</h2>
      <p>${noticia.descripcion || ""}</p>
    </div>
  `;
}

// PRINCIPALES
function renderPrincipales(noticias) {
  const cont = document.getElementById("noticias-principales");

  if (!noticias || noticias.length === 0) return;

  cont.innerHTML = `
    <article class="relative group overflow-hidden rounded-xl">
      <img src="${noticias[0].imagen_url}" class="w-full h-[300px] object-cover">
      <div class="absolute bottom-0 bg-black/60 p-4 text-white w-full">
        <h3 class="font-bold text-xl">${noticias[0].titulo}</h3>
      </div>
    </article>

    <div class="flex flex-col gap-4">
      ${noticias.slice(1).map(n => `
        <div class="flex gap-3 bg-white p-3 rounded shadow">
          <img src="${n.imagen_url}" class="w-24 h-20 object-cover rounded">
          <div>
            <h4 class="font-bold">${n.titulo}</h4>
            <p class="text-sm text-gray-500">${n.descripcion || ""}</p>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

// LISTADO
function renderNoticias(noticias) {
  const cont = document.getElementById("noticias-container");

  cont.innerHTML = noticias.map(n => `
    <div class="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden">
      <img src="${n.imagen_url}" class="w-full h-48 object-cover">
      <div class="p-4">
        <h3 class="font-bold text-lg">${n.titulo}</h3>
        <p class="text-sm text-gray-600">${n.descripcion || ""}</p>
      </div>
    </div>
  `).join("");
}

// INICIAR
cargarNoticias();