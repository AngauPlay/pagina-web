const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const slugify = require("slugify"); // No olvides instalarlo: npm install slugify
const Categoria = require("./Categoria"); // Importamos el modelo de Categoría para las relaciones
const Noticia = sequelize.define(
  "Noticia",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
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
    hooks: {
      // Se ejecuta antes de validar los datos para INSERT o UPDATE
      beforeValidate: (noticia) => {
        if (noticia.titulo) {
          // Creamos el slug base
          const baseSlug = slugify(noticia.titulo, {
            lower: true,
            strict: true,
            trim: true,
          });

          // Agregar un sufijo aleatorio para evitar colisiones de duplicados
          noticia.slug = `${baseSlug}-${Math.floor(Math.random() * 1000)}`;
        }
      },
    },
  },
);

// Establecemos la relación entre Noticia y Categoria
Noticia.belongsTo(Categoria, { foreignKey: "categoria_id" });
Categoria.hasMany(Noticia, { foreignKey: "categoria_id" });
module.exports = Noticia;
