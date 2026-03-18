const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // Importamos la conexión

// ACÁ ESTÁ EL CAMBIO: Usamos sequelize.define
const Noticia = sequelize.define(
  "Noticia",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, unique: true },
    copete: { type: DataTypes.TEXT },
    cuerpo: { type: DataTypes.TEXT },
    imagen_url: { type: DataTypes.STRING },
    fecha_publicacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    categoria_id: { type: DataTypes.INTEGER },
    autor: { type: DataTypes.STRING },
    estado: {
      type: DataTypes.ENUM("borrador", "publicado"),
      defaultValue: "borrador",
    },
  },
  {
    tableName: "noticias",
    timestamps: false,
  },
);

module.exports = Noticia;
