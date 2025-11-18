import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext.jsx'
import { formatearPrecio, ordenesAPI } from '../services/api'
import { useNotification } from '../contexts/NotificationContext.jsx'
import CheckoutForm from '../components/CheckoutForm.jsx'
import '../styles/cart.css'

export default function Cart() {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    getCartItemsCount, 
    getCartTotal 
  } = useCart()

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleRemoveItem = (productId) => {
    removeItem(productId)
  }

  const navigate = useNavigate()
  const { notify } = useNotification()
  const [showCheckout, setShowCheckout] = useState(false)
 
  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      clearCart()
    }
  }

  const handleCheckoutSuccess = async (result) => {
    setShowCheckout(false)
    const codigoOrden = result.numero_orden 
      || result.numeroOrden 
      || result.n_orden 
      || result.nOrden 
      || result.numero 
      || result.codigo 
      || result.orden_id 
      || result.order_id 
      || result.ordenId 
      || result.orderId 
      || (result?.data?.numero_orden) 
      || (result?.data?.numeroOrden) 
      || (result?.data?.n_orden) 
      || (result?.data?.nOrden) 
      || (result?.data?.numero) 
      || (result?.data?.codigo) 
      || (result?.data?.orden_id)
      || (result?.data?.order_id)
      || (result?.data?.ordenId)
      || (result?.data?.orderId)
    let finalCodigo = codigoOrden
    let finalOrdenId = result.orden_id || result.id || result.order_id || result.orderId || result.ordenId || (result?.data?.orden_id) || (result?.data?.order_id) || (result?.data?.ordenId) || (result?.data?.orderId)
    if (!finalCodigo) {
      try {
        const lista = await ordenesAPI.obtener()
        const arr = Array.isArray(lista?.ordenes) ? lista.ordenes : (Array.isArray(lista) ? lista : [])
        const emailBuscar = result?.cliente?.cliente_email || result?.cliente_email
        const encontrada = emailBuscar ? arr.find(o => o.cliente_email === emailBuscar) : (arr[0] || null)
        if (encontrada) {
          finalCodigo = encontrada.numero_orden || encontrada.numero || encontrada.codigo
          finalOrdenId = encontrada.id || encontrada.orden_id
          result.numero_orden = finalCodigo
          result.orden_id = finalOrdenId
        }
      } catch {}
    }
    const emailClienteOk = typeof result.email_cliente === 'object' ? result.email_cliente.success === true : result.email_cliente === true
    const emailAdminOk = typeof result.email_admin === 'object' ? result.email_admin.success === true : result.email_admin === true
    const emailMsg = `Emails → Cliente: ${emailClienteOk ? 'enviado' : 'no enviado'} | Admin: ${emailAdminOk ? 'enviado' : 'no enviado'}`
    notify({ type: 'success', message: `Orden completada. Código: ${finalCodigo ?? 'Desconocido'}. ${emailMsg}` })
    navigate('/orden-confirmacion', { state: result })
  }
 
  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1>Tu Carrito</h1>
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <i className="pi pi-shopping-cart" style={{ fontSize: '5rem', color: 'var(--primary)', transform: 'scaleX(-1)' }} />
            </div>
            <h2>Tu carrito está vacío</h2>
            <p>Agrega algunos productos para comenzar tu compra</p>
            <Link to="/products" className="btn btn-primary">
              Ver Productos
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Tu Carrito</h1>
          <button 
            onClick={handleClearCart}
            className="btn btn-outline btn-sm"
          >
            Vaciar Carrito
          </button>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img 
                    src={item.imagen || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'} 
                    alt={item.nombre}
                  />
                </div>
                
                <div className="cart-item-details">
                  <h3>{item.nombre}</h3>
                  <p className="cart-item-category">{item.categoria_nombre || item.categoria}</p>
                  <p className="cart-item-price">{formatearPrecio(item.precio)}</p>
                </div>

                <div className="cart-item-quantity">
                  <button 
                    onClick={() => handleQuantityChange(item.id, item.cantidad - 1)}
                    className="quantity-btn"
                    disabled={item.cantidad <= 1}
                  >
                    -
                  </button>
                  <span className="quantity-display">{item.cantidad}</span>
                  <button 
                    onClick={() => handleQuantityChange(item.id, item.cantidad + 1)}
                    className="quantity-btn"
                    disabled={item.stock !== undefined && Number(item.cantidad) >= Number(item.stock)}
                  >
                    +
                  </button>
                </div>

                <div className="cart-item-total">
                  <span className="item-total-price">
                    {formatearPrecio(item.precio * item.cantidad)}
                  </span>
                  <button 
                    onClick={() => handleRemoveItem(item.id)}
                    className="remove-btn"
                    title="Eliminar producto"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Resumen del Pedido</h3>
              
              <div className="summary-line">
                <span>Productos ({getCartItemsCount()})</span>
                <span>{formatearPrecio(getCartTotal())}</span>
              </div>
              
              <div className="summary-line">
                <span>Envío</span>
                <span>Gratis</span>
              </div>
              
              <div className="summary-line total-line">
                <span>Total</span>
                <span>{formatearPrecio(getCartTotal())}</span>
              </div>

              <button className="btn btn-primary btn-full checkout-btn" onClick={() => setShowCheckout(true)}>
                Proceder al Checkout
              </button>

              <div className="continue-shopping">
                <Link to="/products" className="btn btn-outline btn-full">
                  Continuar Comprando
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showCheckout && (
        <CheckoutForm onClose={() => setShowCheckout(false)} onSuccess={handleCheckoutSuccess} />
      )}
    </div>
  )
}
