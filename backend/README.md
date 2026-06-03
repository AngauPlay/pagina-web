# Backend — ANGAU PLAY

API REST para la plataforma de streaming ANGAU PLAY.

---

## Tecnologías

| Herramienta | Versión |
|-------------|---------|
| Node.js | — |
| Express | 5.x |
| Sequelize | 6.x |
| MySQL | (MariaDB 11.4) |
| Cloudinary | Images CDN |
| JWT | Autenticación |
| bcrypt | Hash de contraseñas |

---

## Estructura de directorios

```
backend/
├── main.js                      # Entry point
├── config/
│   ├── db.js                    # Conexión a MySQL
│   ├── cloudinaryNoticias.js    # Multer + Cloudinary (noticias)
│   ├── cloudinaryAgenda.js      # Multer + Cloudinary (agenda)
│   ├── cloudinaryProgramas.js   # Multer + Cloudinary (programas)
│   └── cloudinaryPublicidad.js  # Multer + Cloudinary (publicidad)
├── routes/
│   ├── authRoutes.js
│   ├── newsRoutes.js
│   ├── usersRoutes.js
│   ├── agendaRoutes.js
│   ├── programasRoutes.js
│   └── publicidadRoutes.js
├── controllers/
│   ├── authController.js
│   ├── newsController.js
│   ├── categoryController.js
│   ├── usersController.js
│   ├── agendaController.js
│   ├── programasController.js
│   └── publicidadController.js
├── models/
│   ├── Noticia.js
│   ├── NoticiaImagen.js
│   ├── Categoria.js
│   ├── Usuario.js
│   ├── Agenda.js
│   ├── Programa.js
│   └── Publicidad.js
├── middlewares/
│   └── authMiddleware.js
└── README.md
```

---

## Instalación y ejecución

```bash
# Instalar dependencias
pnpm install

# Configurar variables de entorno (.env en la raíz del proyecto)
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root_password
DB_NAME=angau
JWT_SECRET=tu_secreto
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Iniciar en desarrollo
pnpm dev

# Iniciar en producción
node main.js
```

El servidor arranca en `http://localhost:3000`.

---

## Base de datos

### Configuración

- **Motor:** MySQL
- **ORM:** Sequelize (sincronización automática al iniciar)
- **Timezone:** `-03:00` (Argentina)
- **Sync:** `sequelize.sync({alter: false})` — no modifica tablas existentes

### Esquema

#### `categorias`

| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | int(11) | PK, AUTO_INCREMENT |
| nombre | varchar(100) | NOT NULL |
| slug | varchar(100) | NOT NULL, UNIQUE |

#### `noticias`

| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | int(11) | PK, AUTO_INCREMENT |
| titulo | varchar(255) | NOT NULL |
| slug | varchar(255) | NOT NULL, UNIQUE |
| copete | text | NOT NULL |
| cuerpo | longtext | NOT NULL |
| imagen_url | varchar(255) | NOT NULL |
| fecha_publicacion | timestamp | DEFAULT CURRENT_TIMESTAMP |
| categoria_id | int(11) | FK → categorias(id) ON DELETE CASCADE |
| autor | varchar(100) | NOT NULL |
| estado | enum('borrador','publicado') | DEFAULT 'borrador' |

#### `noticias_imagenes`

| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | int(11) | PK, AUTO_INCREMENT |
| noticia_id | int(11) | FK → noticias(id) ON DELETE CASCADE |
| url | varchar(255) | NOT NULL |

#### `programas`

| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | int(11) | PK, AUTO_INCREMENT |
| nombre | varchar(255) | NOT NULL |
| hora_inicio | time | NOT NULL |
| hora_fin | time | NOT NULL |
| staff | varchar(255) | NULL |
| imagen_url | varchar(255) | NULL |
| dia_semana | int(11) | NOT NULL (0=Domingo, ..., 6=Sábado) |
| createdAt | datetime | NOT NULL |
| updatedAt | datetime | NOT NULL |

#### `Agenda`

| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | int(11) | PK, AUTO_INCREMENT |
| titulo | varchar(255) | NOT NULL |
| descripcion | text | NOT NULL |
| imagen_url | varchar(255) | NULL |
| fecha | date | NOT NULL |
| hora | time | NOT NULL |
| lugar | varchar(255) | NOT NULL |
| createdAt | datetime | NOT NULL |
| updatedAt | datetime | NOT NULL |

#### `usuarios`

| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | int(11) | PK, AUTO_INCREMENT |
| nombre | varchar(100) | NOT NULL, UNIQUE |
| password | varchar(255) | NOT NULL |
| rol | enum('admin','editor','redactor') | DEFAULT 'redactor' |

#### `publicidades`

| Columna | Tipo | Restricciones |
|---------|------|---------------|
| id | int(11) | PK, AUTO_INCREMENT |
| nombre | varchar(255) | NOT NULL |
| imagen_url | varchar(255) | NOT NULL |
| link_url | varchar(255) | NULL |
| ubicacion | enum('encabezado','lateral','intermedia') | DEFAULT 'lateral' |
| activo | tinyint(1) | DEFAULT 1 |
| createdAt | datetime | NOT NULL |
| updatedAt | datetime | NOT NULL |

