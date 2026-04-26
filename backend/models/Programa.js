const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");

const Programa = sequelize.define(
	"Programa",
	{
		nombre: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		hora_inicio: {
			type: DataTypes.TIME,
			allowNull: false,
		},
		hora_fin: {
			type: DataTypes.TIME,
			allowNull: false,
		},

		staff: {
			type: DataTypes.STRING,
		},
		imagen_url: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: null,
			validate: {isUrl: true},
		},
		dia_semana: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {min: 0, max: 6},
		},
	},
	{
		tableName: "programas",
		timestamps: true,
	},
);

module.exports = Programa;
