const { Usuario, create } = require("../models/Usuario");
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
        { expiresIn: "8h" }, // 8 horas de sesión
      );

      // Enviamos el token en una Cookie
      res.cookie("token_angau", token, {
        httpOnly: true, // No accesible por JS (Seguridad total)
        secure: process.env.NODE_ENV === "production", // Solo HTTPS
        sameSite: "strict", // Previene ataques CSRF
        maxAge: 8 * 60 * 60 * 1000, // 8 horas en milisegundos
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

  // Registro (Solo para crear el primer usuario o si sos Admin)
  register: async (req, res) => {
    try {
      const { nombre, password, rol } = req.body;

      // Hashear la contraseña antes de guardarla
      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);

      const nuevoUsuario = await create({
        nombre,
        password: hashedPassword,
        rol: rol,
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
    if (req.usuario) {
      res.json({ usuario: req.usuario });
    } else {
      res.status(401).json({ mensaje: "No autenticado" });
    }
  },
  getUserById: async (id) => {
    try {
      const usuario = await Usuario.findByPk(id);
      return usuario;
    } catch (error) {
      throw new Error("Error al obtener usuario por ID");
    }
  },
  getAllUsers: async () => {
    try {
      const usuarios = await Usuario.findAll({
        attributes: ["id", "nombre", "rol"], // Solo campos públicos
      });
      return usuarios;
    } catch (error) {
      throw new Error("Error al obtener lista de usuarios");
    }
  },
};

module.exports = authController;
