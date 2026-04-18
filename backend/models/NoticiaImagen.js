const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");
const Noticia = require("./Noticia");

const NoticiaImagen = sequelize.define(
	"NoticiaImagen",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		noticia_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		url: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		tableName: "noticias_imagenes",
		timestamps: false,
	},
);

// Una noticia tiene muchas imágenes
Noticia.hasMany(NoticiaImagen, {foreignKey: "noticia_id", as: "imagenes"});
// Cada imagen pertenece a una noticia
NoticiaImagen.belongsTo(Noticia, {foreignKey: "noticia_id"});

module.exports = NoticiaImagen;
