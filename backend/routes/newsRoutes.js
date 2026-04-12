const { Router } = require("express");
const router = Router();
const newsController = require("../controllers/newsController");
const categoryController = require("../controllers/categoryController");

// Middlewares
const auth = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// --- RUTAS PÚBLICAS (Lectores) ---
router.get("/", newsController.getAll);
router.get("/:id", newsController.getById);
router.get("/detalle/:slug", newsController.getBySlug);
router.get("/categorias", categoryController.listAll);
router.get("/por-categoria/:nombreCat", newsController.getByCategory);
// --- RUTAS PRIVADAS (Panel Admin) ---
// Usamos .post("/") o .post("/add") pero siempre con los middlewares
router.post(
  "/add",
  auth, // 1. Verifica que sea Admin
  upload.single("imagen"), // 2. Procesa la foto (Multer)
  newsController.create, // 3. Guarda en DB y sube a Cloudinary
);

router.put(
  "/edit/:id",
  auth,
  upload.single("imagen"), // Por si quiere cambiar la foto
  newsController.update,
);

module.exports = router;
