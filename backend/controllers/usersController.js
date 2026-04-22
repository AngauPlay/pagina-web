const {Usuario} = require("../models/Usuario");
const bcrypt = require("bcrypt");
const {genSalt, hash} = bcrypt;

const usersController = {
	createUser: async (req, res) => {
		try {
			const {nombre, password, rol} = req.body;

			const salt = await genSalt(10);
			const hashedPassword = await hash(password, salt);

			// Usamos Usuario.create en lugar de create solo
			const nuevoUsuario = await Usuario.create({
				nombre,
				password: hashedPassword,
				rol: rol,
			});

			res.status(201).json({mensaje: "Usuario creado", id: nuevoUsuario.id});
		} catch (error) {
			res.status(400).json({
				error: "El nombre de usuario ya existe o datos inválidos",
				detalle: error.message,
			});
		}
	},
	updateUser: async (req, res) => {
		try {
			const {id} = req.params;
			const {nombre, rol} = req.body;

			const usuario = await Usuario.findByPk(id);
			if (!usuario) {
				return res.status(404).json({mensaje: "Usuario no encontrado"});
			}

			await usuario.update({nombre, rol});
			res.json({mensaje: "Usuario actualizado", usuario});
		} catch (error) {
			res.status(500).json({error: error.message});
		}
	},

	deleteUser: async (req, res) => {
		try {
			const {id} = req.params;
			const usuario = await Usuario.findByPk(id);
			if (!usuario) {
				return res.status(404).json({mensaje: "Usuario no encontrado"});
			}
			await usuario.destroy();
			res.json({mensaje: "Usuario eliminado"});
		} catch (error) {
			res.status(500).json({error: error.message});
		}
	},

	// Estos métodos parecen ser funciones de utilidad, asegúrate de llamarlos correctamente
	// usersController.js
	getUserById: async (req, res) => {
		try {
			const {id} = req.params;

			// Validación rápida: ¿el ID es un número?
			if (isNaN(id)) {
				return res.status(400).json({mensaje: "ID inválido"});
			}

			const usuario = await Usuario.findByPk(id, {
				attributes: ["id", "nombre", "rol"],
			});

			if (!usuario) {
				return res.status(404).json({mensaje: "Usuario no existe"});
			}

			res.json(usuario);
		} catch (error) {
			console.error("ERROR REAL:", error); // Esto te dirá la verdad en la terminal
			res.status(500).json({mensaje: "Error al obtener usuario por ID"});
		}
	},

	getAllUsers: async (req, res) => {
		try {
			const usuarios = await Usuario.findAll({
				attributes: ["id", "nombre", "rol"],
			});
			// Si esto se usa como ruta, necesita enviar respuesta
			if (res) return res.json(usuarios);
			return usuarios;
		} catch (error) {
			if (res) return res.status(500).json({error: error.message});
			throw new Error("Error al obtener lista de usuarios");
		}
	},
};

module.exports = usersController;
