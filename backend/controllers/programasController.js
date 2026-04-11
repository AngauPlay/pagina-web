const  Programa  = require("../models/Programa");
const { Op } = require("sequelize");

const getProgramasHoy = async (req, res) => {
  try {
    const ahora = new Date();
    const hoy = ahora.getDay(); // 0-6

    // Formateamos la hora actual a HH:MM:SS para comparar con MySQL
    const horaActual = ahora.toTimeString().split(" ")[0];

    const programas = await Programa.findAll({
      where: {
        dia_semana: hoy,
        activo: true,
        // Buscamos programas que aún no terminaron o están por empezar
        hora: {
          [Op.gte]: horaActual,
        },
      },
      order: [["hora", "ASC"]],
      limit: 2,
    });

    res.json(programas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getProgramasHoy };
