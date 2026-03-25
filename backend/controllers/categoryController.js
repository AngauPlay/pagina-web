const  Categoria = require("../models/Categoria");

const categoryController = {
  // Listar categorías para el menú
  listAll: async (req, res) => {
    try {
      const categorias = await Categoria.findAll({
        order: [["nombre", "ASC"]],
      });
      res.json(categorias);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = categoryController;
