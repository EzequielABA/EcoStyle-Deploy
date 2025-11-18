# EcoStyle — Guía de Despliegue

Esta guía describe, paso a paso, cómo publicar EcoStyle en producción, qué variables configurar y cómo validar que todo funciona correctamente. Incluye ajustes recomendados para Nginx/Apache, base de datos y entorno.

## 1) Pre-requisitos
- `Node.js` LTS y `npm` instalados para construir el frontend.
- `PHP 8.2` con extensión `pdo_mysql` habilitada para el backend.
- Servidor web: Nginx o Apache.
- Base de datos MySQL accesible con credenciales de producción.

## 2) Arquitectura recomendada
- Frontend estático (build de Vite) servido por Nginx/Apache bajo el dominio público.
- Backend PHP servido bajo el mismo dominio (preferido) o un subdominio, idealmente con proxy inverso desde `/api/` hacia el backend.
- Evitar CORS sirviendo frontend y backend bajo el mismo dominio; si no es posible, configurar CORS en backend.

## 3) Variables de entorno y configuración
- Frontend: `frontend/.env.production`
  - `VITE_API_BASE` debe apuntar a la URL base pública del backend. Ejemplos:
    - Mismo dominio y proxy `/api/`: `VITE_API_BASE=https://ecostyle.example.com`
    - Backend propio: `VITE_API_BASE=https://api.ecostyle.example.com`
- Backend: `backend/config/database.php` (producción)
  - Configurar: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`.
- Vite base (opcional): si el sitio no irá en `/` (ej. `/tienda/`), ajustar `vite.config.js`:
  - `export default defineConfig({ base: '/tienda/', ... })`

## 4) Base de datos
- Importar el esquema desde `backend/database/ecostyle.sql` en el servidor de producción.
- Asegurar que `DB_NAME` en `backend/config/database.php` coincida con el nombre creado por el script (`ecostyle`).
- Crear usuario con permisos mínimos para la base de datos.
- Cargar datos iniciales: categorías, productos, imágenes.

## 5) Despliegue del Backend (PHP)
### 5.1 Apache
- Copiar el contenido de `backend/` bajo un VirtualHost o el document root seleccionado.
- Activar `AllowOverride All` para respetar reglas de `.htaccess`.
- Asegurar `php.ini` de producción: desactivar `display_errors`, habilitar `pdo_mysql`.
- El backend incluye `.htaccess` con:
  - CORS permitido.
  - Manejo de `OPTIONS` (preflight).
  - Permite acceso directo a `/api/*.php`.
  - Router principal (`backend/index.php`) para rutas amigables: `/productos`, `/categorias`, `/buscar`, `/contacto`, `/ordenes`, y también `/add_producto`.

### 5.2 Nginx (recomendado con proxy)
```
server {
  listen 80;
  server_name ecostyle.example.com;

  # Frontend estático
  root /var/www/ecostyle/frontend/dist;
  index index.html;

  # Proxy al backend PHP (sirviendo /api/ y rutas amigables)
  location /api/ {
    proxy_pass http://backend.internal:8080/api/;
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
    add_header Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With";
  }

  # Rutas amigables del backend (si se proxya también el router principal)
  location /productos { proxy_pass http://backend.internal:8080/productos; }
  location /categorias { proxy_pass http://backend.internal:8080/categorias; }
  location /buscar     { proxy_pass http://backend.internal:8080/buscar; }
  location /contacto   { proxy_pass http://backend.internal:8080/contacto; }
  location /ordenes    { proxy_pass http://backend.internal:8080/ordenes; }
  location /add_producto { proxy_pass http://backend.internal:8080/add_producto; }

  # SPA fallback
  location / {
    try_files $uri /index.html;
  }
}
```

## 6) Build y despliegue del Frontend
1. En el directorio `frontend/`, ejecutar:
   - `npm ci`
   - `npm run build`
2. Publicar el contenido de `frontend/dist/` en el servidor web.
3. Si se usa subruta (no `/`), configurar `base` en `vite.config.js` antes de compilar.
4. Confirmar que `VITE_API_BASE` apunta a la URL pública real del backend.

## 7) Verificación post-despliegue
- Navegar el sitio y validar:
  - Lista de productos: `GET /productos` o `GET /api/productos.php`.
  - Categorías: `GET /categorias` o `GET /api/categorias.php`.
  - Crear producto: `POST /add_producto` o `POST /api/add_producto.php`.
  - Checkout: `POST /ordenes` o `POST /api/ordenes.php` (respuesta esperada: `{ success: true, orden_id, numero_orden, total }`).
- En frontend, tras completar la orden:
  - Se muestra notificación de éxito con el código de orden.
  - Se navega a `/orden-confirmacion` mostrando el resumen tipo factura.
- En frontend, probar:
  - Página de Añadir Producto: crear un producto con/ sin `precio_oferta`.
  - Detalle y carrito muestran precios correctos.

## 8) Ajustes y recomendaciones de producción
- Misma URL para frontend y backend evita CORS.
- Si hay dominios distintos, mantener CORS activo en el backend y revisar proxy.
- Activar HTTPS con certificados válidos.
- Desactivar `display_errors` en producción; usar logs.
- Validar permisos de archivos y directorios en el servidor.

## 9) Troubleshooting
- Rutas SPA 404: configurar `try_files` (Nginx) o `RewriteRule` (Apache) para servir `index.html`.
- “Upgrade Required” en desarrollo: aparece por desajustes de HMR/WebSocket; en producción no aplica. En desarrollo, asegúrate de que Vite y HMR usen el mismo puerto.
- “Ruta no válida” en backend: el router (`backend/index.php`) devuelve ese mensaje si la ruta no existe. Validar que exista la entrada `'ordenes' => 'api/ordenes.php'` y que `.htaccess` esté habilitado.
- CORS bloqueado: revisar headers en backend y en el proxy (`Access-Control-Allow-*`).
- Conexión DB: validar credenciales en `backend/config/database.php` y acceso desde el host. Alinear `DB_NAME` con `ecostyle`.
- Datos incoherentes (`precio/cantidad`): confirmar normalización en frontend y tipos en la DB.

## 10) Rollback
- Mantener backups de `frontend/dist/` y de la base de datos.
- Ante fallos, restaurar la versión previa de `dist/` y, si aplica, recuperar la DB.

## 11) Checklist resumido
- Configurar `VITE_API_BASE` en `frontend/.env.production`.
- Configurar credenciales en `backend/config/database.php`.
- Importar esquema SQL y validar datos.
- Construir frontend (`npm ci && npm run build`) y publicar `dist/`.
- Configurar proxy `/api/` y rutas amigables en Nginx/Apache.
- Validar endpoints: productos, categorías, órdenes y creación de producto.
- Revisar CORS/HTTPS/logs y ajustar si es necesario.