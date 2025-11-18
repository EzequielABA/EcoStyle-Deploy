import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productosAPI, categoriasAPI, formatearPrecio } from '../services/api'
import '../styles/common.css'
import '../styles/home.css'
import '../styles/product-card.css'
import 'primeicons/primeicons.css';
import Slider from '../components/Slider'



export default function Home() {
  const [productosDestacados, setProductosDestacados] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // Mapeo de imágenes por categoría (normalizado)
  const CATEGORY_IMAGES = {
    'alimentacion': 'https://ecostyle.infinityfree.me/images/categorias/Alimentación.png',
    'cuidado-personal': 'https://ecostyle.infinityfree.me/images/categorias/Cuidado-Personal.png',
    'hogar-sostenible': 'https://ecostyle.infinityfree.me/images/categorias/Hogar-Sostenible.png',
    'moda-consciente': 'https://ecostyle.infinityfree.me/images/categorias/Moda-Consciente.png',
  }

  const normalizeCategoryName = (name) => {
    return String(name || '')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quitar acentos
      .trim().toLowerCase()
      .replace(/\s+/g, '-')
  }

  // //usa la del backend si existe, si no mapeo por nombre o fallback único
  const getCategoriaImagen = (cat) => {
    if (cat?.imagen && String(cat.imagen).trim().length > 0) return cat.imagen
    const key = normalizeCategoryName(cat?.nombre)
    return CATEGORY_IMAGES[key] || `https://ecostyle.infinityfree.me/images/categoria-${cat?.id}/600/400`
  }

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true)
        const [productos, catsResponse] = await Promise.all([
          productosAPI.obtenerDestacados(6),
          categoriasAPI.obtenerConConteo()
        ])
        
        setProductosDestacados(productos)
        setCategorias(catsResponse.data ? catsResponse.data.slice(0, 4) : []) // Solo mostrar 4 categorías
      } catch (err) {
        setError(err.message)
        console.error('Error al cargar datos:', err)
      } finally {
        setCargando(false)
      }
    }

    cargarDatos()
  }, [])

  if (error) {
    return (
      <div className="container">
        <div className="error-message">
          <p>Error al cargar los datos: {error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="container">
            <div className="hero-text fade-in">
              <p className="hero-tagline hero-slogan">
                <span className="hero-tagline-text">
                  Tu estilo, en armonía con el planeta.
                </span>
              </p>
              <h1 className="hero-title">
                Moda Sostenible 
                <span className="hero-accent">para el Futuro</span>
              </h1>
              <p className="hero-description">
                Descubre nuestra colección de ropa eco-friendly. Cada pieza está diseñada 
                con materiales sostenibles y procesos responsables para cuidar nuestro planeta.
              </p>
              <div className="hero-actions">
                <Link to="/products" className="btn btn-primary">
                  Ver Productos
                </Link>
                <Link to="/contact" className="btn btn-outline">
                  Contactanos
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <Slider/>
        </div>
      </section>

      {/* Valores Section */}
      <section className="section">
        <div className="container">
          <div className="section-header fade-in">
            <h2 className="section-title">Nuestros Valores</h2>
            <p className="section-description">
              Compromiso con el planeta y las personas que lo habitan
            </p>
          </div>
          
          <div className="values-grid">
            <div className="value-card scale-in">
              <div className="value-icon" aria-hidden="true">
                <i className="pi pi-heart"></i>
              </div>
              <h3 className="value-title">Materiales Eco</h3>
              <p className="value-description">
                Utilizamos bambú, algodón orgánico y materiales reciclados para crear prendas duraderas.
              </p>
            </div>  
            
            <div className="value-card scale-in">
              <div className="value-icon" aria-hidden="true">
                <i className="pi pi-shield"></i>
              </div>
              <h3 className="value-title">Producción Responsable</h3>
              <p className="value-description">
                Procesos de bajo impacto ambiental y condiciones de trabajo dignas para todos.
              </p>
            </div>
            
            <div className="value-card scale-in">
              <div className="value-icon" aria-hidden="true">
                <i className="pi pi-clock"></i>
              </div>
              <h3 className="value-title">Diseño Atemporal</h3>
              <p className="value-description">
                Creamos piezas que duran en el tiempo con estilos que trascienden las tendencias.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías Section */}
      {categorias.length > 0 && (
        <section className="section bg-light">
          <div className="container">
            <div className="section-header fade-in">
              <h2 className="section-title">Nuestras Categorías</h2>
              <p className="section-description">
                Explora nuestra amplia gama de productos sostenibles
              </p>
            </div>
            
            <div className="categories-grid">
              {categorias.map((categoria) => (
                <Link 
                  key={categoria.id} 
                  to={`/products?categoria=${categoria.id}`}
                  className="category-card scale-in"
                >
                  <div className="category-image">
                    <img 
                      src={getCategoriaImagen(categoria)} 
                      alt={categoria.nombre}
                      loading="lazy"
                    />
                  </div>
                  <div className="category-content">
                    <h3 className="category-name">{categoria.nombre}</h3>
                    <p className="category-count">
                      {categoria.total_productos || 0} productos
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Productos Destacados Section */}
      {productosDestacados.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header fade-in">
              <h2 className="section-title">Productos Destacados</h2>
              <p className="section-description">
                Descubre nuestras piezas más populares y sostenibles
              </p>
            </div>
            
            <div className="products-grid">
              {productosDestacados.map((producto) => (
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
                  </div>
                  <div className="product-content">
                    <h3 className="product-name">{producto.nombre}</h3>
                    <p className="product-description">{producto.descripcion}</p>
                    <div className="product-footer">
                      <span className="product-price">
                        {formatearPrecio(producto.precio)}
                      </span>
                      <Link 
                        to={`/products/${producto.id}`}
                        className="btn btn-sm btn-primary"
                      >
                        Ver Detalles
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="section-footer fade-in">
              <Link to="/products" className="btn btn-outline">
                Ver Todos los Productos
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Cargando */}
      {cargando && (
        <section className="section">
          <div className="container">
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Cargando productos...</p>
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="section bg-primary text-white">
        <div className="container">
          <div className="about-content fade-in">
            <div className="section-title-tb">
              <h2 className="section-title">Sobre</h2>
             <img src="/src/assets/images/ico/logo-vr2.png" alt="EcoStyle RD" className='logo-about' style={{ width: '300px' }} />
            </div>
            <p className="section-description">
              Nacimos con la misión de transformar la industria de la moda en República Dominicana. 
              Creemos que cada compra puede ser una decisión consciente que contribuya a un futuro 
              más sostenible para nuestro planeta y las generaciones venideras.
            </p>
            <div className="about-stats">
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Productos Eco</span>
              </div>
              <div className="stat">
                <span className="stat-number">1000+</span>
                <span className="stat-label">Clientes Felices</span>
              </div>
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Materiales Sostenibles</span>
              </div>
            </div>
            <Link to="/contact" className="btn btn-white">
              Conoce Más
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}