const Programa = require("../models/Programa");
const { Op } = require("sequelize");

const getProgramasHoy = async (req, res) => {
  try {
    const ahora = new Date();
    const hoy = ahora.getDay();

    // Formato HH:MM:SS para comparar con el tipo TIME de MySQL
    const horaActual = ahora.toTimeString().split(" ")[0];

    const programas = await Programa.findAll({
      where: {
        dia_semana: hoy,
        activo: true,
        // Traemos los que empiezan ahora o más tarde
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

const savePrograma = async (req, res) => {
  try {
    let { nombre, hora, staff, dia_semana } = req.body;

    // 1. Validar formato de hora (HH:mm -> HH:mm:00)
    if (hora && hora.length === 5) {
      hora = `${hora}:00`;
    }

    // 2. Crear el programa
    // Sequelize se encargará de createdAt y updatedAt si el modelo tiene timestamps: true
    const nuevoPrograma = await Programa.create({
      nombre,
      hora,
      staff,
      dia_semana: parseInt(dia_semana),
      activo: true,
    });

    res.status(201).json(nuevoPrograma);
  } catch (error) {
    console.error("Error al guardar programa:", error);
    res.status(400).json({ error: error.message });
  }
};

const deletePrograma = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Programa.destroy({ where: { id } });

    if (!eliminado)
      return res.status(404).json({ message: "Programa no encontrado" });

    res.json({ message: "Programa eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllProgramas = async (req, res) => {
  try {
    const programas = await Programa.findAll({
      order: [
        ["dia_semana", "ASC"],
        ["hora", "ASC"],
      ],
    });
    res.json(programas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProgramasHoy,
  savePrograma,
  deletePrograma,
  getAllProgramas,
};
