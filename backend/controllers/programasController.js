const Programa = require("../models/Programa");
const {Op} = require("sequelize");

const getProgramasHoy = async (req, res) => {
	try {
		const ahora = new Date();
		const hoy = ahora.getDay();
		// Usamos formato HH:mm:ss para comparar correctamente con la DB
		const horaActual = ahora.toLocaleTimeString("en-GB", {hour12: false});

		const programas = await Programa.findAll({
			where: {
				dia_semana: hoy,
				hora_fin: {
					[Op.gt]: horaActual,
				},
			},
			order: [["hora_inicio", "ASC"]],
			limit: 3,
		});

		res.json(programas);
	} catch (error) {
		console.error(error);
		res.status(500).json({error: "Error al obtener programas del día"});
	}
};
// Obtener un programa específico por su ID
const getProgramasForId = async (req, res) => {
	try {
		const {id} = req.params;
		const programa = await Programa.findByPk(id);

		if (!programa) {
			return res.status(404).json({message: "Programa no encontrado"});
		}

		res.json(programa);
	} catch (error) {
		console.error("Error al obtener programa por ID:", error);
		res.status(500).json({error: "Error al obtener programa por ID"});
	}
};

const savePrograma = async (req, res) => {
	let {nombre, hora_inicio, hora_fin, staff, dia_semana, imagen_url} = req.body;

	// La URL de la imagen vendrá en req.file gracias a Multer
	const imagenUrl = req.file ? req.file.path : null;
	// Normalizar formato de hora si viene en el body (HH:mm -> HH:mm:00)
	if (hora_inicio && hora_inicio.length === 5) {
		hora_inicio = `${hora_inicio}:00`;
	}
	if (hora_fin && hora_fin.length === 5) {
		hora_fin = `${hora_fin}:00`;
	}
	try {
		if (req.files && req.files["programa_imagen"]) {
			const result = await cloudinary.uploader.upload(
				req.files["programa_imagen"][0].path,
				{
					folder: "angau_play/programas",
				},
			);
			imagenUrl = result.secure_url;
			await fs.unlink(req.files["programa_imagen"][0].path); // Limpiar temp
		}

		const nuevoPrograma = await Programa.create({
			nombre,
			hora_inicio,
			hora_fin,
			staff,
			dia_semana: parseInt(dia_semana),
			imagen_url: imagenUrl, // Guardamos la URL de Cloudinary
		});

		res.status(201).json(nuevoPrograma);
	} catch (error) {
		res.status(400).json({error: error.message});
	}
};

const deletePrograma = async (req, res) => {
	try {
		const {id} = req.params;
		const programa = await Programa.findByPk(id);

		if (!programa) {
			return res.status(404).json({message: "Programa no encontrado"});
		}

		const imagenUrl = programa.imagen_url;
		if (programa.imagen_url) {
			const publicId = programa.imagen_url.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(`angau_play/programas/${publicId}`);
		}

		const eliminado = await Programa.destroy({where: {id}});

		if (!eliminado) {
			return res.status(404).json({message: "Programa no encontrado"});
		}

		res.json({message: "Programa eliminado correctamente"});
	} catch (error) {
		res.status(500).json({error: "No se pudo eliminar el programa"});
	}
};

const getAllProgramas = async (req, res) => {
	try {
		const programas = await Programa.findAll({
			order: [
				["dia_semana", "ASC"],
				["hora_inicio", "ASC"],
			],
		});
		res.json(programas);
	} catch (error) {
		res.status(500).json({error: "Error al obtener la lista de programas"});
	}
};

const updatePrograma = async (req, res) => {
	try {
		const {id} = req.params;
		let {nombre, hora_inicio, hora_fin, staff, dia_semana, imagen_url} =
			req.body;

		// 1. Buscar si el programa existe
		const programa = await Programa.findByPk(id);
		if (!programa) {
			return res.status(404).json({message: "Programa no encontrado"});
		}
		const nuevaImagenUrl = req.file ? req.file.path : programa.imagen_url;
		// 2. Normalizar formato de hora si viene en el body (HH:mm -> HH:mm:00)
		if (hora_inicio && hora_inicio.length === 5) {
			hora_inicio = `${hora_inicio}:00`;
		}
		if (hora_fin && hora_fin.length === 5) {
			hora_fin = `${hora_fin}:00`;
		}

		// 3. Actualizar
		await programa.update({
			nombre: nombre || programa.nombre,
			hora_inicio: hora_inicio || programa.hora_inicio,
			hora_fin: hora_fin || programa.hora_fin,
			staff: staff || programa.staff,
			dia_semana:
				dia_semana !== undefined ? parseInt(dia_semana) : programa.dia_semana,
			imagen_url: nuevaImagenUrl, // <--- Se actualiza aquí
		});

		res.json({message: "Actualizado", programa});
	} catch (error) {
		res.status(400).json({error: error.message});
	}
};

module.exports = {
	getProgramasHoy,
	savePrograma,
	deletePrograma,
	getAllProgramas,
	updatePrograma,
	getProgramasForId,
};
