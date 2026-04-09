const Programa = require("../models/Programa");
const { Op } = require("sequelize");
const { get } = require("../routes/newsRoutes");
const { create, findAll, findByPk, update, destroy } = Programa;

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
// Crear o actualizar programa
const savePrograma = async (req, res) => {
  try {
    let { nombre, hora, staff, dia_semana } = req.body;

    // 1. Asegurar formato HH:mm:ss para MySQL TIME
    if (hora && hora.length === 5) {
      hora = `${hora}:00`;
    }

    // 2. Convertir dia_semana a número
    const diaNum = parseInt(dia_semana);

    const nuevoPrograma = await Programa.create({
      nombre,
      hora,
      staff,
      dia_semana: diaNum,
      activo: true,
    });

    res.json(nuevoPrograma);
  } catch (error) {
    console.error("Error al guardar:", error);
    res.status(400).json({ error: error.message });
  }
};

// Eliminar programa
const deletePrograma = async (req, res) => {
  try {
    await Programa.destroy({ where: { id: req.params.id } });
    res.json({ message: "Programa eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Obtener todos para el panel admin
const getAllProgramas = async (req, res) => {
  const programas = await Programa.findAll({
    order: [
      ["dia_semana", "ASC"],
      ["hora", "ASC"],
    ],
  });
  res.json(programas);
};

const programasController = {
  getProgramasHoy,
  savePrograma,
  deletePrograma,
  getAllProgramas,
};

module.exports = programasController;
