const Noticia = require("../models/Noticia");
const cloudinary = require("../config/cloudinary"); // Importamos tu config de Cloudinary
const fs = require("fs-extra"); // Para limpiar archivos temporales

const newsController = {
  // Listar todas las noticias publicadas
  getAll: async (req, res) => {
    try {
      // USAMOS EL MODELO: Noticia.findAll
      const noticias = await Noticia.findAll({
        where: { estado: "publicado" },
        order: [["fecha_publicacion", "DESC"]],
      });
      res.json(noticias);
    } catch (error) {
      res
        .status(500)
        .json({ mensaje: "Error al obtener noticias", error: error.message });
    }
  },

  // Detalle por Slug
  getBySlug: async (req, res) => {
    try {
      const noticia = await Noticia.findOne({
        where: { slug: req.params.slug, estado: "publicado" },
      });
      if (!noticia)
        return res.status(404).json({ mensaje: "Noticia no encontrada" });
      res.json(noticia);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear una noticia con Cloudinary
  create: async (req, res) => {
    try {
      let imageUrl = "/assets/uploads/default.jpg";

      // Si Multer recibió un archivo, lo subimos a Cloudinary
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "angau_play/noticias",
        });
        imageUrl = result.secure_url; // Guardamos la URL de la nube

        // OPCIONAL: Borrar el archivo temporal de tu servidor para no llenar el disco
        await fs.unlink(req.file.path);
      }

      const nuevaNoticia = await Noticia.create({
        ...req.body,
        imagen_url: imageUrl,
      });

      res.status(201).json(nuevaNoticia);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Editar una noticia
  update: async (req, res) => {
    try {
      // USAMOS EL MODELO: Noticia.update
      const [actualizado] = await Noticia.update(req.body, {
        where: { id: req.params.id },
      });

      if (!actualizado)
        return res.status(404).json({ mensaje: "No se encontró" });
      res.json({ mensaje: "Noticia actualizada" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = newsController;
