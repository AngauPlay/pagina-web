const API_URL = "http://localhost:3000/api";
const API_CATEGORIAS = "http://localhost:3000/api/categorias";
const API_LOGOUT = "http://localhost:3000/auth/logout";

// ===============================
// 🔐 PROTEGER ADMIN
// ===============================
async function verificarSesion() {
  try {
    const res = await fetch("http://localhost:3000/auth/me", {
      credentials: "include"
    });

    if (!res.ok) {
      window.location.href = "/admin.html";
    }

  } catch (error) {
    window.location.href = "/admin.html";
  }
}

// ===============================
// 🔥 CARGAR CATEGORIAS
// ===============================
async function cargarCategorias() {
  const select = document.getElementById("categorias");

  try {
    const res = await fetch(API_CATEGORIAS);

    if (!res.ok) throw new Error("Error al obtener categorías");

    const categorias = await res.json();

    select.innerHTML = "<option value=''>Seleccionar categoría</option>";

    categorias.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.nombre;
      select.appendChild(option);
    });

  } catch (error) {
    console.error(error);
    select.innerHTML = "<option>Error al cargar categorías</option>";
  }
}

// ===============================
// 🖼 PREVIEW IMAGEN
// ===============================
document.getElementById("imagen").addEventListener("change", (e) => {
  const file = e.target.files[0];
  const preview = document.getElementById("preview");

  if (file) {
    preview.src = URL.createObjectURL(file);
    preview.classList.remove("hidden");
  }
});

// ===============================
// 🚀 ENVIAR FORMULARIO
// ===============================
document.getElementById("form-noticia")
.addEventListener("submit", async (e) => {

  e.preventDefault();

  const form = e.target;
  const mensaje = document.getElementById("mensaje");

  const formData = new FormData(form);

  try {
    const res = await fetch(`${API_URL}/add`, {
      method: "POST",
      body: formData,
      credentials: "include"
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Error");

    mensaje.textContent = "✅ Noticia creada correctamente";
    mensaje.className = "text-green-600";

    form.reset();
    document.getElementById("preview").classList.add("hidden");

  } catch (error) {
    console.error(error);

    mensaje.textContent = "❌ " + error.message;
    mensaje.className = "text-red-600";
  }
});

// ===============================
// 🚪 LOGOUT
// ===============================
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await fetch(API_LOGOUT, {
    method: "POST",
    credentials: "include"
  });

  window.location.href = "/login.html";
});

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  verificarSesion();
  cargarCategorias();
});