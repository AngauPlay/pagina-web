const API_BASE = "http://localhost:3000";
const API_URL = `${API_BASE}/noticias`;
const API_USUARIOS = `${API_BASE}/auth/usuarios`;
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
//  PROTEGER ADMIN
// ===============================
async function verificarSesion() {
	try {
		const res = await fetch(`${API_BASE}/auth/me`, {
			credentials: "include",
		});

		if (!res.ok) {
			window.location.href = "/login.html";
		}
	} catch (error) {
		window.location.href = "/login.html";
	}
}

// ===============================
//  NAVEGACIÓN
// ===============================
function showSection(section) {
	document
		.querySelectorAll(".content-section")
		.forEach((s) => s.classList.add("hidden"));

	const target = document.getElementById(`sec-${section}`);
	if (target) target.classList.remove("hidden");

	if (section === "noticias") cargarNoticias();
	if (section === "programacion") cargarProgramacion();
	if (section === "usuarios") cargarUsuarios();
	if (section === "publicidad") cargarPublicidad();
}

// ===============================
//  IR A REGISTRO
// ===============================
function irARegistro() {
	window.location.href = "/register.html";
}

// ===============================
//  GESTIÓN DE NOTICIAS
// ===============================
async function cargarNoticias() {
	try {
		const res = await fetch(API_URL);
		const noticias = await res.json();
		const lista = document.getElementById("tabla-noticias");

		if (!lista) return;

		lista.innerHTML = noticias
			.map(
				(n) => `
        <tr class="border-b hover:bg-gray-50">
          <td class="p-4 font-medium">${n.titulo}</td>
          <td class="p-4">${n.autor}</td>
          <td class="p-4">
            ${new Date(n.createdAt || n.fecha_publicacion).toLocaleDateString()}
          </td>
          <td class="p-4">
            <span class="bg-gray-100 px-2 py-1 rounded text-xs">
              ${n.categoria ? n.categoria.nombre : "General"}
            </span>
          </td>
          <td class="p-4 text-center space-x-2">
            <button 
              onclick="editarNoticia(${n.id})" 
              class="text-blue-500 font-bold hover:underline"
            >
              Editar
            </button>

            <button 
              onclick="eliminarNoticia(${n.id})" 
              class="text-red-500 font-bold hover:underline"
            >
              Eliminar
            </button>
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

	const res = await fetch(`${API_URL}/delete/${id}`, {
		method: "DELETE",
		credentials: "include",
	});

	if (res.ok) cargarNoticias();
}
// Función global para generar slugs limpios en el Front
function generarSlug(texto) {
	return texto
		.toString()
		.normalize("NFD") // Separa letras de acentos
		.replace(/[\u0300-\u036f]/g, "") // Elimina los acentos
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9 -]/g, "") // Quita caracteres especiales
		.replace(/\s+/g, "-") // Espacios por guiones
		.replace(/-+/g, "-"); // Quita guiones duplicados
}

// ===============================
//  EDITAR NOTICIA
// ===============================
async function editarNoticia(id) {
	try {
		const modal = document.getElementById("modal");
		const content = document.getElementById("modal-content");

		// 1. Carga paralela de datos
		const [res, catRes] = await Promise.all([
			fetch(`${API_URL}/${id}`),
			fetch(API_CATEGORIAS),
		]);

		if (!res.ok || !catRes.ok)
			throw new Error("Error al obtener datos del servidor");

		const noticia = await res.json();
		const categorias = await catRes.json();

		modal.classList.remove("hidden");

		// 2. Renderizado del formulario
		content.innerHTML = `
            <h3 class="text-2xl font-black mb-4 text-blue-600">Editar Noticia</h3>
            <form id="form-editar-noticia" class="space-y-4" enctype="multipart/form-data">
                
                <div>
                    <label class="block text-xs font-bold text-gray-400 uppercase">Título</label>
                    <input name="titulo" id="tit-noticia" value="${noticia.titulo}" class="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" required>
                </div>

                <div>
                    <label class="block text-[10px] font-medium text-gray-500">Slug (URL amigable):</label>
                    <input type="text" name="slug" id="slug-noticia" value="${noticia.slug}" 
                        class="w-full bg-gray-100 border p-1 text-xs rounded text-gray-600 italic outline-none" readonly title="El slug se genera automáticamente">
                </div>

                <textarea name="copete" class="w-full border p-2 rounded h-20" required>${noticia.copete}</textarea>
                
                <select name="categoria_id" class="w-full border p-2 rounded" required>
                    <option value="">Seleccionar Categoría</option>
                    ${categorias
											.map(
												(c) => `
                        <option value="${c.id}" ${c.id === noticia.categoria_id ? "selected" : ""}>${c.nombre}</option>
                    `,
											)
											.join("")}
                </select>

                <textarea name="cuerpo" class="w-full border p-2 rounded h-40" required>${noticia.cuerpo}</textarea>
                <input name="autor" value="${noticia.autor}" class="w-full border p-2 rounded" required>

                <div class="border-t pt-4 mt-4 bg-gray-50 p-3 rounded-lg">
                    <label class="block text-sm font-bold text-gray-700 mb-2">Imagen de Portada</label>
                    <input type="file" name="portada" class="w-full border p-2 rounded mb-4 bg-white">
                
                    <label class="block text-sm font-bold text-gray-700 mb-2">Añadir a Galería</label>
                    <input type="file" name="galeria" multiple class="w-full border p-2 rounded bg-white">
                </div>
                
                <label class="block text-sm font-bold text-gray-700">Estado</label>
                <select name="estado" class="w-full border p-2 rounded bg-white">
                    <option value="publicado" ${noticia.estado === "publicado" ? "selected" : ""}>Publicado</option>
                    <option value="borrador" ${noticia.estado === "borrador" ? "selected" : ""}>Borrador</option>
                </select>

                <button type="submit" id="btn-guardar-edit" class="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                    GUARDAR CAMBIOS
                </button>
            </form>
        `;

		// 3. Lógica de Auto-Slug en Edición
		const inputTitulo = document.getElementById("tit-noticia");
		const inputSlug = document.getElementById("slug-noticia");

		inputTitulo.addEventListener("input", () => {
			// Actualiza el slug mientras escribes
			inputSlug.value = generarSlug(inputTitulo.value);
		});

		// 4. Manejo del Submit
		const formEditar = document.getElementById("form-editar-noticia");
		formEditar.onsubmit = async (e) => {
			e.preventDefault();
			const btnGuardar = document.getElementById("btn-guardar-edit");
			const textoOriginal = btnGuardar.innerText;

			btnGuardar.innerText = "GUARDANDO...";
			btnGuardar.disabled = true;

			try {
				const formData = new FormData(formEditar);

				const updateRes = await fetch(`${API_URL}/edit/${id}`, {
					method: "PUT",
					body: formData,
					credentials: "include",
				});

				if (updateRes.ok) {
					alert("Noticia actualizada con éxito");
					closeModal();
					cargarNoticias();
				} else {
					const errData = await updateRes.json();
					alert("Error: " + (errData.mensaje || "No se pudo actualizar"));
				}
			} catch (error) {
				console.error("Error al actualizar:", error);
				alert("Falla de conexión con el servidor");
			} finally {
				btnGuardar.innerText = textoOriginal;
				btnGuardar.disabled = false;
			}
		};
	} catch (error) {
		console.error("Error al cargar edición", error);
		alert("No se pudo cargar la información para editar");
	}
}
// ===============================
//  GESTIÓN DE PROGRAMACIÓN
// ===============================

async function cargarProgramacion() {
	try {
		const res = await fetch(`${API_BASE}/programas`);
		const programas = await res.json();
		const lista = document.getElementById("tabla-programacion");

		if (!Array.isArray(programas) || programas.length === 0) {
			lista.innerHTML = `<tr><td colspan="8" class="p-8 text-center text-gray-400 italic">No hay programas cargados</td></tr>`;
			return;
		}

		// 1. Extraer horas únicas de inicio (HH:mm)
		const horasUnicas = [
			...new Set(
				programas
					.filter((p) => p && p.hora_inicio) // Aseguramos que el objeto y la hora existan
					.map((p) => p.hora_inicio.substring(0, 5)),
			),
		].sort();

		// 2. Renderizar filas
		lista.innerHTML = horasUnicas
			.map((hora) => {
				return `
        <tr class="border-b hover:bg-gray-50">
          <td class="p-3 font-black text-purple-600 bg-purple-50 border-r w-24 text-center">
            ${hora} hs
          </td>
          ${[0, 1, 2, 3, 4, 5, 6]
						.map((diaIndex) => {
							// BUSQUEDA SEGURA:
							const programa = programas.find((p) => {
								if (!p || !p.hora_inicio) return false;
								const hInicio = p.hora_inicio.substring(0, 5);
								return p.dia_semana === diaIndex && hInicio === hora;
							});

							if (programa) {
								return `
                <td class="p-2 border-r min-w-[140px] align-top">
                  <div class="relative group bg-white p-2 rounded-lg shadow-sm border-l-4 border-pink-500">
                    <div class="text-[9px] font-black text-gray-400 uppercase mb-1">
                      ${programa.hora_inicio.substring(0, 5)} - ${programa.hora_fin ? programa.hora_fin.substring(0, 5) : "??"}
                    </div>
                    <div class="font-bold text-slate-800 text-sm leading-tight">${programa.nombre}</div>
                    <div class="text-[10px] text-gray-500 italic line-clamp-1">${programa.staff || ""}</div>
                    
                    <div class="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onclick="editarPrograma(${programa.id})" class="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                        <i class="fas fa-edit text-[10px]"></i>
                      </button>
                      <button onclick="eliminarPrograma(${programa.id})" class="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                        <i class="fas fa-times text-[10px]"></i>
                      </button>
                    </div>
                  </div>
                </td>`;
							} else {
								return `<td class="p-2 border-r opacity-20 text-center"><i class="fas fa-minus text-gray-300"></i></td>`;
							}
						})
						.join("")}
        </tr>`;
			})
			.join("");
	} catch (error) {
		console.error("Error al cargar programas:", error);
		lista.innerHTML = `<tr><td colspan="8" class="p-4 text-red-500 text-center">Error crítico al renderizar la grilla.</td></tr>`;
	}
}
// ===============================
// ✏️ EDITAR PROGRAMA
// ===============================
async function editarPrograma(id) {
	try {
		const modal = document.getElementById("modal");
		const content = document.getElementById("modal-content");

		// Traer datos del programa desde tu API
		const res = await fetch(`${API_BASE}/programas/${id}`);
		const programa = await res.json();

		modal.classList.remove("hidden");

		content.innerHTML = `
      <h3 class="text-2xl font-black mb-4 text-purple-600">Editar Programa</h3>

      <form id="form-editar-programa" class="space-y-4">
        <div>
          <label class="block text-sm font-bold mb-1">Nombre del Programa</label>
          <input name="nombre" value="${programa.nombre}" 
            class="w-full border p-2 rounded focus:ring-2 focus:ring-purple-400 outline-none" required>
        </div>

        <div>
          <label class="block text-sm font-bold mb-1">Staff / Conductores</label>
          <input name="staff" value="${programa.staff || ""}" 
            class="w-full border p-2 rounded focus:ring-2 focus:ring-purple-400 outline-none">
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-bold mb-1">Hora Inicio</label>
            <input type="time" name="hora_inicio" value="${programa.hora_inicio.substring(0, 5)}"
              class="w-full border p-2 rounded" required>
          </div>
          <div>
            <label class="block text-sm font-bold mb-1">Hora Fin</label>
            <input type="time" name="hora_fin" value="${programa.hora_fin.substring(0, 5)}"
              class="w-full border p-2 rounded" required>
          </div>
        </div>

        <div>
          <label class="block text-sm font-bold mb-1">Día de la Semana</label>
          <select name="dia_semana" class="w-full border p-2 rounded">
            ${dias
							.map(
								(d, i) => `
              <option value="${i}" ${programa.dia_semana === i ? "selected" : ""}>
                ${d}
              </option>
            `,
							)
							.join("")}
          </select>
        </div>

        <button class="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold transition-colors">
          GUARDAR CAMBIOS
        </button>
      </form>
    `;

		document.getElementById("form-editar-programa").onsubmit = async (e) => {
			e.preventDefault();

			const formData = new FormData(e.target);
			const data = {
				nombre: formData.get("nombre"),
				staff: formData.get("staff"),
				hora_inicio: formData.get("hora_inicio"),
				hora_fin: formData.get("hora_fin"),
				dia_semana: parseInt(formData.get("dia_semana")),
				// Si tu backend lo requiere, puedes agregar updatedAt aquí o dejar que el servidor lo maneje
			};

			const updateRes = await fetch(`${API_BASE}/programas/${id}`, {
				method: "PUT",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(data),
				credentials: "include",
			});

			if (updateRes.ok) {
				closeModal();
				cargarProgramacion();
			} else {
				alert("Error al actualizar el programa");
			}
		};
	} catch (error) {
		console.error("Error al editar programa", error);
	}
}
// ===============================
// 🗑️ ELIMINAR PROGRAMA
// ===============================
async function eliminarPrograma(id) {
	if (!confirm("¿Seguro que deseas eliminar este programa?")) return;

	try {
		const res = await fetch(`${API_BASE}/programas/${id}`, {
			method: "DELETE",
			credentials: "include",
		});

		if (res.ok) {
			cargarProgramacion(); // Recargar la grilla
		} else {
			alert("Error al eliminar el programa");
		}
	} catch (error) {
		console.error("Error al eliminar programa", error);
	}
}
// publicidad
async function cargarPublicidad() {
	try {
		const res = await fetch(`${API_BASE}/publicidad`, {
			credentials: "include",
		});
		const datos = await res.json();
		const lista = document.getElementById("tabla-publicidad"); // Asegúrate de que este ID exista en tu HTML

		if (!lista) return;

		lista.innerHTML = datos
			.map(
				(p) => `
			<tr class="border-b hover:bg-gray-50">
				<td class="p-3">
					<img src="${API_BASE}${p.imagen_url}" class="h-12 w-20 object-cover rounded border">
				</td>
				<td class="p-3 font-bold">${p.nombre}</td>
				<td class="p-3 text-xs text-gray-500">${p.ubicacion}</td>
				<td class="p-3 text-center">
					<button onclick="eliminarPublicidad(${p.id})" class="text-red-500 hover:underline">Eliminar</button>
				</td>
			</tr>
		`,
			)
			.join("");
	} catch (error) {
		console.error("Error al cargar publicidades:", error);
	}
}

async function eliminarPublicidad(id) {
	if (!confirm("¿Seguro que deseas eliminar esta publicidad?")) return;
	try {
		const res = await fetch(`${API_BASE}/publicidad/${id}`, {
			method: "DELETE",
			credentials: "include",
		});
		if (res.ok) {
			cargarPublicidad();
		} else {
			alert("Error al eliminar publicidad");
		}
	} catch (error) {
		console.error("Error:", error);
	}
}

function setupFormPublicidad() {
	const form = document.getElementById("form-publicidad");
	form.onsubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData(form);

		try {
			const res = await fetch(`${API_BASE}/publicidad/add`, {
				method: "POST",
				body: formData,
				credentials: "include", // Importante para la sesión
			});

			if (res.ok) {
				alert("Publicidad subida con éxito");
				closeModal();
				cargarPublicidad(); // Función para refrescar la lista
			} else {
				alert("Error al subir publicidad");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};
}

// ===============================
// 📦 MODALES
// ===============================
async function openModal(tipo) {
	const modal = document.getElementById("modal");
	const content = document.getElementById("modal-content");

	modal.classList.remove("hidden");

	if (tipo === "noticia") {
		const catRes = await fetch(API_CATEGORIAS);
		const categorias = await catRes.json();

		// Dentro de openModal('noticia'), busca donde configuras el submit
		function setupFormNoticia() {
			const form = document.getElementById("form-noticia");
			form.onsubmit = async (e) => {
				e.preventDefault();
				const formData = new FormData(form);

				try {
					const res = await fetch(`${API_URL}/add`, {
						method: "POST",
						body: formData, // FormData enviará 'portada' y el array 'galeria'
						credentials: "include",
					});

					if (res.ok) {
						closeModal();
						cargarNoticias();
					} else {
						alert("Error al publicar noticia");
					}
				} catch (error) {
					console.error("Error:", error);
				}
			};
		}

		// ... dentro de openModal(tipo === 'noticia')

		content.innerHTML = `
    <h3 class="text-2xl font-black mb-4 text-pink-600">Nueva Noticia</h3>
    <form id="form-noticia" class="space-y-4" enctype="multipart/form-data">
        <div>
            <label class="block text-xs font-bold text-gray-400 uppercase">Título</label>
            <input name="titulo" id="tit-noticia" placeholder="Ej: Gran inauguración en el centro"
                class="w-full border p-2 rounded focus:ring-2 focus:ring-pink-500 outline-none" required>
        </div>

        <div>
            <label class="block text-[10px] font-medium text-gray-500">URL Amigable (Slug):</label>
            <input type="text" name="slug" id="slug-noticia" 
                class="w-full bg-gray-50 border p-1 text-xs rounded text-gray-600 italic" readonly>
        </div>

        <textarea name="copete" placeholder="Resumen corto..." class="w-full border p-2 rounded h-20" required></textarea>

        <select name="categoria_id" class="w-full border p-2 rounded" required>
            <option value="">Seleccionar Categoría</option>
            ${categorias.map((c) => `<option value="${c.id}">${c.nombre}</option>`).join("")}
        </select>

        <textarea name="cuerpo" placeholder="Contenido de la noticia..." class="w-full border p-2 rounded h-40" required></textarea>

        <input name="autor" placeholder="Nombre del Autor" class="w-full border p-2 rounded" required>

        <div class="border-t pt-4 mt-4 bg-gray-50 p-3 rounded-lg">
            <label class="block text-sm font-bold text-gray-700 mb-2">Imagen de Portada</label>
            <input type="file" name="portada" class="w-full border p-2 rounded mb-4 bg-white">
      
            <label class="block text-sm font-bold text-gray-700 mb-2">Galería (Múltiple)</label>
            <input type="file" name="galeria" multiple class="w-full border p-2 rounded bg-white">
        </div>

        <select name="estado" class="w-full border p-2 rounded">
            <option value="publicado">Publicado</option>
            <option value="borrador">Borrador</option>
        </select>

        <button type="submit" id="btn-publicar" class="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-bold transition-all">
            PUBLICAR NOTICIA
        </button>
    </form>
`;

		// Lógica de escucha para el Título
		const inputTitulo = document.getElementById("tit-noticia");
		const inputSlug = document.getElementById("slug-noticia");

		inputTitulo.addEventListener("input", () => {
			inputSlug.value = generarSlug(inputTitulo.value);
		});

		setupFormNoticia();
	}

	// ================= PROGRAMA =================
	else if (tipo === "programa") {
		content.innerHTML = `
    <h3 class="text-2xl font-black mb-4 text-purple-600">Nuevo Programa</h3>
    <form id="form-programa" class="space-y-4">
      <input name="nombre" placeholder="Nombre" class="w-full border p-2 rounded" required>
      <input name="staff" placeholder="Conductores" class="w-full border p-2 rounded">
      
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-xs font-bold text-gray-400">INICIO</label>
          <input type="time" name="hora_inicio" class="w-full border p-2 rounded" required>
        </div>
        <div>
          <label class="text-xs font-bold text-gray-400">FIN</label>
          <input type="time" name="hora_fin" class="w-full border p-2 rounded" required>
        </div>
      </div>
  
      <select name="dia_semana" class="w-full border p-2 rounded">
        ${dias.map((d, i) => `<option value="${i}">${d}</option>`).join("")}
      </select>
  
      <button class="w-full bg-purple-600 text-white py-2 rounded font-bold">GUARDAR</button>
    </form>
  `;

		document.getElementById("form-programa").onsubmit = async (e) => {
			e.preventDefault();

			const formData = new FormData(e.target);

			const data = {
				nombre: formData.get("nombre"),
				staff: formData.get("staff"),
				hora_inicio: formData.get("hora_inicio"),
				hora_fin: formData.get("hora_fin"),
				dia_semana: parseInt(formData.get("dia_semana")),
			};

			try {
				const res = await fetch(`${API_BASE}/programas`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
					credentials: "include",
				});

				if (res.ok) {
					closeModal();
					cargarProgramacion();
				} else {
					alert("Error al crear programa");
				}
			} catch (error) {
				console.error("Error:", error);
			}
		};
	}

	// ================= USUARIO (NUEVO) =================
	else if (tipo === "usuario") {
		content.innerHTML = `
      <h3 class="text-2xl font-black mb-4 text-pink-600">Nuevo Usuario</h3>

      <form id="form-usuario" class="space-y-4">
        <input name="username" placeholder="Nombre de usuario"
          class="w-full border p-2 rounded" required>

        <input type="password" name="password"
          placeholder="Contraseña"
          class="w-full border p-2 rounded" required>

        <select name="rol" class="w-full border p-2 rounded" required>
          <option value="">Seleccionar rol</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
        </select>

        <button class="w-full bg-pink-600 text-white py-3 rounded-xl font-bold">
          CREAR USUARIO
        </button>
      </form>
    `;

		document.getElementById("form-usuario").onsubmit = async (e) => {
			e.preventDefault();

			const formData = new FormData(e.target);

			const data = {
				nombre: formData.get("username"),
				password: formData.get("password"),
				rol: formData.get("rol"),
			};

			const res = await fetch(`${API_BASE}/usuarios`, {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(data),
				credentials: "include",
			});

			if (res.ok) {
				closeModal();
				cargarUsuarios();
			} else {
				alert("Error al crear usuario");
			}
		};
	} else if (tipo === "publicidad") {
		content.innerHTML = `
        <h3 class="text-2xl font-black mb-4 text-orange-600">Nueva Publicidad</h3>
        <form id="form-publicidad" class="space-y-4" enctype="multipart/form-data">
            <input name="nombre" placeholder="Nombre del Cliente/Campaña" class="w-full border p-2 rounded" required>
            
            <input name="link_url" placeholder="URL de destino (https://...)" class="w-full border p-2 rounded">
            
            <select name="ubicacion" class="w-full border p-2 rounded">
                <option value="encabezado">Encabezado (Banner Superior)</option>
                <option value="lateral">Lateral (Sidebar)</option>
                <option value="intermedia">Intermedia (Entre noticias)</option>
            </select>

            <div class="bg-gray-50 p-4 rounded-lg border-2 border-dashed">
                <label class="block text-sm font-bold mb-2">Banner Publicitario</label>
                <input type="file" name="imagen" class="w-full" required>
            </div>

            <button type="submit" class="w-full bg-orange-600 text-white py-3 rounded-xl font-bold">
                SUBIR PUBLICIDAD
            </button>
        </form>
    `;

		setupFormPublicidad();
	}
}

async function cargarUsuarios() {
	try {
		const res = await fetch(`${API_BASE}/usuarios`, {
			credentials: "include",
		});

		const usuarios = await res.json();
		const lista = document.getElementById("tabla-usuarios");

		if (!lista) return;

		lista.innerHTML = usuarios
			.map(
				(u) => `
    <tr class="border-b hover:bg-gray-50">
      <td class="p-3">${u.id}</td>
      <td class="p-3">${u.nombre}</td>
      <td class="p-3">${u.rol}</td>

      <td class="p-3 text-center space-x-2">
        <button 
          onclick="editarUsuario(${u.id})"
          class="text-blue-500 font-bold hover:underline"
        >
          Editar
        </button>

        <button 
          onclick="eliminarUsuario(${u.id})"
          class="text-red-500 font-bold hover:underline"
        >
          Eliminar
        </button>
      </td>
    </tr>
  `,
			)
			.join("");
	} catch (error) {
		console.error("Error al cargar usuarios", error);
	}
}

function closeModal() {
	document.getElementById("modal").classList.add("hidden");
}

// ===============================
// 🚀 INIT
// ===============================
document.addEventListener("DOMContentLoaded", async () => {
	await verificarSesion();
	showSection("noticias");

	const logoutBtn = document.getElementById("logoutBtn");

	if (logoutBtn) {
		logoutBtn.addEventListener("click", async () => {
			await fetch(API_LOGOUT, {
				method: "POST",
				credentials: "include",
			});

			window.location.href = "/login.html";
		});
	}
});

async function eliminarUsuario(id) {
	if (!confirm("¿Seguro que querés eliminar este usuario?")) return;

	try {
		const res = await fetch(`${API_BASE}/usuarios/${id}`, {
			method: "DELETE",
			credentials: "include",
		});

		if (res.ok) {
			cargarUsuarios();
		} else {
			alert("Error al eliminar usuario");
		}
	} catch (error) {
		console.error("Error:", error);
	}
}

async function editarUsuario(id) {
	const modal = document.getElementById("modal");
	const content = document.getElementById("modal-content");

	const res = await fetch(`${API_BASE}/usuarios/${id}`, {
		credentials: "include",
	});
	const usuario = await res.json();

	modal.classList.remove("hidden");

	content.innerHTML = `
  
    <h3 class="text-2xl font-black mb-4 text-blue-600">Editar Usuario</h3>

    <form id="form-editar-usuario" class="space-y-4">
      <input name="nombre" value="${usuario.nombre}" class="w-full border p-2 rounded" required>

      <input type="password" name="password"
        placeholder="Nueva contraseña"
        class="w-full border p-2 rounded">

		<select name="rol" class="w-full border p-2 rounded">
		<option value="admin" ${usuario.rol === "admin" ? "selected" : ""}>Admin</option>
		<option value="editor" ${usuario.rol === "editor" ? "selected" : ""}>Editor</option>
	</select>

      <button class="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">
        GUARDAR CAMBIOS
      </button>
    </form>
  `;

	document.getElementById("form-editar-usuario").onsubmit = async (e) => {
		e.preventDefault();

		const data = Object.fromEntries(new FormData(e.target));
		if (!data.password) delete data.password;

		const res = await fetch(`${API_BASE}/usuarios/${id}`, {
			method: "PUT",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify(data),
			credentials: "include",
		});

		if (res.ok) {
			closeModal();
			cargarUsuarios();
		} else {
			alert("Error al actualizar usuario");
		}
	};
}
