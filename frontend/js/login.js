const API_LOGIN = "http://localhost:3000/auth/login";

const form = document.getElementById("loginForm");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = Object.fromEntries(new FormData(form));

  // Validaciones
  if (!data.nombre) {
    mensaje.textContent = " Nombre de usuario inválido";
    mensaje.className = "text-red-600";
    return;
  }

  if (data.password.length < 6) {
    mensaje.textContent = " La contraseña debe tener al menos 6 caracteres";
    mensaje.className = "text-red-600";
    return;
  }

  try {
    const res = await fetch(API_LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const result = await res.json();

    if (!res.ok) throw new Error(result.mensaje || "Error al iniciar sesión");

    mensaje.textContent = " Bienvenido!";
    mensaje.className = "text-green-600";

    // Redirección según rol
    setTimeout(() => {
      if (result.usuario.rol === "admin" || result.usuario.rol === "editor") {
        console.log(result.usuario.rol, "rol del usuario");
        window.location.href = "admin.html";
      } else {
        window.location.href = "index.html";
      }
    }, 1000);
  } catch (err) {
    mensaje.textContent = " " + err.message;
    mensaje.className = "text-red-600";
  }
});
