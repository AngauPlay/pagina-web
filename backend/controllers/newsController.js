const Noticia = require("../models/Noticia");
const fs = require("fs-extra"); // Para limpiar archivos temporales
const Categoria = require("../models/Categoria");
const cloudinary = require("../config/cloudinaryNoticias"); // Configuración de Cloudinary para noticias
const NoticiaImagen = require("../models/NoticiaImagen"); // Modelo para imágenes adicionales
const newsController = {
	// Listar todas las noticias publicadas
	getAll: async (req, res) => {
		try {
			const noticias = await Noticia.findAll({
				// Quitamos el filtro de "publicado" para que el admin vea sus borradores
				include: [{model: Categoria, attributes: ["nombre"]}],
				order: [["fecha_publicacion", "DESC"]],
			});
			res.json(noticias);
		} catch (error) {
			res
				.status(500)
				.json({mensaje: "Error al obtener noticias", error: error.message});
		}
	},
	getByCategory: async (req, res) => {
		try {
			const {nombreCat} = req.params;

			const noticias = await Noticia.findAll({
				where: {estado: "publicado"},
				include: [
					{
						model: Categoria,
						where: {
							nombre: nombreCat,
						},
					},
				],
				order: [["fecha_publicacion", "DESC"]],
			});

			res.json(noticias);
		} catch (error) {
			res.status(500).json({error: error.message});
		}
	},
	// Detalle por Slug
	getBySlug: async (req, res) => {
		try {
			const noticia = await Noticia.findOne({
				where: {slug: req.params.slug, estado: "publicado"},
				include: [
					{model: Categoria, attributes: ["nombre"]},
					{model: NoticiaImagen, as: "galeria"},
				],
			});

			if (!noticia)
				return res.status(404).json({mensaje: "Noticia no encontrada"});
			res.json(noticia);
		} catch (error) {
			res.status(500).json({error: error.message});
		}
	},
	getById: async (req, res) => {
		try {
			const noticia = await Noticia.findOne({
				where: {id: req.params.id},
				include: [
					{
						model: Categoria,
						attributes: ["nombre"],
					},
				],
			});

			if (!noticia)
				return res.status(404).json({mensaje: "Noticia no encontrada"});
			res.json(noticia);
		} catch (error) {
			res.status(500).json({error: error.message});
		}
	},

	create: async (req, res) => {
		try {
			const {titulo, copete, cuerpo, categoria_id, autor, estado} = req.body;

			// El middleware ya subió la foto a Cloudinary.
			// La URL está en req.files['portada'][0].path
			let portadaUrl = null;
			if (req.files && req.files["portada"]) {
				portadaUrl = req.files["portada"][0].path;
			}

			const noticia = await Noticia.create({
				titulo,
				copete,
				cuerpo,
				categoria_id,
				autor,
				estado,
				imagen_url: portadaUrl,
			});

			// Procesar Galería
			if (req.files && req.files["galeria"]) {
				const promesas = req.files["galeria"].map((file) =>
					NoticiaImagen.create({
						noticia_id: noticia.id,
						url: file.path, // URL de Cloudinary
					}),
				);
				await Promise.all(promesas);
			}

			res.status(201).json(noticia);
		} catch (error) {
			res.status(500).json({error: error.message});
		}
	},

	update: async (req, res) => {
		try {
			const {id} = req.params;
			const {titulo, copete, cuerpo, categoria_id, autor, estado, slug} =
				req.body;
			const dataToUpdate = {
				titulo,
				copete,
				cuerpo,
				categoria_id,
				autor,
				estado,
				slug,
			};
			// 1. Si hay nueva portada
			if (req.files && req.files["portada"]) {
				const result = await cloudinary.uploader.upload(
					req.files["portada"][0].path,
					{
						folder: "angau_play/noticias",
					},
				);
				dataToUpdate.imagen_url = result.secure_url;
				await fs.unlink(req.files["portada"][0].path);
			}

			// 2. Actualizar datos básicos
			Object.keys(dataToUpdate).forEach(
				(key) => dataToUpdate[key] === undefined && delete dataToUpdate[key],
			);

			await Noticia.update(dataToUpdate, {where: {id}});

			// 3. Si hay nuevas fotos para la galería (se suman a las existentes)
			if (req.files && req.files["galeria"]) {
				for (const file of req.files["galeria"]) {
					const resCloud = await cloudinary.uploader.upload(file.path, {
						folder: "angau_play/galeria",
					});
					await NoticiaImagen.create({
						noticia_id: id,
						url: resCloud.secure_url,
					});
					await fs.unlink(file.path);
				}
			}

			res.json({mensaje: "Noticia actualizada con éxito"});
		} catch (error) {
			res.status(500).json({error: error.message});
		}
	},

	delete: async (req, res) => {
		try {
			const noticia = await Noticia.findByPk(req.params.id);
			if (!noticia) return res.status(404).json({mensaje: "No existe"});

			if (noticia.imagen_url) {
				// Extraemos el public_id de la URL
				const publicId = noticia.imagen_url.split("/").pop().split(".")[0];
				// Borramos de la carpeta 'noticias' en Cloudinary
				await cloudinary.uploader.destroy(`noticias/${publicId}`);
			}

			await noticia.destroy();
			res.json({mensaje: "Noticia eliminada de DB y Cloudinary"});
		} catch (error) {
			res.status(500).json({error: error.message});
		}
	},
};
Noticia.hasMany(NoticiaImagen, {as: "galeria", foreignKey: "noticia_id"});
module.exports = newsController;
