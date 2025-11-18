# EcoStyle — Guía de Pruebas

## Alcance
Pruebas funcionales del frontend (SPA) y validaciones críticas del backend relacionadas al flujo de checkout y persistencia del carrito.

## Entorno de prueba
- Frontend dev server en `http://localhost:5173/` (`npm run dev`).
- Backend dev server en `http://localhost:8080/` (PHP 8.2 con `php -S`): `php -S localhost:8080 -t backend backend/index.php`.
- Base de datos `ecostyle` accesible; stock y productos de prueba cargados.

## Pruebas funcionales (frontend)
1. Navegación SPA
   - Ir a `Productos` y luego a `Carrito` usando enlaces de la app.
   - Confirmar que no hay recarga completa del sitio.
2. Añadir al carrito
   - Agregar 1 producto; verificar que aparece en `Carrito`.
   - Añadir múltiples productos, confirmar conteos y totales.
3. Ajuste de cantidades
   - Usar `+` y `-` para variar cantidades.
   - Verificar que el total por ítem y el total general se actualizan.
4. Eliminar productos
   - Usar `🗑️` para eliminar un ítem.
   - Usar `Vaciar Carrito` y confirmar el diálogo.
5. Persistencia del carrito
   - Refrescar la página en `/cart` y verificar que los productos siguen.
   - Navegar entre `Productos` y `Carrito` y confirmar persistencia.
6. Checkout modal
   - Abrir `Proceder al Checkout`, revisar resumen.
   - Completar formulario con datos válidos; botón deshabilitado durante envío.
   - Verificar notificación de éxito con el código de orden y redirección a `/orden-confirmacion` mostrando la factura.

## Pruebas de validación (frontend)
- Campos obligatorios (Nombre, Email, Dirección): mostrar error si faltan.
- Email inválido: rechazar y mostrar mensaje.
- Teléfono es opcional; si se incluye, validar formato básico.

## Pruebas de integración (backend)
1. Creación de orden (POST `/ordenes` o `/api/ordenes.php`)
   - Caso feliz: items con stock suficiente y datos válidos → respuesta `{ success: true, orden_id, numero_orden, total }`.
   - Stock insuficiente: retornar error indicando productos afectados.
   - Datos incompletos: retornar error de validación.
2. Consulta de órdenes (GET `/ordenes` o `/api/ordenes.php`)
   - Verificar respuesta `{ success: true, ordenes: [...] }` con límite y formato esperado.

## Pruebas de regresión
- Cambios en estructura de carrito: asegurar compatibilidad con `cantidad` y `precio` normalizados.
- Navegación SPA: evitar `<a href>` que causen recarga.

## Criterios de aceptación
- Persistencia del carrito robusta en navegación y refresco.
- Checkout funcional con validaciones y respuesta del backend.
- Totales y cantidades correctos y consistentes.

## Registro de defectos
- Documentar pasos para reproducir, entorno, logs y capturas.
- Asignar prioridad según impacto en compra y datos.