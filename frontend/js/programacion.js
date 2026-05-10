document.addEventListener("DOMContentLoaded", cargarGrilla);

async function cargarGrilla() {
	try {
		const res = await fetch("http://localhost:3000/programas");
		const data = await res.json();

		const contenedor = document.getElementById("grilla-semanal");

		const diasNombres = [
			"Domingo",
			"Lunes",
			"Martes",
			"Miércoles",
			"Jueves",
			"Viernes",
			"Sábado",
		];

		const horasSet = new Set();
		data.forEach((p) => {
			horasSet.add(p.hora_inicio.slice(0, 5));
		});

		const horas = Array.from(horasSet).sort();

		const grilla = {};
		horas.forEach((h) => {
			grilla[h] = Array(7).fill(null);
		});

		data.forEach((p) => {
			const hora = p.hora_inicio.slice(0, 5);
			grilla[hora][p.dia_semana] = p;
		});

		// 👇 ACÁ el cambio importante
		contenedor.innerHTML = `
      <table class="w-full text-sm border rounded-xl overflow-hidden">
        <thead>
          <tr class="bg-purple-main text-white">
            <th class="p-3">Hora</th>
            ${diasNombres.map((d) => `<th class="p-3">${d}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${horas
						.map(
							(hora) => `
            <tr class="border-t">
              <td class="p-3 font-bold bg-gray-100">${hora}</td>
              ${grilla[hora]
								.map((p) => {
									if (!p) return `<td></td>`;

									return `
                    <td class="p-2">
                      <div class="bg-pink-accent text-white p-3 rounded-xl text-center font-bold hover:scale-105 transition">
                        ${p.nombre}
                      </div>
                    </td>
                  `;
								})
								.join("")}
            </tr>
          `,
						)
						.join("")}
        </tbody>
      </table>
    `;
	} catch (error) {
		console.error("Error cargando grilla:", error);
	}
}