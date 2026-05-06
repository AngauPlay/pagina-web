const {Router} = require("express");
const router = Router();
const {upload} = require("../config/cloudinaryAgenda");
const agendaController = require("../controllers/agendaController");
// Middlewares
const auth = require("../middlewares/authMiddleware");
const uploadSingle = upload.single("imagen");
// --- RUTAS PÚBLICAS (Lectores) ---
router.get("/", agendaController.listEvents);
// --- RUTAS PRIVADAS (Panel Admin) ---
router.post("/add", auth, uploadSingle, agendaController.createEvent);
router.get("/:id", auth, agendaController.getEventById);
router.put("/update/:id", auth, uploadSingle, agendaController.updateEvent);
router.delete("/delete/:id", auth, agendaController.deleteEvent);
module.exports = router;
