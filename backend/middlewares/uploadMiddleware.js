const multer = require("multer");
const { diskStorage } = multer;
const { join, extname } = require("path");

// Configuración de almacenamiento
const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, join(__dirname, "../../frontend/assets/uploads"));
  },
  filename: (req, file, cb) => {
    // Renombramos: noticia-123456789.jpg (evita duplicados)
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + extname(file.originalname));
  },
});

// Filtro de archivos (solo imágenes)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Formato de imagen no válido. Solo JPG, PNG y WEBP."), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // Límite de 5MB
});

exports = module.exports = upload;
