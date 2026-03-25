const Categoria = require("../models/Categoria");

const categoryController = {
  listAll: async (req, res) => {
    try {
      const categorias = await Categoria.findAll({
        attributes: ["id", "nombre", "slug"], // Traemos solo lo necesario
        order: [["nombre", "ASC"]],
      });
      res.json(categorias);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener categorías de Angau" });
    }
  },
};
module.exports = categoryController;
