const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Categoria = sequelize.define(
  "Categoria",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    tableName: "categorias", // Asegurate que en tu DB se llame así
    timestamps: false,
  },
);

module.exports = Categoria;
