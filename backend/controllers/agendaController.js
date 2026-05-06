const {cloudinary} = require("../config/cloudinaryAgenda");
const Agenda = require("../models/agenda");
const {get} = require("../routes/agendaRoutes");

const agendaController = {
	// Crear una nueva agenda
	createEvent: async (req, res) => {
		try {
			const {titulo, descripcion, fecha, hora, lugar} = req.body;
			let imagen_url = ""; // Valor por defecto o manejar si es obligatorio

			// 1. Subir a Cloudinary PRIMERO si hay archivo
			if (req.file) {
				const result = await cloudinary.uploader.upload(req.file.path, {
					folder: "agenda",
					allowed_formats: ["jpg", "jpeg", "png", "webp"],
				});
				imagen_url = result.secure_url;
			} else {
				// Si la imagen es obligatoria en la DB y no hay archivo, lanzamos error
				return res.status(400).json({error: "La imagen es obligatoria"});
			}

			// 2. Crear el registro con la URL ya obtenida
			const agenda = await Agenda.create({
				titulo,
				descripcion,
				fecha,
				hora,
				lugar,
				imagen_url, // Ahora ya no es null
			});

			res.status(201).json(agenda);
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
	getEventById: async (req, res) => {
		try {
			const {id} = req.params;
			const evento = await Agenda.findByPk(id);
			if (!evento) {
				return res.status(404).json({message: "Evento no encontrado"});
			}
			res.json(evento);
		} catch (error) {
			res.status(500).json({error: "Error al obtener el evento"});
		}
	},
	updateEvent: async (req, res) => {
		try {
			const {id} = req.params;
			const {titulo, descripcion, fecha, hora, lugar} = req.body;

			// Buscamos el evento primero
			const agenda = await Agenda.findByPk(id);
			if (!agenda) {
				return res.status(404).json({message: "Evento no encontrado"});
			}

			// Actualizamos los campos de texto
			agenda.titulo = titulo || agenda.titulo;
			agenda.descripcion = descripcion || agenda.descripcion;
			agenda.fecha = fecha || agenda.fecha;
			agenda.hora = hora || agenda.hora;
			agenda.lugar = lugar || agenda.lugar;

			// Si se subió una nueva imagen a través de Multer
			if (req.file) {
				agenda.imagen_url = req.file.path;
			}

			await agenda.save();
			res.json(agenda);
		} catch (error) {
			res.status(400).json({error: error.message});
		}
	},
	// Eliminar una agenda
	deleteEvent: async (req, res) => {
		try {
			const {id} = req.params;

			const evento = await Agenda.findByPk(id);
			if (evento && evento.imagen_url) {
				await cloudinary.uploader.destroy(
					evento.imagen_url.split("/").pop().split(".")[0],
				);
			}

			const eliminado = await Agenda.destroy({where: {id}});

			if (!eliminado) {
				return res.status(404).json({message: "Evento no encontrado"});
			}

			res.json({message: "Evento eliminado correctamente"});
		} catch (error) {
			res.status(500).json({error: "Error al eliminar el evento"});
		}
	},
};

module.exports = agendaController;
