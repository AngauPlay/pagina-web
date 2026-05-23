# ANGAU PLAY - Plataforma de Noticias y Medios

Plataforma de noticias en tiempo real con gestión de contenidos, programación de TV y streaming para la provincia de Formosa, Argentina.

---

## Índice

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Endpoints API](#-endpoints-api)
- [Scripts Disponibles](#-scripts-disponibles)
- [Desarrollo vs Producción](#-desarrollo-vs-producción)
- [Licencia](#-licencia)

---

## Características

### Frontend

- **Diseño Responsivo** - Optimizado para móviles y escritorio
- **Sistema de Noticias** - Visor de artículos con galería de imágenes
- **Programación TV** - Grilla de programación en vivo
- **Publicidad** - Gestión de banners y promociones
- **Panel de Administración** - CRUD completo de contenidos
- **Sistema de Categorías** - Filtrado de noticias por tema
- **Noticias Externas** - Integración con feed RSS de Agenfor

### Backend

- **API REST** - Endpoints JSON para el frontend
- **Autenticación JWT** - Sesiones seguras con cookies httpOnly
- **Gestión de Imágenes** - Cloudinary para almacenamiento de archivos
- **Base de datos MySQL** - Sequelize como ORM
- **RSS Feed** - Generación automática de feed para usuarios

---

## Tecnologías

| Capa               | Tecnología                                |
| ------------------ | ----------------------------------------- |
| **Frontend**       | HTML5, JavaScript (Vanilla), Tailwind CSS |
| **Backend**        | Node.js, Express.js                       |
| **Base de datos**  | MySQL / MariaDB, Sequelize                |
| **Almacenamiento** | Cloudinary (imágenes y medios)            |
| **Autenticación**  | JWT, bcrypt                               |
| **Contenedores**   | Docker, Docker Compose                    |

---

## Estructura del Proyecto

```
pagina-web/
├── backend/
│   ├── config/          # Configuraciones (DB, Cloudinary)
│   ├── controllers/      # Lógica de negocio
│   ├── middlewares/     # Middlewares (auth)
│   ├── models/          # Modelos de Sequelize
│   ├── routes/          # Rutas de la API
│   ├── main.js          # Punto de entrada del servidor
│   └── package.json     # Dependencias Node
│
├── frontend/
│   ├── js/              # Scripts JavaScript
│   ├── assets/          # Imágenes y recursos estáticos
│   ├── index.html      # Página principal
│   ├── admin.html      # Panel de administración
│   ├── articulo.html   # Detalle de noticia
│   ├── categoria.html  # Noticias por categoría
│   ├── login.html      # Inicio de sesión
│   └── register.html   # Registro de usuarios
│
├── docker-compose.yml  # Servicios Docker (DB, PHPMyAdmin)
├── init.sql           # Schema inicial de la base de datos
├── .env               # Variables de entorno (no incluir en git)
├── .gitignore         # Archivos ignorados por git
└── README.md          # Este archivo
```

---

## Requisitos

### Desarrollo Local

- **Node.js** 18.x o superior
- **npm** o **pnpm**
- **MySQL** 8.0+ o **MariaDB** 10.x
- **Docker** (opcional, para base de datos)

### Producción

- **VPS** con Ubuntu 20.04+ o AlmaLinux 9
- **2 vCPU** / **2 GB RAM** mínimo
- **20 GB** almacenamiento SSD/NVMe
- **Dominio** con SSL (Let's Encrypt)

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone <url-repositorio>
cd pagina-web
```

### 2. Instalar dependencias del backend

```bash
cd backend
npm install
# o con pnpm
pnpm install
```

### 3. Configurar variables de entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root_password
DB_NAME=angau

# Autenticación
JWT_SECRET=tu_clave_secreta_muy_larga
COOKIE_SECRET=otra_clave_para_cookies

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### 4. Iniciar base de datos (Docker)

```bash
docker-compose up -d
```

### 5. Iniciar el servidor

```bash
# Desarrollo (con watch)
npm run dev

# Producción
npm start
```

El servidor estará disponible en: `http://localhost:3000`

---

## Endpoints API

### Noticias

| Método | Endpoint                          | Descripción                         |
| ------ | --------------------------------- | ----------------------------------- |
| GET    | `/noticias`                       | Listar todas las noticias           |
| GET    | `/noticias/categorias`            | Listar categorías                   |
| GET    | `/noticias/por-categoria/:nombre` | Noticias por categoría              |
| GET    | `/noticias/detalle/:slug`         | Detalle de noticia por slug         |
| GET    | `/noticias/:id`                   | Obtener noticia por ID              |
| POST   | `/noticias/add`                   | Crear noticia (auth requerido)      |
| PUT    | `/noticias/edit/:id`              | Actualizar noticia (auth requerido) |
| DELETE | `/noticias/delete/:id`            | Eliminar noticia (auth requerido)   |

### Autenticación

| Método | Endpoint       | Descripción             |
| ------ | -------------- | ----------------------- |
| POST   | `/auth/login`  | Iniciar sesión          |
| POST   | `/auth/logout` | Cerrar sesión           |
| GET    | `/auth/me`     | Verificar sesión actual |

### Usuarios

| Método | Endpoint        | Descripción                |
| ------ | --------------- | -------------------------- |
| GET    | `/usuarios`     | Listar usuarios (admin)    |
| POST   | `/usuarios`     | Crear usuario (admin)      |
| PUT    | `/usuarios/:id` | Actualizar usuario (admin) |
| DELETE | `/usuarios/:id` | Eliminar usuario (admin)   |

### Programación

| Método | Endpoint         | Descripción                 |
| ------ | ---------------- | --------------------------- |
| GET    | `/programas`     | Listar programas            |
| GET    | `/programas/hoy` | Programación del día        |
| POST   | `/programas`     | Crear programa (admin)      |
| PUT    | `/programas/:id` | Actualizar programa (admin) |
| DELETE | `/programas/:id` | Eliminar programa (admin)   |

### Publicidad

| Método | Endpoint                        | Descripción                        |
| ------ | ------------------------------- | ---------------------------------- |
| GET    | `/publicidad`                   | Listar publicidades                |
| GET    | `/publicidad/activa/:ubicacion` | Publicidades activas por ubicación |
| POST   | `/publicidad/add`               | Crear publicidad (admin)           |
| DELETE | `/publicidad/:id`               | Eliminar publicidad (admin)        |

### Agenda

| Método | Endpoint             | Descripción               |
| ------ | -------------------- | ------------------------- |
| GET    | `/agenda`            | Listar eventos            |
| POST   | `/agenda/add`        | Crear evento (admin)      |
| PUT    | `/agenda/update/:id` | Actualizar evento (admin) |
| DELETE | `/agenda/delete/:id` | Eliminar evento (admin)   |

### Externos

| Método | Endpoint                 | Descripción        |
| ------ | ------------------------ | ------------------ |
| GET    | `/api/noticias-externas` | Feed de Agenfor    |
| GET    | `/rss`                   | Feed RSS del sitio |

---

## Scripts Disponibles

### Backend

```bash
npm run dev    # Iniciar en modo desarrollo (con watch)
npm start      # Iniciar en producción
npm test       # Ejecutar tests (no configurado)
```

---

## Desarrollo vs Producción

### Desarrollo

- `NODE_ENV=development`
- Errores detallados en consola
- Servidor reinicia automáticamente con cambios

### Producción

- `NODE_ENV=production`
- Configurar SSL/TLS
- Usar PM2 para gestión del proceso
- Configurar Nginx como proxy inverso
- Implementar rate limiting

---

## Licencia

MIT License - Proyecto desarrollado para ANGAU Play Formosa, Argentina.

---

## Autor

Desarrollado por el equipo de ANGAU Play. Para consultas, contactar al administrador del sistema.
