const express = require("express");
const router = express.Router();
const programasController = require("../controllers/programasController");

const auth = require("../middlewares/authMiddleware");
// Ruta para obtener programas del día
router.get("/hoy", programasController.getProgramasHoy);

// Rutas para gestión de programas (Admin)
router.get("/", auth, programasController.getAllProgramas);
router.get("/:id", auth, programasController.getProgramasForId);
router.post("/", auth, programasController.savePrograma);
router.put("/:id", auth, programasController.updatePrograma);
router.delete("/:id", auth, programasController.deletePrograma);

module.exports = router;
