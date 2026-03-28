const { Router } = require("express");
const verificarSesionJWT = require("../middlewares/authMiddleware");

const router = Router();
const {
  login,
  register,
  logout,
  session,
} = require("../controllers/authController");

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/me", verificarSesionJWT, session);
module.exports = router;
