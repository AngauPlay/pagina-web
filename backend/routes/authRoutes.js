const { Router } = require("express");
const verificarSesionJWT = require("../middlewares/authMiddleware");
const auth = require("../middlewares/authMiddleware");

const router = Router();
const { login, logout, session } = require("../controllers/authController");

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", verificarSesionJWT, session);

module.exports = router;
