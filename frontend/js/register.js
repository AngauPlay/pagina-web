const API_REGISTER = "http://localhost:3000/api/auth/register";

const form = document.getElementById("registerForm");
const mensaje = document.getElementById("mensaje");

// Validaciones
function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function passwordFuerte(password) {
  return password.length >= 6;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(form));

  // Validaciones
  if (!emailValido(data.email)) {
    mensaje.textContent = "❌ Email inválido";
    mensaje.className = "text-red-600";
    return;
  }

  if (!passwordFuerte(data.password)) {
    mensaje.textContent = "❌ Contraseña mínima 6 caracteres";
    mensaje.className = "text-red-600";
    return;
  }

  try {
    const res = await fetch(API_REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (!res.ok) throw new Error(result.error || "Error al registrar");

    mensaje.textContent = "✅ Usuario creado correctamente";
    mensaje.className = "text-green-600";

    form.reset();

    // Redirigir a login
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);

  } catch (err) {
    mensaje.textContent = "❌ " + err.message;
    mensaje.className = "text-red-600";
  }
});