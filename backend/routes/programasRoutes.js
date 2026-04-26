const express = require("express");
const router = express.Router();
const programasController = require("../controllers/programasController");

const multer = require("multer");
const {upload} = require("../config/cloudinaryProgramas");

const auth = require("../middlewares/authMiddleware");

// Ruta para obtener programas del día
router.get("/hoy", programasController.getProgramasHoy);

// Rutas para gestión de programas (Admin)
router.get("/", programasController.getAllProgramas);

// Traer un programa por ID (puse auth si lo requieres)
router.get("/:id", auth, programasController.getProgramasForId);

router.post(
	"/",
	auth,
	upload.single("imagen"),
	programasController.savePrograma,
);

router.put(
	"/:id",
	auth,
	upload.single("imagen"),
	programasController.updatePrograma,
);

router.delete("/:id", auth, programasController.deletePrograma);

module.exports = router;
