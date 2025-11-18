import React from 'react';

const testimonials = [
  {
    id: 1,
    name: "María González",
    role: "Cliente frecuente",
    content: "Los productos de EcoStyle RD son increíbles. La calidad es excelente y me encanta saber que estoy contribuyendo al cuidado del medio ambiente.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    role: "Empresario",
    content: "Excelente servicio y productos de alta calidad. He recomendado EcoStyle RD a todos mis colegas. La atención al cliente es excepcional.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Ana Martínez",
    role: "Diseñadora",
    content: "Como diseñadora, valoro mucho la estética y la funcionalidad. EcoStyle RD combina perfectamente ambos aspectos con un enfoque sostenible.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  }
];

function Testimonials() {
  return (
    <section className="section">
      <div className="container">
        <div className="reveal">
          <h2 className="section-title">Lo que dicen nuestros clientes</h2>
          <p className="section-sub">Testimonios reales de personas que confían en nosotros</p>
        </div>
        
        <div className="testimonials-grid reveal reveal-delay">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-content">
                <div className="testimonial-stars">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="star">★</span>
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.content}"</p>
              </div>
              <div className="testimonial-author">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="testimonial-avatar"
                />
                <div className="testimonial-info">
                  <h4 className="testimonial-name">{testimonial.name}</h4>
                  <p className="testimonial-role">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;