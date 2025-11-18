import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { productosAPI, categoriasAPI, formatearPrecio } from '../services/api'
import { useCart } from '../contexts/CartContext.jsx'
import '../styles/common.css'
import '../styles/products.css'
import '../styles/product-card.css'

export default function Products() {
  const { addItem } = useCart()
  const [searchParams, setSearchParams] = useSearchParams()
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  
  // Estados de filtros
  const [filtros, setFiltros] = useState({
    buscar: searchParams.get('q') || '',
    categoria: searchParams.get('categoria') || '',
    precio_min: searchParams.get('precio_min') || '',
    precio_max: searchParams.get('precio_max') || '',
    orden: searchParams.get('orden') || 'nombre_asc'
  })

  // Cargar categorías
  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const cats = await categoriasAPI.obtenerTodas()
        setCategorias(cats?.data ?? [])
      } catch (err) {
        console.error('Error al cargar categorías:', err)
      }
    }
    cargarCategorias()
  }, [])

  // Cargar productos con filtros
  const cargarProductos = useCallback(async () => {
    try {
      setCargando(true)
      setError(null)
      
      const filtrosLimpios = {}
      if (filtros.buscar) filtrosLimpios.buscar = filtros.buscar
      if (filtros.categoria) filtrosLimpios.categoria = filtros.categoria
      if (filtros.precio_min) filtrosLimpios.precio_min = parseFloat(filtros.precio_min)
      if (filtros.precio_max) filtrosLimpios.precio_max = parseFloat(filtros.precio_max)
      if (filtros.orden) filtrosLimpios.orden = filtros.orden
      
      const productos = await productosAPI.obtenerTodos(filtrosLimpios)
      setProductos(productos)
    } catch (err) {
      setError(err.message)
      console.error('Error al cargar productos:', err)
    } finally {
      setCargando(false)
    }
  }, [filtros])

  // Efecto para cargar productos cuando cambien los filtros
  useEffect(() => {
    cargarProductos()
  }, [cargarProductos])

  // Actualizar URL cuando cambien los filtros
  useEffect(() => {
    const params = new URLSearchParams()
    if (filtros.buscar) params.set('q', filtros.buscar)
    if (filtros.categoria) params.set('categoria', filtros.categoria)
    if (filtros.precio_min) params.set('precio_min', filtros.precio_min)
    if (filtros.precio_max) params.set('precio_max', filtros.precio_max)
    if (filtros.orden && filtros.orden !== 'nombre_asc') params.set('orden', filtros.orden)
    
    setSearchParams(params)
  }, [filtros, setSearchParams])

  // Manejar cambios en filtros
  const manejarCambioFiltro = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }))
  }

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({
      buscar: '',
      categoria: '',
      precio_min: '',
      precio_max: '',
      orden: 'nombre_asc'
    })
  }

  return (
    <div className="products-page">
      {/* Header */}
      <section className="page-header">
        <div className="container">
          <div className="page-header-content fade-in">
            <h1 className="page-title">Nuestros Productos</h1>
            <p className="page-description">
              Descubre nuestra colección completa de moda sostenible y eco-friendly
            </p>
          </div>
        </div>
      </section>

      {/* Filtros */}
      <section className="filters-section">
        <div className="container">
          <div className="filters-container">
            {/* Búsqueda */}
            <div className="search-box">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={filtros.buscar}
                onChange={(e) => manejarCambioFiltro('buscar', e.target.value)}
                className="search-input"
              />
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </div>

            {/* Filtros */}
            <div className="filters-row">
              {/* Categoría */}
              <select
                value={filtros.categoria}
                onChange={(e) => manejarCambioFiltro('categoria', e.target.value)}
                className="filter-select"
              >
                <option value="">Todas las categorías</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>

              {/* Precio mínimo */}
              <input
                type="number"
                placeholder="Precio mín."
                value={filtros.precio_min}
                onChange={(e) => manejarCambioFiltro('precio_min', e.target.value)}
                className="filter-input"
                min="0"
                step="0.01"
              />

              {/* Precio máximo */}
              <input
                type="number"
                placeholder="Precio máx."
                value={filtros.precio_max}
                onChange={(e) => manejarCambioFiltro('precio_max', e.target.value)}
                className="filter-input"
                min="0"
                step="0.01"
              />

              {/* Ordenar */}
              <select
                value={filtros.orden}
                onChange={(e) => manejarCambioFiltro('orden', e.target.value)}
                className="filter-select"
              >
                <option value="nombre_asc">Nombre A-Z</option>
                <option value="nombre_desc">Nombre Z-A</option>
                <option value="precio_asc">Precio menor</option>
                <option value="precio_desc">Precio mayor</option>
                <option value="fecha_desc">Más recientes</option>
              </select>

              {/* Limpiar filtros */}
              <button
                onClick={limpiarFiltros}
                className="btn btn-outline btn-sm"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Productos */}
      <section className="products-section">
        <div className="container">
          {/* Contador de resultados */}
          {!cargando && (
            <div className="results-info fade-in">
              <p>
                {productos.length === 0 
                  ? 'No se encontraron productos' 
                  : `${productos.length} producto${productos.length !== 1 ? 's' : ''} encontrado${productos.length !== 1 ? 's' : ''}`
                }
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="error-message">
              <p>Error al cargar productos: {error}</p>
              <button onClick={cargarProductos} className="btn btn-primary">
                Reintentar
              </button>
            </div>
          )}

          {/* Cargando */}
          {cargando && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Cargando productos...</p>
            </div>
          )}

          {/* Grid de productos */}
          {!cargando && productos.length > 0 && (
            <div className="products-grid">
              {productos.map((producto) => (
                <div key={producto.id} className="product-card scale-in">
                  <div className="product-image">
                    <img 
                      src={producto.imagen || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'} 
                      alt={producto.nombre}
                      loading="lazy"
                    />
                    {Boolean(producto.destacado) && (
                      <span className="product-badge">Destacado</span>
                    )}
                    {!producto.disponible && (
                      <span className="product-badge unavailable">Agotado</span>
                    )}
                  </div>
                  <div className="product-content">
                    <h3 className="product-name">{producto.nombre}</h3>
                    <p className="product-description">{producto.descripcion}</p>
                    <div className="product-meta">
                      {producto.categoria_nombre && (
                        <span className="product-category">{producto.categoria_nombre}</span>
                      )}
                    </div>
                    <div className="product-footer">
                      <span className="product-price">
                        {formatearPrecio(producto.precio)}
                      </span>
                      <div className="product-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                        {producto.id ? (
                          <Link 
                            to={`/products/${producto.id}`}
                            className={`btn btn-sm ${producto.disponible ? 'btn-secondary' : 'btn-disabled'}`}
                            style={!producto.disponible ? { pointerEvents: 'none' } : {}}
                          >
                            Ver Detalles
                          </Link>
                        ) : (
                          <button 
                            className="btn btn-sm btn-disabled"
                            disabled
                          >
                            Sin ID
                          </button>
                        )}

                        <button
                          className={`btn btn-sm ${producto.disponible ? 'btn-primary' : 'btn-disabled'}`}
                          disabled={!producto.disponible}
                          onClick={() => producto.disponible && addItem(producto)}
                          style={!producto.disponible ? { pointerEvents: 'none' } : {}}
                        >
                          {producto.disponible ? 'Comprar' : 'Agotado'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sin resultados */}
          {!cargando && productos.length === 0 && !error && (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <h3>No se encontraron productos</h3>
              <p>Intenta ajustar los filtros de búsqueda o explora nuestras categorías.</p>
              <button onClick={limpiarFiltros} className="btn btn-primary">
                Ver Todos los Productos
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}