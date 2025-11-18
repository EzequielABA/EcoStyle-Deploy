import React, { useState } from 'react';

function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setStatus('Por favor ingresa tu email');
      return;
    }
    
    // Simular suscripción
    setStatus('¡Gracias por suscribirte! Te mantendremos informado.');
    setEmail('');
    
    // Limpiar mensaje después de 3 segundos
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <section className="newsletter-section">
      <div className="container">
        <div className="newsletter-content reveal">
          <div className="newsletter-text">
            <h2 className="newsletter-title">Mantente al día</h2>
            <p className="newsletter-subtitle">
              Suscríbete a nuestro boletín y recibe las últimas noticias sobre productos sostenibles, 
              ofertas especiales y consejos para un estilo de vida más eco-amigable.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="newsletter-form reveal reveal-delay">
            <div className="newsletter-input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu dirección de email"
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-btn">
                Suscribirse
              </button>
            </div>
            {status && <p className="newsletter-status">{status}</p>}
          </form>
        </div>
        
        <div className="newsletter-features reveal reveal-delay">
          <div className="newsletter-feature">
            <span className="newsletter-icon">📧</span>
            <span>Noticias semanales</span>
          </div>
          <div className="newsletter-feature">
            <span className="newsletter-icon">🎁</span>
            <span>Ofertas exclusivas</span>
          </div>
          <div className="newsletter-feature">
            <span className="newsletter-icon">🌱</span>
            <span>Tips eco-amigables</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Newsletter;