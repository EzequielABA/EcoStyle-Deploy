import { useState } from 'react'
import { contactoAPI } from '../services/api'
import '../styles/contact.css'
import 'primeicons/primeicons.css';
import { useNotification } from '../contexts/NotificationContext.jsx'

export default function Contact() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    telefono: '',
    mensaje: ''
  })
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState(null)
  const { notify } = useNotification()

  const manejarCambio = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const manejarEnvio = async (e) => {
    e.preventDefault()

    // Validaciones básicas
    if (!formData.nombre.trim() || !formData.email.trim() || !formData.asunto.trim() || !formData.mensaje.trim()) {
      setError('Todos los campos obligatorios deben ser completados')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Por favor ingresa un correo electrónico válido')
      return
    }

    try {
      setEnviando(true)
      setError(null)

      await contactoAPI.enviarMensaje(formData)

      setEnviado(true)
      notify({ type: 'success', message: 'Mensaje enviado correctamente' })
      setFormData({ nombre: '', email: '', asunto: '', telefono: '', mensaje: '' })
    } catch (err) {
      setError(err.message || 'Error al enviar el mensaje')
      notify({ type: 'error', message: err.message || 'Error al enviar el mensaje' })
    } finally {
      setEnviando(false)
    }
  }


  return (
    <div className="contact-page">
      {/* Notificaciones globales manejadas por NotificationProvider */}
      {/* Header */}
      <section className="page-header">
        <div className="container">
          <div className="page-header-content fade-in">
            <h1 className="page-title">Contáctanos</h1>
            <p className="page-description">
              ¿Tienes dudas, sugerencias o ideas? Nos encantaría escucharte y ayudarte.
            </p>
          </div>
          {enviado && (
            <div className="success-message fade-in" style={{ marginTop: '16px' }}>
              <div className="success-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22,4 12,14.01 9,11.01" />
                </svg>
              </div>
              <h2 className="success-title">¡Mensaje Enviado!</h2>
              <p className="success-description">
                Gracias por contactarnos. Hemos recibido tu mensaje y te responderemos pronto.
              </p>
              <button
                onClick={() => setEnviado(false)}
                className="btn btn-primary"
              >
                Enviar Otro Mensaje
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Contenido principal */}
      <section className="contact-content">
        <div className="container">
          <div className="contact-grid">
            {/* Información de contacto */}
            <div className="contact-info fade-in">
              <h2>Información de Contacto</h2>
              <p>
                Estamos aquí para ayudarte con cualquier pregunta sobre nuestros productos
                sostenibles o para escuchar tus ideas sobre moda eco-friendly.
              </p>

              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="pi pi-calendar-minus" style={{ color: '#ffff', fontSize: '1.5rem' }} />
                  </div>
                  <div>
                    <h3>Correo Electrónico</h3>
                    <p>info@ecostylerd.com</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="pi pi-phone" style={{ color: '#ffff', fontSize: '1.5rem' }} />
                  </div>
                  <div>
                    <h3>Teléfono</h3>
                    <p>+1 (809) 123-4567</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="pi pi-map-marker" style={{ color: '#ffff', fontSize: '1.5rem' }} />
                  </div>
                  <div>
                    <h3>Ubicación</h3>
                    <p>Santo Domingo, República Dominicana</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="pi pi-clock" style={{ color: '#ffff', fontSize: '1.5rem' }} />
                  </div>
                  <div>
                    <h3>Horario de Atención</h3>
                    <p>Lunes a Viernes: 9:00 AM - 6:00 PM</p>
                    <p>Sábados: 10:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario */}
            <div className="contact-form-container scale-in">
              <form onSubmit={manejarEnvio} className="contact-form">
                <h2>Envíanos un Mensaje</h2>

                {error && (
                  <div className="error-message">
                    <p>{error}</p>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="nombre">Nombre Completo *</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={manejarCambio}
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Correo Electrónico *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={manejarCambio}
                    placeholder="tu@email.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="asunto">Asunto *</label>
                  <input
                    type="text"
                    id="asunto"
                    name="asunto"
                    value={formData.asunto}
                    onChange={manejarCambio}
                    placeholder="Motivo de tu mensaje"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="telefono">Teléfono (opcional)</label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={manejarCambio}
                    placeholder="Ej: +1 809 123 4567"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="mensaje">Mensaje *</label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={manejarCambio}
                    placeholder="Cuéntanos en qué podemos ayudarte..."
                    rows="6"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-full"
                  disabled={enviando}
                >
                  {enviando ? (
                    <>
                      <div className="spinner-sm"></div>
                      Enviando...
                    </>
                  ) : (
                    'Enviar Mensaje'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Sección adicional */}
      <section className="section bg-light">
        <div className="container">
          <div className="contact-cta fade-in">
            <h2>¿Prefieres Visitarnos?</h2>
            <p>
              También puedes conocer nuestros productos en persona. Estamos ubicados en el
              corazón de Santo Domingo, donde podrás ver y sentir la calidad de nuestros
              materiales sostenibles.
            </p>
            <div className="contact-actions">
              <a
                href="https://maps.app.goo.gl/L69voG3iSow7hDFw9"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                Ver en Mapa
              </a>
              <a
                href="tel:+8294872278"
                className="btn btn-primary"
              >
                Llamar Ahora
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}