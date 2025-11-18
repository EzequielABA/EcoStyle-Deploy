import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { formatearPrecio } from '../services/api'
import '../styles/order-confirmation.css'

export default function OrderConfirmation() {
  const location = useLocation()
  const data = location.state

  if (!data) {
    return (
      <div className="container" style={{ padding: '2rem 0' }}>
        <h1>Confirmación de Orden</h1>
        <p>No encontramos información de la compra. Es posible que hayas llegado aquí directamente.</p>
        <div style={{ margin: '4rem 0'}}>
          <Link to="/products" className="btn btn-primary">Volver a Productos</Link>
        </div>
      </div>
    )
  }

  const {
    numero_orden,
    orden_id,
    total,
    cliente,
    items = [],
    moneda = 'DOP',
  } = data
  const orderNumber = numero_orden 
    || data.numeroOrden 
    || data.n_orden 
    || data.nOrden 
    || data.numero 
    || data.codigo 
    || (data?.data?.numero_orden) 
    || (data?.data?.numeroOrden) 
    || (data?.data?.n_orden) 
    || (data?.data?.nOrden) 
    || (data?.data?.numero) 
    || (data?.data?.codigo)
  const orderId = orden_id 
    || data?.id 
    || data?.ordenId 
    || data?.order_id 
    || data?.orderId 
    || data?.data?.orden_id 
    || data?.data?.ordenId 
    || data?.data?.order_id 
    || data?.data?.orderId

  const computedTotal = Number.isFinite(Number(total))
    ? Number(total)
    : items.reduce((acc, it) => {
        const price = Number(it.precio ?? it.producto_precio ?? it.price ?? 0)
        const qty = Number(it.cantidad ?? it.quantity ?? 1)
        return acc + price * qty
      }, 0)

  return (
    <>
      <section className="page-header">
        <div className="container">
          <div className="page-header-content fade-in">
            <h1 className="page-title">Factura / Confirmación de Compra</h1>
            <p className="page-description">Gracias por tu compra. A continuación se muestra el resumen de tu orden.</p>
          </div>
        </div>
      </section>
      <div className="order-confirmation-page">
        <div className="container">

        <div className="invoice">
          <div className="invoice-header">
            <div>
              <h2>EcoStyle RD</h2>
              <p>Moda sostenible y consciente</p>
            </div>
          <div style={{ textAlign: 'right' }}>
            <p><strong>Nº de Orden:</strong> {orderNumber || 'No disponible'}</p>
            {orderId ? <p><strong>ID:</strong> {orderId}</p> : null}
            <p><strong>Fecha:</strong> {new Date().toLocaleString()}</p>
          </div>
        </div>

          <div className="invoice-customer" style={{ marginTop: '16px' }}>
            <h3>Datos del Cliente</h3>
            {cliente ? (
              <div className="grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px' }}>
                <p><strong>Nombre:</strong> {cliente.cliente_nombre}</p>
                <p><strong>Email:</strong> {cliente.cliente_email}</p>
                {cliente.cliente_telefono && <p><strong>Teléfono:</strong> {cliente.cliente_telefono}</p>}
                <p style={{ gridColumn: '1 / -1' }}><strong>Dirección:</strong> {cliente.cliente_direccion}</p>
                {cliente.notas && <p style={{ gridColumn: '1 / -1' }}><strong>Notas:</strong> {cliente.notas}</p>}
              </div>
            ) : (
              <p>No hay datos de cliente adjuntos.</p>
            )}
          </div>

          <div className="invoice-items" style={{ marginTop: '16px' }}>
            <h3>Items</h3>
            {items.length > 0 ? (
              <div className="order-items">
                {items.map((it) => (
                  <div key={`${it.id}-${it.nombre || ''}`} className="order-item">
                    <span className="item-name">{it.nombre || `Producto #${it.id}`}</span>
                    <span className="item-quantity">x{it.cantidad || it.quantity || 1}</span>
                    {it.precio ? (
                      <span className="item-price">{formatearPrecio((it.precio) * (it.cantidad || it.quantity || 1))}</span>
                    ) : (
                      <span className="item-price">{formatearPrecio(0)}</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No hay items adjuntos.</p>
            )}
          </div>

          <div className="invoice-total" style={{ marginTop: '16px' }}>
            <div className="summary-line total-line">
              <span>Total ({moneda}):</span>
              <strong>{formatearPrecio(computedTotal)}</strong>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '24px' }}>
          <Link to="/products" className="btn btn-outline">Seguir Comprando</Link>
        </div>
        </div>
      </div>
    </>
  )
}
