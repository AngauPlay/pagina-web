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
		folder: "noticias",
		allowed_formats: ["jpg", "png", "jpeg"],
	},
});

// Exportamos un objeto con ambas herramientas
module.exports = {
	cloudinary, // Se usa en el controlador para borrar (destroy)
	upload: multer({storage}), // Se usa en la ruta para recibir archivos
};
