const Programa = require("../models/Programa");
const { Op } = require("sequelize");

const getProgramasHoy = async (req, res) => {
  try {
    const ahora = new Date();

    // OJO: Asegúrate que esto coincida con la zona horaria de tu audiencia
    const hoy = ahora.getDay();
    const horaActual = ahora.toLocaleTimeString("en-GB", { hour12: false }); // "HH:MM:SS"

    const programas = await Programa.findAll({
      where: {
        dia_semana: hoy,
        activo: true,
        hora: {
          [Op.gte]: horaActual,
        },
      },
      order: [["hora", "ASC"]],
      limit: 2,
    });

    res.json(programas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener programas del día" });
  }
};

const savePrograma = async (req, res) => {
  try {
    let { nombre, hora, staff, dia_semana } = req.body;

    // Validación básica de campos obligatorios
    if (!nombre || !hora || dia_semana === undefined) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Normalizar formato de hora HH:mm a HH:mm:ss
    if (/^\d{2}:\d{2}$/.test(hora)) {
      hora = `${hora}:00`;
    }

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

    // Es buena práctica validar que el ID sea un número antes de consultar
    const eliminado = await Programa.destroy({ where: { id } });

    if (!eliminado) {
      return res.status(404).json({ message: "Programa no encontrado" });
    }

    res.json({ message: "Programa eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "No se pudo eliminar el programa" });
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
    res.status(500).json({ error: "Error al obtener la lista de programas" });
  }
};

const updatePrograma = async (req, res) => {
  try {
    const { id } = req.params;
    let { nombre, hora, staff, dia_semana, activo } = req.body;

    // 1. Buscar si el programa existe
    const programa = await Programa.findByPk(id);
    if (!programa) {
      return res.status(404).json({ message: "Programa no encontrado" });
    }

    // 2. Normalizar formato de hora si viene en el body (HH:mm -> HH:mm:00)
    if (hora && hora.length === 5) {
      hora = `${hora}:00`;
    }

    // 3. Actualizar
    await programa.update({
      nombre: nombre || programa.nombre,
      hora: hora || programa.hora,
      staff: staff || programa.staff,
      dia_semana:
        dia_semana !== undefined ? parseInt(dia_semana) : programa.dia_semana,
      activo: activo !== undefined ? activo : programa.activo,
    });

    res.json({ message: "Programa actualizado correctamente", programa });
  } catch (error) {
    console.error("Error al actualizar programa:", error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getProgramasHoy,
  savePrograma,
  deletePrograma,
  getAllProgramas,
  updatePrograma,
};
