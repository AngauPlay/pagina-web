const cloudinary = require("../config/cloudinaryAgenda");
const Agenda = require("../models/agenda");

const agendaController = {
	// Crear una nueva agenda
	createEvent: async (req, res) => {
		try {
			const {titulo, descripcion, fecha, hora, lugar} = req.body;
			const agenda = await Agenda.create({
				titulo,
				descripcion,
				fecha,
				hora,
				lugar,
			});
			res.status(201).json(agenda);
			if (req.file) {
				const result = await cloudinary.uploader.upload(req.file.path, {
					folder: "agenda",
					allowed_formats: ["jpg", "jpeg", "png", "webp"],
				});
				agenda.imagen_url = result.secure_url;
				await agenda.save();
			}
		} catch (error) {
			res.status(400).json({error: error.message});
		}
	},
	// Listar todas las agendas
	listEvents: async (req, res) => {
		try {
			const agendas = await Agenda.findAll({order: [["fecha", "ASC"]]});
			res.json(agendas);
		} catch (error) {
			res.status(500).json({error: "Error al obtener las agendas"});
		}
	},
	// Eliminar una agenda
	deleteEvent: async (req, res) => {
		try {
			const {id} = req.params;
			const eliminado = await Agenda.destroy({where: {id}});
			if (!eliminado) {
				return res.status(404).json({message: "evento no encontrado"});
			}
			res.json({message: "Evento eliminado correctamente"});
		} catch (error) {
			res.status(500).json({error: "Error al eliminar el evento"});
		}
	},
};

module.exports = agendaController;
