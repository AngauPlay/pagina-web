const {Router} = require("express");
const router = Router();
const newsController = require("../controllers/newsController");
const categoryController = require("../controllers/categoryController");

// Middlewares
const auth = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const uploadFields = upload.fields([
	{name: "portada", maxCount: 1}, // Coincide con name="portada"
	{name: "galeria", maxCount: 10}, // Coincide con name="galeria"
]);
// --- RUTAS PÚBLICAS (Lectores) ---
router.get("/", newsController.getAll);

router.get("/detalle/:slug", newsController.getBySlug);
router.get("/categorias", categoryController.listAll);
router.get("/por-categoria/:nombreCat", newsController.getByCategory);
router.get("/:id", newsController.getById);
// --- RUTAS PRIVADAS (Panel Admin) ---
// Usamos .post("/") o .post("/add") pero siempre con los middlewares
router.post(
	"/add",
	auth, // 1. Verifica que sea Admin
	uploadFields, // 2. Procesa la foto (Multer)
	newsController.create, // 3. Guarda en DB y sube a Cloudinary
);

router.put(
	"/edit/:id",
	auth,
	uploadFields, // Para manejar tanto portada como galería
	newsController.update, // Controlador que maneja la actualización
);
router.delete("/delete/:id", auth, newsController.delete);
module.exports = router;
