const express = require("express");
const router = express.Router();
const programasController = require("../controllers/programasController");

router.get("/hoy", programasController.getProgramasHoy);
router.get("/", programasController.getAllProgramas);
router.post("/", programasController.savePrograma);
router.delete("/:id", programasController.deletePrograma);

module.exports = router;
