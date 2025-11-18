import { useEffect, useState } from 'react'
import { Link, Routes, Route, useLocation } from 'react-router-dom'
import { useCart } from './contexts/CartContext.jsx'
import { CartProvider } from './contexts/CartContext.jsx'
import { NotificationProvider } from './contexts/NotificationContext.jsx'
import NavbarCart from './components/NavbarCart.jsx'
import Home from './pages/Home.jsx'
import Products from './pages/Products.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Contact from './pages/Contact.jsx'
import Cart from './pages/Cart.jsx'
import AboutUs from './pages/AboutUs.jsx'
import FAQ from './pages/FAQ.jsx'
import OrderConfirmation from './pages/OrderConfirmation.jsx'
import AddProduct from './pages/AddProduct.jsx';
import './styles/decorative.css'

function AppContent() {
  const location = useLocation()
  const [navOpen, setNavOpen] = useState(false)
  const { items, getCartItemsCount, getCartTotal } = useCart()
  const [floatOpen, setFloatOpen] = useState(false)
  const previewItems = items.slice(0, 6)

  // Animaciones de aparición al scrollear
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })
    
    const scan = () => {
      document.querySelectorAll('.fade-in, .scale-in').forEach((el) => {
        if (!el.classList.contains('visible')) {
          obs.observe(el)
        }
      })
    }
    
    scan()
    const timer = setInterval(scan, 1000)
    return () => { 
      clearInterval(timer)
      obs.disconnect() 
    }
  }, [])

  // Función para determinar si un enlace está activo
  const isActiveLink = (path) => {
    return location.pathname === path
  }

  // Cerrar el menú móvil al cambiar de ruta
  useEffect(() => {
    setNavOpen(false)
  }, [location.pathname])

  return (
    <>
      <header className="site-header">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="brand">
                <img src="/src/assets/images/ico/logo-vr1.png" alt="EcoStyle RD" className="logo" style={{ width: '150px' }} />
            </Link>
            <div className="header-actions">
              <nav className="nav">
                <ul className={`nav-links ${navOpen ? 'mobile-open' : ''}`}>
                  <li>
                    <Link 
                      to="/" 
                      className={`nav-link ${isActiveLink('/') ? 'active' : ''}`}
                    >
                      Inicio
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/products" 
                      className={`nav-link ${isActiveLink('/products') ? 'active' : ''}`}
                    >
                      Productos
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/about" 
                      className={`nav-link ${isActiveLink('/about') ? 'active' : ''}`}
                    >
                      Nosotros
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/faq" 
                      className={`nav-link ${isActiveLink('/faq') ? 'active' : ''}`}
                    >
                      FAQs
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/contact" 
                      className={`nav-link ${isActiveLink('/contact') ? 'active' : ''}`}
                    >
                      Contacto
                    </Link>
                  </li>
                </ul>
                <div className="mobile-controls">
                  <button 
                    className="nav-toggle" 
                    onClick={() => setNavOpen(!navOpen)}
                    aria-label="Toggle navigation"
                  >
                    <i className="pi pi-bars"></i>
                  </button>
                  <div className="cart-wrapper">
                    <NavbarCart />
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main className="floating-elements">
        <div className="floating-leaf-left"></div>
        <div className="floating-leaf-right"></div>
        <div className="floating-bubble bubble-1"></div>
        <div className="floating-bubble bubble-2"></div>
        <div className="floating-bubble bubble-3"></div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orden-confirmacion" element={<OrderConfirmation />} />
          <Route path="/add-product" element={<AddProduct />} />
        </Routes>
      </main>

      <div className={`cart-float ${floatOpen ? 'open' : ''}`}>
        <button className="cart-float-btn" onClick={() => setFloatOpen(!floatOpen)} aria-label="Abrir mini carrito">
          <i className="pi pi-shopping-cart" />
          {getCartItemsCount() > 0 && <span className="cart-float-counter">{getCartItemsCount()}</span>}
        </button>
        <div className="cart-float-panel">
          {getCartItemsCount() === 0 ? (
            <div className="cart-mini-empty">
              <span>Tu carrito está vacío</span>
            </div>
          ) : (
            <div className="cart-mini-content">
              <ul className="cart-mini-list">
                {previewItems.map((it) => (
                  <li key={it.id} className="cart-mini-item">
                    <div className="cart-mini-thumb">
                      <img
                        src={it.imagen || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=60'}
                        alt={it.nombre}
                      />
                    </div>
                    <div className="cart-mini-info">
                      <span className="cart-mini-name">{it.nombre}</span>
                      <span className="cart-mini-meta">{Number(it.cantidad)} × {new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(Number(it.precio))}</span>
                    </div>
                    <div className="cart-mini-total">{new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(Number(it.precio) * Number(it.cantidad))}</div>
                  </li>
                ))}
              </ul>
              <div className="cart-mini-footer">
                <span className="cart-mini-subtotal">Subtotal: {new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(getCartTotal())}</span>
                <div className="cart-mini-actions">
                  <Link to="/cart" className="btn btn-sm btn-primary" onClick={() => setFloatOpen(false)}>Ver carrito</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-content">
            
            <div className="footer-section">
              
              <div className="">
               <img src="/src/assets/images/ico/logo-vr4.png" alt="EcoStyle RD" className="logo" style={{ width: '150px'}} />
              </div>
              <p>Moda sostenible y consciente para un futuro mejor.</p>
            </div>
            <div className="footer-section">
              <h3>Enlaces</h3>
              <ul className="footer-links">
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/products">Productos</Link></li>
                <li><Link to="/contact">Contacto</Link></li>
                <li><Link to="/add-product">Añadir Producto</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Contacto</h3>
              <ul className="footer-links">
                <li>info@ecostylerd.com</li>
                <li>+1 (809) 123-4567</li>
                <li>Santo Domingo, RD</li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Síguenos</h3>
              <ul className="footer-links">
                <li>
                  <i className="pi pi-instagram" style={{ fontSize: '1.3rem',}} />
                  <a href="https://www.instagram.com/ecostylerd03?igsh=NHdnMzdxaWR3Mmtt&utm_source=qr" target="_blank" rel="noopener noreferrer">
                    Instagram
                  </a>
                  </li>
                <li>
                  <i className="pi pi-facebook" style={{ fontSize: '1.3rem',}} />
                  <a href="https://www.facebook.com/share/1DA8YVqGH3/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">
                    Facebook
                    </a>
                  </li>
                <li>
                  <i className="pi pi-twitter" style={{ fontSize: '1.3rem',}} />
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    Twitter
                    </a>
                  </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} EcoStyle RD. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  )
}

function App() {
  return (
    <CartProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </CartProvider>
  )
}

export default App
