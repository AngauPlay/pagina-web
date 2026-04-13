const { Router } = require("express");
const verificarSesionJWT = require("../middlewares/authMiddleware");
const auth = require("../middlewares/authMiddleware");

const router = Router();
const {
  login,
  register,
  logout,
  session,
  getAllUsers,
  getUserById,
} = require("../controllers/authController");

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/me", verificarSesionJWT, session);

// Rutas para gestión de usuarios (Admin)
router.get("/usuarios", auth, getAllUsers); // Ruta para obtener todos los usuarios (Admin)
router.get("/usuarios/:id", auth, getUserById); // Ruta para obtener un usuario por ID (Admin)

module.exports = router;
