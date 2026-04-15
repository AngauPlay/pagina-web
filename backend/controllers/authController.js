const { Usuario } = require("../models/Usuario"); // Importación corregida
const bcrypt = require("bcrypt");
const { genSalt, hash } = bcrypt;
const jwt = require("jsonwebtoken");

const authController = {
  login: async (req, res) => {
    try {
      const { nombre, password } = req.body;
      const usuario = await Usuario.findOne({ where: { nombre } });

      if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
        return res.status(401).json({ mensaje: "Credenciales inválidas" });
      }

      const token = jwt.sign(
        { id: usuario.id, rol: usuario.rol },
        process.env.JWT_SECRET,
        { expiresIn: "8h" },
      );

      res.cookie("token_angau", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 8 * 60 * 60 * 1000,
      });

      res.json({
        mensaje: "Bienvenido a Angau",
        usuario: { nombre: usuario.nombre, rol: usuario.rol },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  logout: (req, res) => {
    res.clearCookie("token_angau");
    res.json({ mensaje: "Sesión cerrada" });
  },

  register: async (req, res) => {
    try {
      const { nombre, password, rol } = req.body;

      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);

      // Usamos Usuario.create en lugar de create solo
      const nuevoUsuario = await Usuario.create({
        nombre,
        password: hashedPassword,
        rol: rol || "user", // Rol por defecto si no viene en el body
      });

      res.status(201).json({ mensaje: "Usuario creado", id: nuevoUsuario.id });
    } catch (error) {
      res.status(400).json({
        error: "El nombre de usuario ya existe o datos inválidos",
        detalle: error.message,
      });
    }
  },

  session: (req, res) => {
    // Esto asume que tienes un middleware que decodifica el token y llena req.usuario
    if (req.usuario) {
      res.json({ usuario: req.usuario });
    } else {
      res.status(401).json({ mensaje: "No autenticado" });
    }
  },

  // Estos métodos parecen ser funciones de utilidad, asegúrate de llamarlos correctamente
  getUserById: async (id) => {
    try {
      return await Usuario.findByPk(id, {
        attributes: ["id", "nombre", "rol"],
      });
    } catch (error) {
      throw new Error("Error al obtener usuario por ID");
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
      if (res) return res.status(500).json({ error: error.message });
      throw new Error("Error al obtener lista de usuarios");
    }
  },
};

module.exports = authController;
