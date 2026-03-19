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
const fecha = new Date();
document.getElementById("current-date").innerText =
  fecha.toLocaleDateString("es-AR");

// CARGAR NOTICIAS
async function cargarNoticias() {
  const res = await fetch(API_URL);
  const data = await res.json();

  const cultura = data.filter(n => n.categoria === "cultura");

  const destacada = cultura.find(n => n.destacada);
  const otras = cultura.filter(n => !n.destacada);

  renderDestacada(destacada);
  renderNoticias(otras);
}

// DESTACADA
function renderDestacada(noticia) {
  const cont = document.getElementById("destacada");

  if (!noticia) return;

  cont.innerHTML = `
    <img src="${noticia.imagen}" class="w-full h-[400px] object-cover hover:scale-105 transition duration-500">
    <div class="p-6 bg-white">
      <h2 class="text-3xl font-bold">${noticia.titulo}</h2>
      <p class="mt-2 text-gray-600">${noticia.descripcion}</p>
    </div>
  `;
}

// LISTADO
function renderNoticias(noticias) {
  const cont = document.getElementById("noticias-container");

  cont.innerHTML = noticias.map(n => `
    <div class="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden">
      <img src="${n.imagen}" class="w-full h-48 object-cover hover:scale-110 transition duration-500">
      <div class="p-4">
        <h3 class="font-bold text-lg">${n.titulo}</h3>
        <p class="text-sm text-gray-600">${n.descripcion}</p>
      </div>
    </div>
  `).join("");
}

cargarNoticias();