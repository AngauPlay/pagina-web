const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const Parser = require("rss-parser");
require("dotenv").config(); // Para leer las credenciales del .env

const app = express();
const PORT = process.env.PORT || 3000;
const parser = new Parser();

// 1. Configuración de la conexión a la Base de Datos (DonWeb)
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Error conectando a la base de datos:", err);
    return;
  }
  console.log("Conectado a la base de datos");
});

// 2. Middlewares
app.use(express.json()); // Para recibir datos en formato JSON
// Servimos la carpeta frontend para que sea accesible desde el navegador
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/api/noticias-externas", async (req, res) => {
  try {
    let feed = await parser.parseURL("https://agenfor.com.ar/feed/");

    // Devolvemos solo lo que nos interesa
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

app.get("/rss", (req, res) => {
  const feed = new RSS({
    title: "Angau Play",
    description: "Las mejores noticias en tiempo real",
    feed_url: "https://angauplay.com.ar/rss",
    site_url: "https://angauplay.com.ar",
  });

  // Consultamos la base de datos
  db.query(
    "SELECT * FROM noticias ORDER BY fecha DESC LIMIT 20",
    (err, results) => {
      if (err) return res.status(500).send("Error");

      results.forEach((n) => {
        feed.item({
          title: n.titulo,
          description: n.copete,
          url: `https://angauplay.com.ar/noticia/${n.id}`,
          date: n.fecha,
        });
      });

      res.set("Content-Type", "text/xml");
      res.send(feed.xml());
    },
  );
});
// 3. Rutas de la API de Noticias
// Obtener todas las noticias
app.get("/api/noticias", (req, res) => {
  const query = "SELECT * FROM noticias ORDER BY fecha DESC";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Obtener una noticia específica por ID
app.get("/api/noticias/:id", (req, res) => {
  const query = "SELECT * FROM noticias WHERE id = ?";
  db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result[0]);
  });
});

// 4. Manejo de rutas del Frontend (SPA)
// Si el usuario entra a una ruta que no es de la API, le enviamos el index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// 5. Iniciar Servidor
app.listen(PORT, () => {
  console.log(`Servidor de noticias corriendo en puerto ${PORT}`);
});
