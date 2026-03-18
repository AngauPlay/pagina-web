const { Categoria, findAll } = require("../models/Categoria");

const categoryController = {
  // Listar categorías para el menú
  listAll: async (req, res) => {
    try {
      const categorias = await findAll({
        order: [["nombre", "ASC"]],
      });
      res.json(categorias);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

exports = module.exports = categoryController;
