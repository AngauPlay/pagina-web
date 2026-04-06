const express = require("express");
const router = express.Router();
const Programa = require("../models/Programa");
const { Op } = require("sequelize");
const { getProgramasHoy } = require("../controllers/programasController");

router.get("/hoy", getProgramasHoy);

module.exports = router;
