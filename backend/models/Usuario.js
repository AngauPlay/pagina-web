const { Sequelize, DataTypes } = require("sequelize");
// Importa tu configuración de conexión a la base de datos
const sequelize = require("../config/db");

const Usuario = sequelize.define(
  "Usuario",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    rol: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "redactor",
    },
  },
  {
    tableName: "usuarios", // Nombre exacto de la tabla en MariaDB
    timestamps: false, // Tu SQL no tiene campos createdAt/updatedAt
  },
);

// Función auxiliar para mantener compatibilidad con tu controlador
const create = async (data) => {
  return await Usuario.create(data);
};

module.exports = { Usuario, create };
