const API_BASE = "http://localhost:3000";
const API_URL = `${API_BASE}/noticias`;
const API_LOGOUT = `${API_BASE}/auth/logout`;
const API_CATEGORIAS = `${API_BASE}/noticias/categorias`;

const dias = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

// ===============================
// 🔐 PROTEGER ADMIN
// ===============================
async function verificarSesion() {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, { credentials: "include" });
    if (!res.ok) window.location.href = "/login.html";
  } catch (error) {
    window.location.href = "/login.html";
  }
}

// ===============================
// 📑 NAVEGACIÓN
// ===============================
function showSection(section) {
  document
    .querySelectorAll(".content-section")
    .forEach((s) => s.classList.add("hidden"));
  const target = document.getElementById(`sec-${section}`);
  if (target) target.classList.remove("hidden");

  if (section === "noticias") cargarNoticias();
  if (section === "programacion") cargarProgramacion();
}

// ===============================
// 📰 GESTIÓN DE NOTICIAS
// ===============================
async function cargarNoticias() {
  try {
    const res = await fetch(API_URL);
    const noticias = await res.json();
    const lista = document.getElementById("tabla-noticias");

    lista.innerHTML = noticias
      .map(
        (n) => `
            <tr class="border-b hover:bg-gray-50">
                <td class="p-4 font-medium">${n.titulo}</td>
                <td class="p-4">${n.autor}</td>
                <td class="p-4">${new Date(n.createdAt || n.fecha_publicacion).toLocaleDateString()}</td>
                <td class="p-4"><span class="bg-gray-100 px-2 py-1 rounded text-xs">${n.categoria ? n.categoria.nombre : "General"}</span></td>
                <td class="p-4 text-center">
                    <button onclick="eliminarNoticia(${n.id})" class="text-red-500 font-bold hover:underline">Eliminar</button>
                </td>
            </tr>
        `,
      )
      .join("");
  } catch (error) {
    console.error("Error al cargar noticias", error);
  }
}

async function eliminarNoticia(id) {
  if (!confirm("¿Seguro que deseas eliminar esta noticia?")) return;
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (res.ok) cargarNoticias();
}

// ===============================
// 📺 GESTIÓN DE PROGRAMACIÓN
// ===============================
async function cargarProgramacion() {
  try {
    const res = await fetch(`${API_BASE}/programas`);
    const programas = await res.json();
    const lista = document.getElementById("tabla-programacion");
    lista.innerHTML = programas
      .map(
        (p) => `
            <tr class="border-b hover:bg-gray-50">
                <td class="p-4 font-bold">${dias[p.dia_semana]}</td>
                <td class="p-4">${p.hora}</td>
                <td class="p-4">
                    <div class="font-bold text-purple-700">${p.nombre}</div>
                    <div class="text-xs text-gray-500 italic">${p.staff || "Sin staff"}</div>
                </td>
                <td class="p-4 text-center">
                    <button onclick="eliminarPrograma(${p.id})" class="text-red-500 font-bold hover:underline">Eliminar</button>
                </td>
            </tr>
        `,
      )
      .join("");
  } catch (error) {
    console.error("Error al cargar programas", error);
  }
}

async function eliminarPrograma(id) {
  if (!confirm("¿Eliminar este programa de la grilla?")) return;
  const res = await fetch(`${API_BASE}/programas/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (res.ok) cargarProgramacion();
}

// ===============================
// 📦 MODALES Y FORMULARIOS
// ===============================
async function openModal(tipo) {
  const modal = document.getElementById("modal");
  const content = document.getElementById("modal-content");
  modal.classList.remove("hidden");

  if (tipo === "noticia") {
    const catRes = await fetch(API_CATEGORIAS);
    const categorias = await catRes.json();

    content.innerHTML = `
        <h3 class="text-2xl font-black mb-4 text-pink-600">Nueva Noticia</h3>
        <form id="form-noticia" class="space-y-4" enctype="multipart/form-data">
            <input name="titulo" id="tit-noticia" placeholder="Título de la noticia" class="w-full border p-2 rounded" required>
            
            <textarea name="copete" placeholder="Copete (Resumen corto para la home)" class="w-full border p-2 rounded h-20" required></textarea>
            
            <div class="grid grid-cols-2 gap-4">
                <select name="categoria_id" class="w-full border p-2 rounded" required>
                    <option value="">Seleccionar Categoría</option>
                    ${categorias.map((c) => `<option value="${c.id}">${c.nombre}</option>`).join("")}
                </select>

                <select name="estado" class="w-full border p-2 rounded">
                    <option value="publicado">Publicado</option>
                    <option value="borrador">Borrador</option>
                </select>
            </div>

            <textarea name="cuerpo" placeholder="Contenido completo de la noticia..." class="w-full border p-2 rounded h-40" required></textarea>
            
            <div class="grid grid-cols-2 gap-4">
                <input name="autor" placeholder="Nombre del Autor" class="w-full border p-2 rounded" required>
                <input type="file" name="imagen" class="w-full border p-2 rounded" accept="image/*">
            </div>

            <input type="hidden" name="slug" id="slug-noticia">

            <button type="submit" class="w-full bg-pink-600 text-white py-3 rounded-xl font-bold hover:bg-pink-700 transition">
                PUBLICAR NOTICIA 
            </button>
        </form>`;

    // Lógica para auto-generar el slug mientras escribes el título
    const inputTitulo = document.getElementById("tit-noticia");
    const inputSlug = document.getElementById("slug-noticia");

    inputTitulo.addEventListener("input", () => {
      const slug = inputTitulo.value
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      inputSlug.value = slug;
    });

    setupFormNoticia();
  } else {
    content.innerHTML = `
            <h3 class="text-2xl font-black mb-4 text-purple-600">Nuevo Programa</h3>
            <form id="form-programa" class="space-y-4">
                <input name="nombre" placeholder="Nombre del Programa" class="w-full border p-2 rounded" required>
                <input name="staff" placeholder="Conductores (opcional)" class="w-full border p-2 rounded">
                <div class="grid grid-cols-2 gap-4">
                    <input type="time" name="hora" class="w-full border p-2 rounded" required>
                    <select name="dia_semana" class="w-full border p-2 rounded">
                        ${dias.map((d, i) => `<option value="${i}">${d}</option>`).join("")}
                    </select>
                </div>
                <button class="w-full bg-purple-600 text-white py-2 rounded font-bold">GUARDAR EN GRILLA 📺</button>
            </form>`;
    setupFormPrograma();
  }
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

function setupFormNoticia() {
  document.getElementById("form-noticia").onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const res = await fetch(`${API_BASE}/noticias/add`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    if (res.ok) {
      closeModal();
      cargarNoticias();
    }
  };
}

function setupFormPrograma() {
  document.getElementById("form-programa").onsubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));

    // Formateo previo al envío
    data.dia_semana = parseInt(data.dia_semana);
    if (data.hora.length === 5) data.hora += ":00";

    const res = await fetch(`${API_BASE}/programas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    if (res.ok) {
      closeModal();
      cargarProgramacion();
    }
  };
}

// ===============================
// 🚪 LOGOUT
// ===============================
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await fetch(API_LOGOUT, { method: "POST", credentials: "include" });
  window.location.href = "/login.html";
});

// --- INIT ---
document.addEventListener("DOMContentLoaded", async () => {
  await verificarSesion();
  showSection("noticias");
});
