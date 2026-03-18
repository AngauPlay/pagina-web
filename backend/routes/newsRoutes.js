const { Router } = require("express");
const newsController = require("../controllers/newsController");
const router = Router();
const categoryController = require("../controllers/categoryController");

const { getAll, getBySlug, create, update } = newsController;
const { listAll } = categoryController;
const auth = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// 'imagen' es el nombre del campo en el formulario HTML
router.post("/admin/add", auth, upload.single("imagen"), newsController.create);
// Rutas para los lectores (Públicas)
router.get("/", getAll);
router.get("/detalle/:slug", getBySlug);

// Rutas para el panel (Privadas - Admin)
router.post("/add", create);
router.put("/edit/:id", update);

exports = module.exports = router;
