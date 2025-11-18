# EcoStyle — Manual de Usuario

## Introducción
EcoStyle te permite explorar productos sostenibles, añadirlos al carrito y realizar pedidos de forma rápida y segura.

## Requisitos
- Navegador moderno actualizado.
- Conexión a internet.

## Acceso
- Desarrollo: `http://localhost:5173/`
- Producción: URL pública configurada por el administrador.

## Navegación principal
- `Productos`: Explora el catálogo por categorías o usando búsqueda.
- `Carrito`: Revisa y ajusta tu pedido antes de confirmar.

## Catálogo de productos
- Lista y tarjetas de producto con nombre, categoría, precio e imagen.
- Puedes usar filtros o búsqueda (si están habilitados).
- Acciones comunes:
  - `Agregar al carrito`: añade el producto con cantidad inicial (1).

## Carrito de compras
- Visualiza productos añadidos con imagen, nombre, categoría, precio unitario, cantidad y total por ítem.
- Controles:
  - `+` y `-` para ajustar la cantidad.
  - `🗑️` para eliminar un producto.
  - `Vaciar Carrito` para quitar todos los productos.
- Resumen:
  - `Productos (N)`: cantidad total de items.
  - `Total`: suma de todos los productos.
  - `Envío`: gratis (si se mantiene la política actual).
- `Continuar Comprando`: vuelve al catálogo sin perder el carrito.

## Checkout (Confirmar pedido)
1. En el carrito, pulsa `Proceder al Checkout`.
2. Completa tus datos (nombre, email, teléfono, dirección y observaciones opcionales).
3. Revisa el resumen del pedido en el modal.
4. Pulsa `Confirmar Pedido` para enviar.
5. Si el pedido es exitoso, verás un número de orden y regresarás a `Productos`.

## Mensajes y errores
- Validaciones de formulario: nombre, email, teléfono y dirección.
- Errores del backend: stock insuficiente, datos inválidos, conexión.
- Estados de carga: botón deshabilitado mientras se procesa.

## Persistencia del carrito
- El carrito se guarda automáticamente en `localStorage`.
- Tu carrito se mantiene al navegar dentro de la app y al refrescar la página.

## Consejos
- Verifica cantidades antes de confirmar el pedido.
- Mantén tus datos de contacto correctos para facilitar la entrega.

## Soporte
- Si algo no funciona, revisa tu conexión y vuelve a intentar.
- Contacta al soporte con el `número de orden` si tu pedido ya fue creado.