
      // ===== PROGRAMACIÓN =====
      function obtenerProgramacion() {
        return fetch("http://localhost:3000/programas/hoy")
          .then((res) => res.json())
          .catch((err) => {
            console.error("Error al obtener programación:", err);
            return [];
          });
      }

      function estaEnVivo(inicio, fin) {
        if (!inicio || !fin) return false;
        
        const ahora = new Date();
        const actual = ahora.getHours() * 60 + ahora.getMinutes();

        const [hi, mi] = inicio.split(":").map(Number);
        const [hf, mf] = fin.split(":").map(Number);

        const ini = hi * 60 + mi;
        const finM = hf * 60 + mf;

        return actual >= ini && actual <= finM;
      }
      async function renderProgramacion() {
        const contenedor = document.getElementById("programacion-container");

        try {
          const res = await fetch("http://localhost:3000/programas/hoy");
          const data = await res.json();

          if (!data || data.length === 0) {
            contenedor.innerHTML = "<p>No hay programación hoy</p>";
            return;
          }

          contenedor.innerHTML = data
            .map((p) => {
              const vivo = estaEnVivo(p.hora_inicio, p.hora_fin);

              return `
        <div class="relative rounded-xl overflow-hidden group cursor-pointer">

          <div class="w-full aspect-[2/1] overflow-hidden">
            <img 
              src="${p.imagen || "/assets/programa2-banner.jpg"}" 
              class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
          </div>

          <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

          <div class="absolute bottom-3 left-3 text-white">
            <span class="text-[10px] font-bold ${
              vivo ? "text-yellow-neon" : "text-white/80"
            } uppercase">
             ${vivo ? "EN VIVO 🔴" : `${p.hora_inicio} - ${p.hora_fin}`}
            </span>
            <h3 class="font-bold text-sm">${p.nombre}</h3>
          </div>

        </div>
      `;
            })
            .join("");
        } catch (error) {
          console.error("Error cargando programación:", error);
          contenedor.innerHTML = "<p>Error cargando programación</p>";
        }
      }

      // ===== NOTICIAS =====
      async function cargarNoticias() {
        const contenedorNoticias =
          document.getElementById("noticias-container");
        const contenedorHero = document.getElementById("hero-noticia");

        try {
          const respuesta = await fetch("http://localhost:3000/noticias");
          const noticias = await respuesta.json();

          if (!noticias || noticias.length === 0) {
            contenedorHero.innerHTML =
              "<p class='text-white italic'>No hay noticias destacadas.</p>";
            contenedorNoticias.innerHTML = "<p>No hay noticias publicadas.</p>";
            return;
          }

          // 1. NOTICIA PRINCIPAL (Indice 0)
          const principal = noticias[0];
          // Accedemos a Categorium.nombre según tu JSON
          const catPrincipal = principal.Categorium
            ? principal.Categorium.nombre
            : "General";

          contenedorHero.innerHTML = `
      <article class="relative group overflow-hidden rounded-3xl bg-slate-900 shadow-2xl cursor-pointer" 
               onclick="window.location.href='articulo.html?slug=${principal.slug}'">
        <img
          src="${principal.imagen_url}"
          class="w-full h-[450px] object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
          alt="${principal.titulo}"
        />
        <div class="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent">
          <span class="bg-pink-accent text-white text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest">
            ${catPrincipal}
          </span>
          <h3 class="text-3xl md:text-5xl font-black text-white mt-4 leading-tight">
            ${principal.titulo}
          </h3>
          <p class="text-gray-300 mt-4 text-lg max-w-2xl hidden md:block">
            ${principal.copete}
          </p>
        </div>
      </article>
    `;

          // 2. RESTO DE NOTICIAS (Slice desde 1)
          const restoNoticias = noticias.slice(1);

          if (restoNoticias.length > 0) {
            contenedorNoticias.innerHTML = restoNoticias
              .map((noticia) => {
                const catNombre = noticia.Categorium
                  ? noticia.Categorium.nombre
                  : "General";

                return `
          <article class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-slate-100 group">
            <div class="relative overflow-hidden">
              <img src="${noticia.imagen_url}" alt="${noticia.titulo}" class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
              <span class="absolute top-4 left-4 bg-pink-accent text-white text-[10px] font-black px-2 py-1 rounded uppercase">
                ${catNombre}
              </span>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-black leading-tight text-slate-800 group-hover:text-pink-accent transition-colors">
                ${noticia.titulo}
              </h3>
              <p class="text-slate-500 mt-3 text-sm line-clamp-2">${noticia.copete}</p>
              <a href="articulo.html?slug=${noticia.slug}" class="inline-block mt-4 text-pink-accent font-black text-xs tracking-widest hover:translate-x-2 transition-transform">
                LEER MÁS →
              </a>
            </div>
          </article>
        `;
              })
              .join("");
          } else {
            contenedorNoticias.innerHTML =
              "<p class='col-span-3 text-center text-slate-400'>No hay más noticias anteriores.</p>";
          }
        } catch (error) {
          console.error("Error al cargar noticias:", error);
          if (contenedorNoticias)
            contenedorNoticias.innerHTML =
              "<p>Error al conectar con el servidor.</p>";
        }
      }

      // IMPORTANTE: Asegúrate de llamar a la función al cargar la página
      document.addEventListener("DOMContentLoaded", () => {
        cargarNoticias();
        renderProgramacion(); 
        
      });
      // LÓGICA DEL MENÚ
      const menuBtn = document.getElementById("menu-btn");
      const closeMenu = document.getElementById("close-menu");
      const mobileMenu = document.getElementById("mobile-menu");
      const overlay = document.getElementById("overlay");

      function toggleMenu() {
        mobileMenu.classList.toggle("-translate-x-full");
        overlay.classList.toggle("hidden");
        document.body.classList.toggle("menu-open");
      }

      menuBtn.addEventListener("click", toggleMenu);
      closeMenu.addEventListener("click", toggleMenu);
      overlay.addEventListener("click", toggleMenu);
    