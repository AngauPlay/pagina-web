const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");
const slugify = require("slugify");
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
		copete: {type: DataTypes.TEXT},
		cuerpo: {type: DataTypes.TEXT},
		imagen_url: {type: DataTypes.STRING},

		fecha_publicacion: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
		categoria_id: {type: DataTypes.INTEGER},
		autor: {type: DataTypes.STRING},
		estado: {
			type: DataTypes.ENUM("borrador", "publicado"),
			defaultValue: "borrador",
		},
	},
	{
		tableName: "noticias",
		timestamps: false,
		hooks: {
			beforeValidate: async (noticia, options) => {
				if (noticia.titulo && !noticia.slug) {
					let baseSlug = slugify(noticia.titulo, {
						lower: true,
						strict: true,
					});

					try {
						const existe = await Noticia.findOne({
							where: {slug: baseSlug},
							transaction: options.transaction,
						});
						if (existe && existe.id !== noticia.id) {
							noticia.slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
						} else {
							noticia.slug = baseSlug;
						}
					} catch (e) {
						noticia.slug = baseSlug;
					}
				}
			},
		},
	},
);

// Establecemos la relación entre Noticia y Categoria
Noticia.belongsTo(Categoria, {foreignKey: "categoria_id"});
Categoria.hasMany(Noticia, {foreignKey: "categoria_id"});
module.exports = Noticia;
