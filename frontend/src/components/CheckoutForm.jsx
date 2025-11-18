import { useState } from 'react'
import { useCart } from '../contexts/CartContext.jsx'
import { formatearPrecio, ordenesAPI } from '../services/api'
import { useNotification } from '../contexts/NotificationContext.jsx'
import '../styles/checkout.css'

export default function CheckoutForm({ onClose, onSuccess }) {
  const { items, getCartTotal, clearCart } = useCart()
  const { notify } = useNotification()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    cliente_nombre: '',
    cliente_email: '',
    cliente_telefono: '',
    cliente_direccion: '',
    notas: ''
  })
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.cliente_nombre.trim()) {
      newErrors.cliente_nombre = 'El nombre es requerido'
    }
    
    if (!formData.cliente_email.trim()) {
      newErrors.cliente_email = 'El email es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.cliente_email)) {
      newErrors.cliente_email = 'Email inválido'
    }
    
    if (!formData.cliente_direccion.trim()) {
      newErrors.cliente_direccion = 'La dirección es requerida'
    }
    
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) {
      const labels = {
        cliente_nombre: 'Nombre',
        cliente_email: 'Email',
        cliente_direccion: 'Dirección'
      }
      const faltantes = Object.keys(newErrors).map(k => labels[k] || k).join(', ')
      notify({ type: 'error', message: `Corrige: ${faltantes}` })
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    
    try {
      
      const itemsSnapshot = items.map(it => ({ ...it }))
      const orderItems = items.map(item => ({
        id: item.id,
        quantity: item.cantidad
      }))

      const orderData = {
        ...formData,
        items: orderItems
      }

      const result = await ordenesAPI.crear(orderData)
      
      if (!result || result.success === false) {
        throw new Error(result?.error || 'Error al crear la orden')
      }

      clearCart()
      onSuccess({
        ...result,
        numero_orden: result.numero_orden 
          || result.numeroOrden 
          || result.n_orden 
          || result.nOrden 
          || result.numero 
          || result.codigo 
          || (result?.data?.numero_orden) 
          || (result?.data?.numeroOrden) 
          || (result?.data?.n_orden) 
          || (result?.data?.nOrden) 
          || (result?.data?.numero) 
          || (result?.data?.codigo),
        orden_id: result.orden_id 
          || result.id 
          || result.order_id 
          || result.orderId 
          || result.ordenId 
          || (result?.data?.orden_id) 
          || (result?.data?.order_id) 
          || (result?.data?.ordenId) 
          || (result?.data?.orderId),
        cliente: formData,
        items: itemsSnapshot
      })
      
    } catch (error) {
      console.error('Error al enviar orden:', error)
      notify({ type: 'error', message: 'Error al procesar la orden: ' + (error.message || '') })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="checkout-overlay">
      <div className="checkout-modal">
        <div className="checkout-header">
          <h2>Finalizar Compra</h2>
          <button 
            onClick={onClose}
            className="close-btn"
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <div className="checkout-content">
          {/* Resumen de la orden */}
          <div className="order-summary">
            <h3>Resumen del Pedido</h3>
            <div className="order-items">
              {items.map(item => (
                <div key={item.id} className="order-item">
                  <span className="item-name">{item.nombre}</span>
                  <span className="item-quantity">x{item.cantidad}</span>
                  <span className="item-price">{formatearPrecio(item.precio * item.cantidad)}</span>
                </div>
              ))}
            </div>
            <div className="order-total">
              <strong>Total: {formatearPrecio(getCartTotal())}</strong>
            </div>
          </div>

          {/* Formulario de datos del cliente */}
          <form onSubmit={handleSubmit} noValidate className="checkout-form">
            <h3>Datos de Entrega</h3>
            
            <div className="form-group">
              <label htmlFor="cliente_nombre">Nombre Completo *</label>
              <input
                type="text"
                id="cliente_nombre"
                name="cliente_nombre"
                value={formData.cliente_nombre}
                onChange={handleInputChange}
                className={errors.cliente_nombre ? 'error' : ''}
                disabled={loading}
                required
              />
              {errors.cliente_nombre && <span className="error-message">{errors.cliente_nombre}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="cliente_email">Email *</label>
              <input
                type="email"
                id="cliente_email"
                name="cliente_email"
                value={formData.cliente_email}
                onChange={handleInputChange}
                className={errors.cliente_email ? 'error' : ''}
                disabled={loading}
                required
              />
              {errors.cliente_email && <span className="error-message">{errors.cliente_email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="cliente_telefono">Teléfono</label>
              <input
                type="tel"
                id="cliente_telefono"
                name="cliente_telefono"
                value={formData.cliente_telefono}
                onChange={handleInputChange}
                disabled={loading}
                placeholder="Opcional"
              />
            </div>

            <div className="form-group">
              <label htmlFor="cliente_direccion">Dirección Completa *</label>
              <textarea
                id="cliente_direccion"
                name="cliente_direccion"
                value={formData.cliente_direccion}
                onChange={handleInputChange}
                className={errors.cliente_direccion ? 'error' : ''}
                disabled={loading}
                rows="3"
                placeholder="Calle, número, ciudad, código postal..."
                required
              />
              {errors.cliente_direccion && <span className="error-message">{errors.cliente_direccion}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="notas">Notas del Pedido</label>
              <textarea
                id="notas"
                name="notas"
                value={formData.notas}
                onChange={handleInputChange}
                disabled={loading}
                rows="2"
                placeholder="Instrucciones especiales, horarios de entrega, etc. (opcional)"
              />
            </div>

            <div className="checkout-actions">
              <button 
                type="button" 
                onClick={onClose}
                className="btn btn-outline"
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Procesando...' : `Confirmar Pedido - ${formatearPrecio(getCartTotal())}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
