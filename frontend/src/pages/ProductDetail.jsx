import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { obtenerProductoPorId, formatearPrecio } from '../services/api'
import { useCart } from '../contexts/CartContext.jsx'
import '../styles/common.css'
import '../styles/product-detail.css'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem, getItemQuantity } = useCart()
  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    cargarProducto()
  }, [id])

  const cargarProducto = async () => {
    try {
      setCargando(true)
      setError('')
      const data = await obtenerProductoPorId(id)
      
      if (data) {
        setProducto(data)
      } else {
        setError('Producto no encontrado')
      }
    } catch (err) {
      console.error('Error al cargar producto:', err)
      setError('Error al cargar el producto')
    } finally {
      setCargando(false)
    }
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleAddToCart = () => {
    if (producto && disponible) {
      addItem(producto)
    }
  }

  if (cargando) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando producto...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !producto) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="error-message">
            <h2>Producto no encontrado</h2>
            <p>{error || 'El producto que buscas no existe o ha sido eliminado.'}</p>
            <div className="error-actions">
              <button onClick={handleGoBack} className="btn btn-outline">
                Volver
              </button>
              <Link to="/products" className="btn btn-primary">
                Ver Todos los Productos
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const enStock = Number(producto.stock ?? 0) > 0
  const disponible = Boolean(producto.disponible) && enStock
  const destacado = Boolean(producto.destacado)
  const tieneOferta = producto.precio_oferta && producto.precio_oferta < producto.precio
  const cantidadActual = getItemQuantity(producto.id)
  const limiteAlcanzado = cantidadActual >= Number(producto.stock ?? 0)

  return (
    <div className="product-detail-page">
      {/* Breadcrumb */}
      <div className="breadcrumb-section">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb-link">Inicio</Link>
            <span className="breadcrumb-separator">/</span>
            <Link to="/products" className="breadcrumb-link">Productos</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{producto.nombre}</span>
          </nav>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container">
        <div className="product-detail-content">
          {/* Imagen del producto */}
          <div className="product-image-section">
            <div className="product-image-container">
              <img 
                src={producto.imagen || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'} 
                alt={producto.nombre}
                className="product-image"
              />
              {!disponible ? (
                <span className="product-badge agotado">Agotado</span>
              ) : (
                <>
                  {destacado && (
                    <span className="product-badge destacado">Destacado</span>
                  )}
                  {tieneOferta && (
                    <span className="product-badge oferta">Oferta</span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Información del producto */}
          <div className="product-info-section">
            <div className="product-header">
              <h1 className="product-title">{producto.nombre}</h1>
              {producto.categoria_nombre && (
                <span className="product-category">{producto.categoria_nombre}</span>
              )}
            </div>

            <div className="product-pricing">
              {tieneOferta ? (
                <div className="pricing-with-offer">
                  <span className="price-original">{formatearPrecio(producto.precio)}</span>
                  <span className="price-offer">{formatearPrecio(producto.precio_oferta)}</span>
                  <span className="discount-percentage">
                    -{Math.round(((producto.precio - producto.precio_oferta) / producto.precio) * 100)}%
                  </span>
                </div>
              ) : (
                <span className="price-regular">{formatearPrecio(producto.precio)}</span>
              )}
            </div>

            {producto.descripcion && (
              <div className="product-description">
                <h3>Descripción</h3>
                <p>{producto.descripcion}</p>
              </div>
            )}

            <div className="product-status">
              <div className="status-item">
                <span className="status-label">Disponibilidad:</span>
                <span className={`status-value ${disponible ? 'available' : 'unavailable'}`}>
                  {disponible ? 'En stock' : 'Agotado'}
                </span>
              </div>
            </div>

            <div className="product-actions">
              {disponible ? (
                <button 
                  onClick={handleAddToCart}
                  className="btn btn-primary btn-large"
                  disabled={limiteAlcanzado}
                >
                  {cantidadActual > 0 
                    ? (limiteAlcanzado ? `En carrito (${cantidadActual}) - Límite alcanzado` : `En carrito (${cantidadActual}) - Agregar más`)
                    : 'Agregar al Carrito'}
                </button>
              ) : (
                <button className="btn btn-disabled btn-large" disabled>
                  Producto Agotado
                </button>
              )}
              <button onClick={handleGoBack} className="btn btn-outline">
                Volver
              </button>
            </div>

            <div className="product-features">
              <h3>Características</h3>
              <ul className="features-list">
                <li>✓ Materiales sostenibles y eco-friendly</li>
                <li>✓ Producción ética y responsable</li>
                <li>✓ Calidad premium garantizada</li>
                <li>✓ Envío gratuito en pedidos superiores a $50</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}