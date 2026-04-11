const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Programa = sequelize.define(
  "Programa",
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hora: {
      // Cambiado a TIME para coincidir con tu tabla MySQL
      // Sequelize manejará el formato "HH:mm:ss" automáticamente
      type: DataTypes.TIME,
      allowNull: false,
    },
    staff: {
      type: DataTypes.STRING,
    },
    dia_semana: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 0, max: 6 },
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    // MUY IMPORTANTE: Sequelize por defecto busca la tabla "Programas" (plural).
    // Tu SQL usa "programas" (minúscula), forzamos el nombre aquí:
    tableName: "programas",
    timestamps: true, // Tu SQL tiene createdAt y updatedAt, así que esto debe ser true.
  },
);

module.exports = Programa;
