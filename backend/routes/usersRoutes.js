const {Router} = require("express");
const auth = require("../middlewares/authMiddleware");
const userController = require("../controllers/usersController");

const router = Router();
const {createUser, updateUser, deleteUser, getAllUsers, getUserById} =
	userController;

// Rutas para gestión de usuarios (Admin)
router.post("/", auth, createUser); // Ruta para crear un nuevo usuario (Admin)
router.put("/:id", auth, updateUser); // Ruta para actualizar un usuario por ID (Admin)
router.delete("/:id", auth, deleteUser); // Ruta para eliminar un usuario por ID (Admin)
router.get("/", auth, getAllUsers); // Ruta para obtener todos los usuarios (Admin)
router.get("/:id", auth, getUserById); // Ruta para obtener un usuario por ID (Admin)
module.exports = router;
