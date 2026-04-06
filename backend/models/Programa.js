const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Programa = sequelize.define("Programa", {
  nombre: { type: DataTypes.STRING, allowNull: false },
  hora: { type: DataTypes.STRING, allowNull: false }, // Ej: "20:00"
  staff: { type: DataTypes.STRING },
  dia_semana: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 0, max: 6 }, // 0=Domingo, 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado
  },
  link: { type: DataTypes.STRING, defaultValue: "#" },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = Programa;
