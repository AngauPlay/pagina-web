const {Sequelize} = require("sequelize");

// Creamos la conexión usando las variables del .env
const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASSWORD,
	{
		host: process.env.DB_HOST,
		dialect: "mysql",
		timezone: "-03:00",
		dialectOptions: {
			dateStrings: true,
			typeCast: true,
		},
		logging: false,
		define: {
			timestamps: false,
		},
	},
);

// Probar la conexión
sequelize
	.authenticate()
	.then(() => console.log(" Conectado a la base de datos de Angau"))
	.catch((err) => console.error(" Error de conexión a la DB:", err));

module.exports = sequelize;
