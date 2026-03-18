const { Usuario, create } = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const { genSalt, hash } = bcrypt;
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const usuario = await Usuario.findOne({ where: { email } });

      if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
        return res.status(401).json({ mensaje: "Credenciales inválidas" });
      }

      const token = jwt.sign(
        { id: usuario.id, rol: usuario.rol },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }, // 1 día de sesión
      );

      // Enviamos el token en una Cookie
      res.cookie("token_angau", token, {
        httpOnly: true, // No accesible por JS (Seguridad total)
        secure: process.env.NODE_ENV === "production", // Solo HTTPS en DonWeb
        sameSite: "strict", // Previene ataques CSRF
        maxAge: 24 * 60 * 60 * 1000, // 1 día en milisegundos
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
      const { nombre, email, password, rol } = req.body;

      // Hashear la contraseña antes de guardarla
      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);

      const nuevoUsuario = await create({
        nombre,
        email,
        password: hashedPassword,
        rol: rol || "redactor",
      });

      res.status(201).json({ mensaje: "Usuario creado", id: nuevoUsuario.id });
    } catch (error) {
      res.status(400).json({ error: "El email ya existe o datos inválidos" });
    }
  },
};

exports = module.exports = authController;