---

## API Endpoints

### Noticias

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/noticias` | No | Lista paginada (`?page=N&limit=N`). Sin params devuelve todas |
| GET | `/noticias/detalle/:slug` | No | Noticia por slug (incluye galería de imágenes) |
| GET | `/noticias/categorias` | No | Lista de categorías |
| GET | `/noticias/por-categoria/:nombreCat` | No | Noticias filtradas por categoría |
| GET | `/noticias/:id` | No | Noticia por ID |
| POST | `/noticias/add` | Sí | Crear noticia (multipart: `portada` + `galeria[]`) |
| PUT | `/noticias/edit/:id` | Sí | Actualizar noticia (multipart) |
| DELETE | `/noticias/delete/:id` | Sí | Eliminar noticia (+ imágenes en Cloudinary) |

### Autenticación

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/auth/login` | No | Login. Body: `{nombre, password}`. Setea cookie `token_angau` |
| POST | `/auth/logout` | No | Logout. Limpia cookie |
| GET | `/auth/me` | Sí | Devuelve datos del usuario autenticado |

### Usuarios

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/usuarios` | Sí | Listar todos los usuarios |
| GET | `/usuarios/:id` | Sí | Usuario por ID |
| POST | `/usuarios` | Sí | Crear usuario. Body: `{nombre, password, rol}` |
| PUT | `/usuarios/:id` | Sí | Actualizar usuario |
| DELETE | `/usuarios/:id` | Sí | Eliminar usuario |

### Programación

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/programas` | No | Todos los programas ordenados por día y hora |
| GET | `/programas/hoy` | No | Próximos 3 programas del día actual (con hora_fin > ahora) |
| GET | `/programas/:id` | Sí | Programa por ID |
| POST | `/programas` | Sí | Crear programa (multipart: `imagen`) |
| PUT | `/programas/:id` | Sí | Actualizar programa (multipart: `imagen`) |
| DELETE | `/programas/:id` | Sí | Eliminar programa |

### Agenda

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/agenda` | No | Lista paginada (`?page=N&limit=N`). Sin params devuelve todos |
| GET | `/agenda/:id` | Sí | Evento por ID |
| POST | `/agenda/add` | Sí | Crear evento (multipart: `imagen`) |
| PUT | `/agenda/update/:id` | Sí | Actualizar evento (multipart: `imagen`) |
| DELETE | `/agenda/delete/:id` | Sí | Eliminar evento (+ imagen en Cloudinary) |

### Publicidad

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/publicidad` | No | Todas las publicidades |
| GET | `/publicidad/activa/:ubicacion` | No | Publicidades activas por ubicación (`encabezado`, `lateral`, `intermedia`) |
| POST | `/publicidad/add` | Sí | Crear publicidad (multipart: `imagen`) |
| DELETE | `/publicidad/:id` | Sí | Eliminar publicidad |

### Rutas especiales (en main.js)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/noticias-externas` | Obtener feed RSS de agenfor.com.ar |
| GET | `/rss` | Generar RSS XML con las últimas 20 noticias publicadas |

---

## Autenticación

- **Método:** JWT almacenado en cookie httpOnly (`token_angau`)
- **Expiración:** 8 horas
- **Cookie:** `httpOnly: true`, `secure: true` en producción, `sameSite: 'strict'`
- **Protección:** Rutas admin protegidas con middleware `authMiddleware.js`
- **Contraseñas:** Hash con bcrypt (10 rounds)

## Subida de imágenes

Todas las imágenes se suben a **Cloudinary** mediante **Multer** con almacenamiento en cloud.

| Recurso | Carpeta Cloudinary | Campo del formulario |
|---------|--------------------|---------------------|
| Noticias (portada) | `noticias` | `portada` (1 archivo) |
| Noticias (galería) | Subido a `noticias` | `galeria` (hasta 10 archivos) |
| Agenda | `agenda` | `imagen` (obligatoria al crear) |
| Programas | `programacion` | `imagen` |
| Publicidad | `promos` | `imagen` (obligatoria) |

### Formatos permitidos

`jpg`, `jpeg`, `png`, `webp`

### Limpieza

Al eliminar un recurso, se destruye la imagen correspondiente en Cloudinary usando `cloudinary.uploader.destroy()`.

---

## Paginación

Los endpoints `GET /noticias` y `GET /agenda` soportan paginación:

```http
GET /noticias?page=1&limit=30
```

**Respuesta:**
```json
{
  "data": [ ... ],
  "total": 150,
  "page": 1,
  "limit": 30,
  "totalPages": 5
}
```

Sin los query params `page` y `limit`, devuelven todos los registros (para compatibilidad con el panel admin).

---

## Manejo de errores

El servidor cuenta con un middleware global de errores al final de la cadena de middlewares. Todos los errores no capturados devuelven:

```json
{
  "error": "Error interno del servidor"
}
```

Las rutas que existen pero no coinciden devuelven la página `error.html`.

---

## Scripts disponibles

```bash
pnpm dev    # Inicia con nodo --watch (recarga automática)
pnpm test   # (no implementado)
```
