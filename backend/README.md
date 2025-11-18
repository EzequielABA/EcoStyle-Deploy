# EcoStyle RD — Backend PHP/MySQL

Estructura lista para ejecutar en XAMPP o servidor local.

- `config/database.php`: conexión PDO a MySQL (ajusta host, db, usuario y contraseña).
- `api/productos.php`: endpoints REST (GET/POST/PUT/DELETE) con filtros por categoría, precio y disponibilidad.
- `api/usuarios.php`: endpoints para listar y registrar contactos (GET/POST).
- `public/index.php`: punto de entrada/estado de la API.
- `.htaccess`: reglas Apache y CORS.
- `sql/schema.sql`: script SQL para crear BD y tablas.

## Requisitos

- PHP 8.x
- MySQL/MariaDB (XAMPP funciona bien)
- Apache con `mod_rewrite` y `mod_headers` (para `.htaccess` y CORS)

## Instalación rápida (XAMPP)

1. Copia la carpeta `backend` dentro de tu `htdocs` de XAMPP.
2. Importa el script SQL:
   - Abre phpMyAdmin → crea la BD `ecostyle` o ejecuta `sql/schema.sql`.
   - Script: `backend/sql/schema.sql`.
3. Ajusta credenciales en `backend/config/database.php`:
   - Host: `localhost`
   - DB: `ecostyle`
   - Usuario: `root`
   - Contraseña: (vacía por defecto en XAMPP)
4. Inicia Apache y MySQL.

## Cómo ejecutar

- Opción A (XAMPP/Apache):
  - DocumentRoot: apunta a `backend` o `backend/public`.
  - Endpoints:
    - `http://localhost/api/productos.php`
    - `http://localhost/api/usuarios.php`
- Opción B (PHP embebido):
  - `php -S localhost:8000 -t backend/public`
  - Estado API: `http://localhost:8000`
  - Endpoints: `http://localhost:8000/api/productos.php`, `http://localhost:8000/api/usuarios.php`

## Esquema de base de datos

Consulta el archivo `sql/schema.sql`. Incluye:

- Tabla `productos`:
  - `id` (PK), `nombre`, `descripcion`, `categoria`, `precio` (DECIMAL), `disponible` (TINYINT 1/0), `imagen` (URL opcional)
- Tabla `usuarios`:
  - `id` (PK), `nombre`, `correo`, `mensaje`, `fecha` (timestamp)
- Índices para `categoria`, `disponible` y `precio`

## Filtros disponibles en Productos (GET)

- `categoria`: `Accesorios`, `Higiene`, `Limpieza`, etc.
- `precio_min`: número (ej. `10`)
- `precio_max`: número (ej. `50`)
- `disponible`: `1` o `0`
- `q`: búsqueda por nombre (substring)
- `sort`: `precio_asc`, `precio_desc`, `nombre_asc`, `nombre_desc` (por defecto `id DESC`)

Ejemplos:

- `GET /api/productos.php?categoria=Accesorios&precio_min=10&disponible=1`
- `GET /api/productos.php?q=bambu&sort=precio_desc`

## CORS

- `.htaccess` habilita CORS y métodos: `GET, POST, PUT, DELETE, OPTIONS`.
- Los endpoints también envían cabeceras CORS.

## Conexión desde el frontend

- Configura `VITE_API_BASE` (React/Vite):
  - `frontend/.env`: `VITE_API_BASE=http://localhost:8000` (o tu host)
- Endpoints consumidos:
  - Productos: `GET/POST/PUT/DELETE /api/productos.php`
  - Usuarios: `GET/POST /api/usuarios.php`

## Notas

- Todos los endpoints retornan JSON.
- Usa `Content-Type: application/json` en `POST/PUT`.
- Manejo de errores: HTTP `4xx/5xx` con payload `{ error: string }`.