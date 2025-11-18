# EcoStyle — Wireframe y Mapa de Navegación

## Mapa de Navegación
- `/` (Home)
- `/products` (Catálogo)
- `/products/:id` (Detalle de producto)
- `/cart` (Carrito)
- `Checkout` (Modal sobre `/cart`)
- `/orden-confirmacion` (Factura / resumen de compra)
- `/contact` (Contacto)
- `/about` (Nosotros)
- `/faq` (Preguntas frecuentes)
- `/add-product` (Añadir producto)
- Rutas backend: `/productos`, `/categorias`, `/buscar`, `/contacto`, `/ordenes` y `/api/*.php`

## Estructura de navegación (SPA)
- Header con navegación a `Productos` y `Carrito`.
- Navegación interna con `Link` para evitar recargas completas.

## Wireframes (texto)

### Productos (`/products`)
```
+------------------------------------------------------------+
| Header: Logo | Productos | Carrito                         |
+------------------------------------------------------------+
| Filtros / Búsqueda                                         |
+------------------------------------------------------------+
| [Tarjeta Producto] [Tarjeta Producto] [Tarjeta Producto]   |
|  Imagen | Nombre | Categoría | Precio | Agregar al carrito |
| ...                                                        |
+------------------------------------------------------------+
| Footer (opcional)                                          |
+------------------------------------------------------------+
```

### Carrito (`/cart`)
```
+------------------------------------------------------------+
| Header: Logo | Productos | Carrito                         |
+------------------------------------------------------------+
| Título: Tu Carrito      [Vaciar Carrito]                   |
+------------------------------------------------------------+
| Item: Img | Nombre | Categoría | Precio                    |
|       [-] Cantidad [+] | Total por ítem | [🗑️]             |
| ...                                                        |
+----------------------+-----------------------+-------------+
| Resumen del Pedido   | Productos (N)         | Total       |
|                      | Envío: Gratis         |             |
| [Proceder al Checkout] [Continuar Comprando]              |
+------------------------------------------------------------+
```

### Checkout (Modal)
```
+------------------- Modal Checkout -------------------------+
| Header: Confirmar Pedido    [X]                            |
+------------------------------------------------------------+
| Resumen del Pedido (lista de items y total)                |
| Formulario: Nombre, Email, Teléfono, Dirección, Notas      |
| [Cancelar]                           [Confirmar Pedido]     |
+------------------------------------------------------------+
```

### Confirmación de Orden (`/orden-confirmacion`)
```
+-------------------- Factura / Confirmación ----------------+
| Header: EcoStyle RD | Nº Orden: ORD-YYYYMMDD-XXXXXX        |
+------------------------------------------------------------+
| Datos del Cliente: Nombre, Email, Teléfono, Dirección      |
+------------------------------------------------------------+
| Items: Nombre | Cantidad | Precio | Subtotal               |
| ...                                                          
+------------------------------------------------------------+
| Subtotal | Total (DOP)                                     |
| [Volver a Productos]                                       |
+------------------------------------------------------------+
```

## Componentes clave
- `NavbarCart.jsx`: acceso rápido al carrito desde el header.
- `Cart.jsx`: página de carrito, resumen y apertura de modal.
- `CheckoutForm.jsx`: modal de checkout con formulario y resumen.
- `OrderConfirmation.jsx`: pantalla de factura y detalles de la orden.
- `CartContext.jsx`: estado global del carrito y persistencia.
- `NotificationContext.jsx` y `Notification.jsx`: toasts de éxito/error.

## Consideraciones de UX
- Botones de cantidad accesibles y deshabilitados en límites.
- Mensajes claros de validación y éxito al confirmar.
- Persistencia visible: el carrito no se pierde al navegar/refrescar.
- Modal con `max-height: 90vh`, contenido scrollable y footer sticky.
- Inputs del checkout ajustados a `max-width: 100%` para evitar desbordes.

## Estructura de archivos (resumen)
```
EcoStyle/
├── backend/
│   ├── api/
│   │   ├── productos.php
│   │   ├── categorias.php
│   │   ├── buscar.php
│   │   ├── contacto.php
│   │   └── ordenes.php
│   ├── config/
│   │   └── database.php
│   ├── index.php
│   ├── .htaccess
│   └── database/
│       └── ecostyle.sql
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── contexts/
│   │   │   ├── CartContext.jsx
│   │   │   └── NotificationContext.jsx
│   │   ├── components/
│   │   │   ├── NavbarCart.jsx
│   │   │   ├── CheckoutForm.jsx
│   │   │   └── Notification.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── AboutUs.jsx
│   │   │   ├── FAQ.jsx
│   │   │   ├── OrderConfirmation.jsx
│   │   │   └── AddProduct.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   └── styles/
│   │       ├── checkout.css
│   │       ├── product-card.css
│   │       ├── products.css
│   │       ├── home.css
│   │       ├── common.css
│   │       └── order-confirmation.css
│   ├── index.html
│   └── package.json
└── docs/
    ├── Guia_de_Despliegue.md
    ├── Guia_de_Pruebas.md
    └── Wireframe_y_Mapa_de_Navegacion.md
```