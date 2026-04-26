const Publicidad = require("../models/Publicidad");
const upload = require("../config/cloudinaryPublicidad");

const publicidadController = {
	// Listar todas las publicidades (para el panel admin)
	getAll: async (req, res) => {
		try {
			const pubs = await Publicidad.findAll({order: [["createdAt", "DESC"]]});
			res.json(pubs);
		} catch (error) {
			res.status(500).json({error: "Error al obtener publicidades"});
		}
	},
	getActiva: async (req, res) => {
		try {
			const {ubicacion} = req.params;
			const pubs = await Publicidad.findAll({
				where: {ubicacion, activo: true},
			});
			res.json(pubs);
		} catch (error) {
			res.status(500).json({error: "Error"});
		}
	},
	add: async (req, res) => {
		try {
			// Validamos que venga un archivo
			if (!req.file) {
				return res.status(400).json({error: "Debe subir una imagen"});
			}

			const {nombre, link_url, ubicacion} = req.body;

			const imagen_url = req.file.path;

			const nuevaPub = await Publicidad.create({
				nombre,
				link_url,
				ubicacion,
				imagen_url,
			});

			res.status(201).json(nuevaPub);
		} catch (error) {
			console.error("Error en Cloudinary Add:", error);
			res
				.status(500)
				.json({error: "Error al guardar la publicidad en la nube"});
		}
	},
	delete: async (req, res) => {
		try {
			await Publicidad.destroy({where: {id: req.params.id}});
			res.json({mensaje: "Publicidad eliminada"});
		} catch (error) {
			res.status(500).json({error: "Error al eliminar"});
		}
	},
};

module.exports = publicidadController;
