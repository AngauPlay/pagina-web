const {DataTypes} = require("sequelize");
const sequelize = require("../config/db"); // Verifica que esta ruta a tu DB sea correcta

const Publicidad = sequelize.define(
	"Publicidad",
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
		imagen_url: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		link_url: {
			type: DataTypes.STRING,
		},
		ubicacion: {
			type: DataTypes.ENUM("encabezado", "lateral", "intermedia"),
			defaultValue: "lateral",
		},
		activo: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
	},
	{
		tableName: "publicidades",
		timestamps: true, // Esto crea createdAt y updatedAt automáticamente
	},
);

module.exports = Publicidad;
