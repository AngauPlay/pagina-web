const express = require("express");
const router = express.Router();
const Publicidad = require("../models/Publicidad");
const upload = require("../middlewares/uploadPublicidad");
const auth = require("../middlewares/authMiddleware"); // Tu middleware de sesión
const publicidadController = require("../controllers/publicidadController");
// Obtener todas las publicidades (para el panel admin)
router.get("/", publicidadController.getAll);

// Obtener solo publicidades activas para un lugar específico (para la web pública)
router.get("/activa/:ubicacion", publicidadController.getActiva);

// Agregar nueva publicidad
router.post("/add", auth, upload.single("imagen"), publicidadController.add);

// Eliminar o desactivar
router.delete("/:id", auth, publicidadController.delete);

module.exports = router;
