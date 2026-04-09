const express = require("express");
const { json, urlencoded } = require("express");
const { join } = require("path");
const RSS = require("rss");
const Parser = require("rss-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
dotenv.config({ path: join(__dirname, "../.env") });
// IMPORTANTE: Importar el objeto sequelize directamente
const sequelize = require("./config/db");

// Importar Rutas
const newsRoutes = require("./routes/newsRoutes");
// const authRoutes = require('./routes/authRoutes');
const authRoutes = require("./routes/authRoutes");
const Noticia = require("./models/Noticia");
const app = express();
const parser = new Parser();

// 1. Middlewares Globales
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
// 2. Servir Archivos Estáticos
app.use(express.static(join(__dirname, "../frontend")));
app.use(
  "/uploads",
  express.static(join(__dirname, "../frontend/assets/uploads")),
);

// Ruta para noticias externas (Agenfor)
app.get("/api/noticias-externas", async (req, res) => {
  try {
    let feed = await parser.parseURL("https://agenfor.com.ar/feed/");
    const noticias = feed.items.map((item) => ({
      titulo: item.title,
      link: item.link,
      fecha: item.pubDate,
      resumen: item.contentSnippet,
    }));
    res.json(noticias);
  } catch (error) {
    res.status(500).json({ error: "No se pudo obtener el feed" });
  }
});
app.use("/noticias", newsRoutes);
app.use("/auth", authRoutes);
app.use("/programas", require("./routes/programasRoutes"));
// Ruta para generar el RSS de Angau
app.get("/rss", async (req, res) => {
  const feed = new RSS({
    title: "Angau Play",
    description: "Las mejores noticias en tiempo real",
    feed_url: "https://angauplay.com.ar/rss",
    site_url: "https://angauplay.com.ar",
    language: "es",
  });

  try {
    // Buscamos las últimas 20 noticias publicadas
    const noticias = await Noticia.findAll({
      where: { estado: "publicado" },
      order: [["fecha_publicacion", "DESC"]],
      limit: 20,
    });

    // Las agregamos al feed una por una
    noticias.forEach((post) => {
      feed.item({
        title: post.titulo,
        description: post.copete,
        url: `https://angauplay.com.ar/noticia/${post.slug}`,
        author: post.autor,
        date: post.fecha_publicacion,
      });
    });

    res.set("Content-Type", "text/xml");
    res.send(feed.xml());
  } catch (error) {
    console.error("Error generando RSS:", error);
    res.status(500).send("Error al generar el feed");
  }
});

// 4. EL FALLBACK SIEMPRE AL FINAL DE LAS RUTAS
app.use("/noticias", (req, res) => {
  res.status(404).json({ error: "Endpoint de API no encontrado" });
});

app.get(/.*/, (req, res) => {
  // Si el usuario pide algo que no existe, mostramos tu nueva página de error
  res.status(404).sendFile(join(__dirname, "../frontend/error.html"));
});

// 5. Sincronizar Base de Datos y Arrancar Servidor
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Usamos sequelize.authenticate() y sequelize.sync() directamente
    await sequelize.authenticate();
    console.log(" Conexión a la base de datos establecida.");

    await sequelize.sync({ alter: false });

    app.listen(PORT, () => {
      console.log(` Servidor Angau corriendo en: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(" No se pudo conectar a la base de datos:", error);
  }
}

startServer();
