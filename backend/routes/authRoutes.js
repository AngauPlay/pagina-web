const { Router } = require("express");

const router = Router();
import { login, register } from "../controllers/authController";

router.post("/login", login);
router.post("/register", register);

exports = module.exports = router;
