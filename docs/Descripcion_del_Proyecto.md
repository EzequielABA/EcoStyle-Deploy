# EcoStyle — Descripción del Proyecto

## Resumen
EcoStyle es una aplicación e-commerce enfocada en productos sostenibles. Permite a los usuarios navegar el catálogo, gestionar un carrito persistente, y completar un pedido mediante un flujo de checkout sencillo y seguro.

## Objetivos
- Ofrecer una experiencia de compra fluida y clara.
- Facilitar la gestión del carrito y la persistencia de datos.
- Integrar un backend robusto para consulta de productos y creación de órdenes.

## Alcance
- Frontend SPA con React y Vite.
- Backend REST con PHP 8 y PDO MySQL.
- Persistencia de carrito en `localStorage`.
- Creación de órdenes con validaciones de stock y datos del cliente.

## Arquitectura
- Frontend: React (`vite`), `react-router-dom` para rutas, Context API para estado del carrito, estilos modulares.
- Backend: PHP 8.2, `PDO` MySQL, endpoints REST en `backend/api/*.php` con CORS habilitado.
- Base de datos: MySQL (`ecostyle`), conexión vía `backend/config/database.php` (host `127.0.0.1:3307`).

## Principales funcionalidades
- Catálogo de productos, búsqueda y categorías.
- Carrito persistente: añadir, eliminar y ajustar cantidades.
- Resumen de pedido con totales y envío.
- Checkout con validaciones y creación de orden (API `ordenes.php`).

## Estructura del repositorio (resumen)
- `frontend/`: SPA React, Vite, rutas y páginas (`src/pages`), contexto de carrito (`src/contexts/CartContext.jsx`).
- `backend/`: API PHP (productos, categorías, búsqueda, ordenes, usuarios), conexión DB, modelos y `public`.
- `database/`: dumps SQL.

## Endpoints backend relevantes
- `api/productos.php`: listado y detalle de productos.
- `api/categorias.php`: listado de categorías.
- `api/buscar.php`: búsqueda.
- `api/ordenes.php`: creación de órdenes y consulta limitada.
- `api/usuarios.php` y `api/contacto.php`: gestión de usuarios y contacto (según implementación).

## Variables de entorno (frontend)
- `.env.development` y `.env.production`: config del `API_BASE_URL` (si aplica). Por defecto se utiliza `http://localhost:8080/` según los servicios.

## Estados y persistencia
- El carrito se almacena en `localStorage` bajo la clave `ecostyle-cart`.
- Se normalizan campos `cantidad` y `precio` para mantener compatibilidad con datos antiguos (`quantity`, `price`).

## Flujo de orden
1. Usuario ajusta cantidades y revisa el resumen de pedido.
2. Abre el modal de Checkout y completa datos.
3. Se envía POST a `api/ordenes.php` con items y datos del cliente.
4. Backend valida stock, crea la orden y responde con `numero_orden`.

## Estado actual
- Carrito y checkout integrados, estilos de modal activos.
- Persistencia robusta tras refrescos y navegación SPA.

## Próximos pasos
- Añadir pruebas automatizadas y validaciones adicionales de formulario.
- Mejorar feedback de errores y estados de carga.
- Endurecer validaciones y sanitización de entrada en backend.