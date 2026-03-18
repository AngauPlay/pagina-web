const { Noticia, findAll, findOne, _update } = require("../models/Noticia");

const newsController = {
  // Listar todas las noticias publicadas (para la Home)
  getAll: async (req, res) => {
    try {
      const noticias = await findAll({
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

  // Detalle de una noticia por su Slug (para SEO)
  getBySlug: async (req, res) => {
    try {
      const noticia = await findOne({
        where: { slug: req.params.slug, estado: "publicado" },
      });
      if (!noticia)
        return res.status(404).json({ mensaje: "Noticia no encontrada" });
      res.json(noticia);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear una noticia (Admin)
  create: async (req, res) => {
    try {
      // Los datos de texto vienen en req.body
      // La info del archivo viene en req.file (gracias a Multer)
      const noticiaData = {
        ...req.body,
        imagen_url: req.file
          ? `/assets/uploads/${req.file.filename}`
          : "/assets/uploads/default.jpg",
      };

      const nuevaNoticia = await Noticia.create(noticiaData);
      res.status(201).json(nuevaNoticia);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Editar una noticia
  update: async (req, res) => {
    try {
      const [actualizado] = await _update(req.body, {
        where: { id: req.params.id },
      });
      if (!actualizado)
        return res.status(404).json({ mensaje: "No se encontró la noticia" });
      res.json({ mensaje: "Noticia actualizada" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

exports = module.exports = newsController;
