const API_URL = "http://localhost:3000/api/noticias";
const API_CATEGORIAS = "http://localhost:3000/api/noticias/categorias";

// ===============================
// 🔥 CARGAR CATEGORIAS
// ===============================
async function cargarCategorias() {
  const select = document.getElementById("categorias");

  try {
    const res = await fetch(API_CATEGORIAS);

    if (!res.ok) throw new Error("Error al obtener categorías");

    const categorias = await res.json();

    console.log("CATEGORIAS:", categorias);

    if (!categorias || categorias.length === 0) {
      select.innerHTML = "<option>No hay categorías</option>";
      return;
    }

    select.innerHTML = "<option value=''>Seleccionar categoría</option>";

    categorias.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.nombre;
      select.appendChild(option);
    });

  } catch (error) {
    console.error("Error cargando categorías:", error);
    select.innerHTML = "<option>Error al cargar categorías</option>";
  }
}

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

    if (!res.ok) throw new Error(data.error);

    mensaje.textContent = "✅ Noticia creada correctamente";
    mensaje.className = "text-green-600";

    form.reset();

  } catch (error) {
    console.error(error);

    mensaje.textContent = "❌ Error al crear noticia";
    mensaje.className = "text-red-600";
  }
});

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", cargarCategorias);