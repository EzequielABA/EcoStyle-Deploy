import React, { useState } from 'react';
import '../styles/common.css';

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "¿Cuáles son los métodos de pago aceptados?",
      answer: "Aceptamos tarjetas de crédito/débito (Visa, Mastercard, American Express), PayPal, transferencias bancarias y pago contra entrega en determinadas zonas."
    },
    {
      question: "¿Cuánto tiempo tarda en llegar mi pedido?",
      answer: "Los tiempos de entrega varían según tu ubicación. Para Santo Domingo, generalmente entregamos en 1-2 días hábiles. Para otras provincias, el tiempo estimado es de 2-4 días hábiles. Los envíos internacionales pueden tomar entre 7-14 días hábiles."
    },
    {
      question: "¿Puedo devolver un producto?",
      answer: "Sí, aceptamos devoluciones dentro de los 30 días posteriores a la recepción del producto. El artículo debe estar en su estado original, sin usar y con todas las etiquetas y embalaje original. Para iniciar una devolución, contacta a nuestro servicio al cliente."
    },
    {
      question: "¿Los productos son realmente ecológicos?",
      answer: "Todos nuestros productos cumplen con estrictos estándares de sostenibilidad. Trabajamos exclusivamente con proveedores certificados que utilizan materiales orgánicos, reciclados o de bajo impacto ambiental. Cada producto incluye información detallada sobre su origen y materiales."
    },
    {
      question: "¿Ofrecen envíos internacionales?",
      answer: "Sí, realizamos envíos a varios países de América Latina, Estados Unidos y Europa. Los costos de envío y tiempos de entrega varían según el destino. Puedes calcular el costo exacto en el proceso de checkout."
    },
    {
      question: "¿Cómo puedo rastrear mi pedido?",
      answer: "Una vez que tu pedido sea enviado, recibirás un correo electrónico con el número de seguimiento y un enlace para rastrear tu paquete. También puedes verificar el estado de tu pedido iniciando sesión en tu cuenta y visitando la sección 'Mis Pedidos'."
    },
    {
      question: "¿Tienen tiendas físicas?",
      answer: "Actualmente contamos con una tienda principal en Santo Domingo y un punto de venta en Santiago. Estamos trabajando para expandir nuestra presencia física. Visita la sección de 'Contacto' para conocer las direcciones exactas y horarios de atención."
    },
    {
      question: "¿Ofrecen descuentos para compras al por mayor?",
      answer: "Sí, ofrecemos precios especiales para compras al por mayor y corporativas. Si estás interesado, por favor contacta a nuestro equipo de ventas a través del formulario en la sección de 'Contacto' o escríbenos directamente a ventas@ecostylerd.com."
    },
    {
      question: "¿Cómo puedo contactar al servicio al cliente?",
      answer: "Puedes contactar a nuestro servicio al cliente a través de nuestro formulario de contacto en la sección 'Contacto' de nuestro sitio web. También puedes llamarnos al número 829-487-2278, y estaremos encantados de ayudarte."
    }, 
    {
      question:"¿Qué significa Zero Waste?",
      answer:"Zero Waste es una filosofía de vida que se enfoca en reducir, reutilizar y reciclar todo lo posible. Buscamos minimizar el impacto ambiental de nuestras actividades y contribuir a un mundo más sostenible."
    },
    {
      question: "¿Cómo puedo contribuir al Zero Waste?",
      answer: "Puedes contribuir al Zero Waste adoptando prácticas sostenibles en tu vida diaria. Recicla, reutiliza y evita la compra de productos desechables. También puedes apoyar a organizaciones comprometidas con la sostenibilidad."
    },
    {
      question: "¿Qué puedo hacer para reducir mi huella de carbono?",
      answer: "Puedes reducir tu huella de carbono adoptando prácticas sostenibles en tu vida diaria. Por ejemplo, opta por transporte público, eléctrico o híbrido, y reduce el uso de plásticos en tu hogar."
    },
    {
      question: "¿Qué significa cada categoría?",
      answer: "Nuestro catálogo está organizado en varias categorías, cada una con productos específicos. Por ejemplo, 'Ropa' incluye todos los artículos de moda, 'Hogar' contiene productos para el hogar .Explora nuestras categorías para encontrar lo que necesitas."
    },
  ];

  return (
    <div className="container page-content">
      <section className="faq-section fade-in">
        <h1 className="page-title">Preguntas Frecuentes</h1>
        
        <p className="faq-intro">
          Encuentra respuestas a las preguntas más comunes sobre nuestros productos, 
          envíos, devoluciones y más. Si no encuentras lo que buscas, no dudes en 
          contactarnos a través de nuestro formulario de contacto.
        </p>
        
        <div className="faq-accordion">
          {faqItems.map((item, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
            >
              <div 
                className="faq-question" 
                onClick={() => toggleAccordion(index)}
              >
                <h3>{item.question}</h3>
                <span className="faq-icon">
                  {activeIndex === index ? '−' : '+'}
                </span>
              </div>
              
              <div className={`faq-answer ${activeIndex === index ? 'open' : ''}`}>
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="additional-help scale-in">
          <h2>¿Necesitas más ayuda?</h2>
          <p>
            Nuestro equipo de atención al cliente está disponible para ayudarte 
            con cualquier consulta adicional que puedas tener.
          </p>
          <div className="help-options">
            <div className="help-option">
              <div className="icon">📞</div>
              <h3>Llámanos</h3>
              <p>809-555-1234</p>
              <p>Lun-Vie: 9am-6pm</p>
            </div>
            
            <div className="help-option">
              <div className="icon">✉️</div>
              <h3>Escríbenos</h3>
              <p>soporte@ecostylerd.com</p>
              <p>Respuesta en 24 horas</p>
            </div>
            
            <div className="help-option">
              <div className="icon">💬</div>
              <h3>Chat en vivo</h3>
              <p>Disponible en horario comercial</p>
              <button className="btn btn-outline">Iniciar chat</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FAQ;