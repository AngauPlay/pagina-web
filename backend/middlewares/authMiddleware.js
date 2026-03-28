const { verify } = require("jsonwebtoken");

const verificarSessionJWT = (req, res, next) => {
  // Leemos la cookie llamada 'token_angau'
  const token = req.cookies.token_angau;

  if (!token) {
    return res
      .status(401)
      .json({ mensaje: "No autorizado, por favor iniciá sesión" });
  }

  try {
    const cifrado = verify(token, process.env.JWT_SECRET);
    req.usuario = cifrado;
    next();
  } catch (error) {
    res.clearCookie("token_angau");
    res.status(401).json({ mensaje: "Sesión expirada o inválida" });
  }
};
module.exports = verificarSessionJWT;
