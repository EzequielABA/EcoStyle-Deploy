import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext.jsx'
import '../styles/product-card.css'
import { formatearPrecio } from '../services/api'

export default function ProductCard({ product, onClick }) {
  const { addItem, getItemQuantity } = useCart()
  const enStock = Number(product?.stock ?? 0) > 0
  const disponible = Boolean(product?.disponible) && enStock
  const destacado = Boolean(product?.destacado)
  const nombre = product?.nombre || 'Producto Eco'
  const descripcion = product?.descripcion || ''
  const categoria = product?.categoria_nombre || product?.categoria || ''
  const precio = Number(product?.precio ?? 0)
  const img = product?.imagen || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'

  const handleClick = () => {
    if (typeof onClick === 'function') onClick(product)
  }

  const handleAddToCart = (e) => {
    e.stopPropagation() // Evitar que se active el onClick del card
    if (product && disponible) {
      addItem(product)
    }
  }

  return (
    <div className="product-card scale-in" onClick={handleClick} role={onClick ? 'button' : undefined}>
      <div className="product-image">
        <img 
          src={img} 
          alt={nombre}
          loading="lazy"
        />
        {!disponible ? (
          <span className="product-badge unavailable">Agotado</span>
        ) : (
          destacado && <span className="product-badge">Destacado</span>
        )}
      </div>
      <div className="product-content">
        <h3 className="product-name">{nombre}</h3>
        {descripcion && (
          <p className="product-description">{descripcion}</p>
        )}
        <div className="product-meta">
          {categoria && (
            <span className="product-category">{categoria}</span>
          )}
        </div>
        <div className="product-footer">
          <span className="product-price">
            {formatearPrecio(precio)}
          </span>
          <div className="product-actions">
            {disponible && product?.id && (
              <button 
                onClick={handleAddToCart}
                className="btn btn-sm btn-primary cart-btn"
                title="Agregar al carrito"
                disabled={getItemQuantity(product.id) >= Number(product.stock ?? 0)}
              >
                🛒 {getItemQuantity(product.id) > 0 && `(${getItemQuantity(product.id)})`}
              </button>
            )}
            {product?.id ? (
              <Link 
                to={`/products/${product?.id}`}
                className={`btn btn-sm ${disponible ? 'btn-outline' : 'btn-disabled'}`}
                style={!disponible ? { pointerEvents: 'none' } : {}}
              >
                {disponible ? 'Ver Detalles' : 'Agotado'}
              </Link>
            ) : (
              <button 
                className="btn btn-sm btn-disabled"
                disabled
              >
                Sin ID
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}