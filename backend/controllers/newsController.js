const Noticia = require("../models/Noticia");
const cloudinary = require("../config/cloudinary"); // Importamos tu config de Cloudinary
const fs = require("fs-extra"); // Para limpiar archivos temporales
const Categoria = require("../models/Categoria"); // Importamos el modelo de Categoría para los joins

const newsController = {
  // Listar todas las noticias publicadas
  getAll: async (req, res) => {
    try {
      const noticias = await Noticia.findAll({
        // Quitamos el filtro de "publicado" para que el admin vea sus borradores
        include: [{ model: Categoria, attributes: ["nombre"] }],
        order: [["fecha_publicacion", "DESC"]],
      });
      res.json(noticias);
    } catch (error) {
      res
        .status(500)
        .json({ mensaje: "Error al obtener noticias", error: error.message });
    }
  },
  getByCategory: async (req, res) => {
    try {
      const { nombreCat } = req.params; // Ejemplo: "Cultura"

      const noticias = await Noticia.findAll({
        where: { estado: "publicado" },
        include: [
          {
            model: Categoria,
            where: {
              // Esto hace que filtre por el nombre de la categoría en la otra tabla
              nombre: nombreCat,
            },
          },
        ],
        order: [["fecha_publicacion", "DESC"]],
      });

      res.json(noticias);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // Detalle por Slug
  getBySlug: async (req, res) => {
    try {
      const noticia = await Noticia.findOne({
        where: { slug: req.params.slug, estado: "publicado" },
        include: [
          {
            model: Categoria,
            attributes: ["nombre"],
          },
        ],
      });

      if (!noticia)
        return res.status(404).json({ mensaje: "Noticia no encontrada" });
      res.json(noticia);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const noticia = await Noticia.findOne({
        where: { id: req.params.id, estado: "publicado" },
        include: [
          {
            model: Categoria,
            attributes: ["nombre"],
          },
        ],
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
    let tempPath = req.file ? req.file.path : null;
    try {
      const { titulo, copete, cuerpo, autor, categoria_id, estado, slug } =
        req.body;
      let imageUrl = "/assets/uploads/default.jpg";

      if (tempPath) {
        const result = await cloudinary.uploader.upload(tempPath, {
          folder: "angau_play/noticias",
        });
        imageUrl = result.secure_url;
      }

      // OPCIONAL: Borrar el archivo temporal de tu servidor para no llenar el disco
      await fs.unlink(tempPath);

      const nuevaNoticia = await Noticia.create({
        titulo,
        copete,
        cuerpo,
        autor,
        categoria_id: parseInt(categoria_id), // Forzamos que sea número
        estado: estado,
        imagen_url: imageUrl,
        fecha_publicacion: new Date(), // Fecha actual
      });

      res.status(201).json(nuevaNoticia);
    } catch (error) {
      console.error("Error al crear noticia:", error);
      // Si falló pero había un archivo, hay que borrarlo
      if (tempPath && fs.existsSync(tempPath)) await fs.unlink(tempPath);
      res.status(400).json({ error: error.message });
    }
  },

  // Editar una noticia
  update: async (req, res) => {
    let tempPath = req.file ? req.file.path : null;
    try {
      const dataToUpdate = { ...req.body };

      // Si el usuario envía una nueva imagen en el update
      if (tempPath) {
        const result = await cloudinary.uploader.upload(tempPath, {
          folder: "angau_play/noticias",
        });
        dataToUpdate.imagen_url = result.secure_url;
      }

      const [actualizado] = await Noticia.update(dataToUpdate, {
        where: { id: req.params.id },
      });

      if (actualizado === 0) {
        return res
          .status(404)
          .json({ mensaje: "No se encontró la noticia para actualizar" });
      }

      res.json({ mensaje: "Noticia actualizada con éxito" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    } finally {
      if (tempPath) await fs.unlink(tempPath);
    }
  },

  delete: async (req, res) => {
    try {
      const noticia = await Noticia.findByPk(req.params.id);
      if (!noticia) return res.status(404).json({ mensaje: "No existe" });
      // Extraemos el public_id de Cloudinary de la URL de la imagen
      const public_id = noticia.imagen_url;
      await cloudinary.uploader.destroy(public_id);

      await noticia.destroy();
      res.json({ mensaje: "Noticia eliminada" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
module.exports = newsController;
