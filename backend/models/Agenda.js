const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");

const Agenda = sequelize.define("Agenda", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	titulo: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	imagen_url: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	descripcion: {
		type: DataTypes.TEXT,
	},
	fecha: {
		type: DataTypes.DATE,
		allowNull: false,
	},
	hora: {
		type: DataTypes.TIME,
		allowNull: false,
	},
	lugar: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

module.exports = Agenda;
