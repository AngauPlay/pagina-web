const cloudinary = require("cloudinary").v2;
const {CloudinaryStorage} = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: "programacion", // Carpeta principal
		allowed_formats: ["jpg", "png", "jpeg", "webp"],
	},
});

// ✅ Exportamos un objeto con las dos piezas clave
module.exports = {
	cloudinary, // Para borrar fotos (cloudinary.uploader.destroy)
	upload: multer({storage}), // El middleware para las rutas
};
