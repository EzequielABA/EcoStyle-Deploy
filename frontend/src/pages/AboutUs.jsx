import React from 'react';
import '../styles/common.css';
import '../styles/about-faq.css';
import 'primeicons/primeicons.css';

function AboutUs() {
  return (
    <div className="container page-content">
      <section className="about-section fade-in">
        <h1 className="page-title">Sobre Nosotros</h1>

        <section className='scale-in'></section>
        
        <div className="about-content">
          <div className="about-image">
            <img src="https://ecostyle.infinityfree.me/images/SobreNosotros-tienda/tienda-fisica.png"  alt="Equipo EcoStyle" className="rounded-image" />
          </div>
          
          <div className="about-text">
            <h2>Nuestra Historia</h2>
            <p>
              EcoStyle nació en 2020 con una visión clara: ofrecer productos sostenibles y ecológicos 
              sin comprometer el estilo ni la calidad. Fundada por un grupo de entusiastas del medio ambiente, 
              nuestra empresa se ha convertido en un referente en moda y productos sostenibles en República Dominicana.
            </p>
          </div>
        </div>
        
        {/* Misión, Visión y Valores en tarjetas horizontales */}
        <div className="mvv-cards">
          <div className="mvv-card fade-in">
            <div className="mvv-icon">
              <i className="pi pi-bullseye" style={{ fontSize: '3.5rem', color: 'var(--primary)' }} />
            </div>
            <h2>Nuestra Misión</h2>
            <p>
              Ofrecer productos ecológicos de alta calidad que contribuyan al bienestar de las personas y al cuidado del entorno, fomentando una cultura de sostenibilidad en cada hogar dominicano.
            </p>
          </div>
          
          <div className="mvv-card fade-in">
            <div className="mvv-icon">
              <i className="pi pi-eye" style={{ fontSize: '3.5rem', color: 'var(--primary)' }} />
            </div>
            <h2>Nuestra Visión</h2>
            <p>
              Ser la tienda líder en soluciones sostenibles en República Dominicana, reconocida por nuestra innovación, compromiso ambiental y responsabilidad social.
            </p>
          </div>
          
          <div className="mvv-card fade-in">
            <div className="mvv-icon">
              <i className="pi pi-heart" style={{ fontSize: '3.5rem', color: 'var(--primary)' }} />
            </div>
            <h2>Nuestros Valores</h2>
            <ul className="values-list">
              <li><strong>Sostenibilidad:</strong> Cada producto es seleccionado considerando su impacto ambiental.</li>
              <li><strong>Transparencia:</strong> Compartimos abiertamente nuestros procesos y orígenes de productos.</li>
              <li><strong>Calidad:</strong> No comprometemos la durabilidad ni el diseño en nuestros productos.</li>
              <li><strong>Comunidad:</strong> Apoyamos a artesanos y productores locales.</li>
            </ul>
          </div>
        </div>
      </section>
      

      <section className="team-section scale-in">
        <h2 className="section-title">Nuestro Equipo</h2>
        <div className="team-grid">
          <div className="team-member">
            <div className="member-image">
              <img src="https://yt3.googleusercontent.com/ytc/AIdro_mLqPYWAvHCPjfHQFENyCfcYL--3Na3sQBOqSsRuMW5liuo=s160-c-k-c0x00ffffff-no-rj" alt="Miembro del equipo" />
            </div>
            <h3>Sunilda Hernández Moreno</h3>
            <p>Fundadora & CEO</p>
          </div>
          
          <div className="team-member">
            <div className="member-image">
              <img src="https://virtual.cristoobrero.edu.do/v1/timthumb.php?src=https://storage.googleapis.com/educoco2020/57/profesores/25/profesores25_16624783167MWze1HnnYhiDoM.jpg&w=150&h=150&q=100" alt="Miembro del equipo" />
            </div>
            <h3>Andris Antonio López</h3>
            <p>Director de Sostenibilidad</p>
          </div>
          
          <div className="team-member">
            <div className="member-image">
              <img src="https://virtual.cristoobrero.edu.do/v1/timthumb.php?src=https://storage.googleapis.com/educoco2020/57/profesores/12/profesores12_1605280336ZLaiRAFTGxArPNb.jpg&w=150&h=150&q=100" alt="Miembro del equipo" />
            </div>
            <h3>Andry Altagracia</h3>
            <p>Diseñadora de Productos</p>
          </div>
        </div>
      </section>
      
      <section className="commitment-section fade-in">
        <h2 className="section-title">Nuestro Compromiso</h2>
        <div className="commitment-content">
          <div className="commitment-item">
            <div className="icon">🌱</div>
            <h3>Materiales Sostenibles</h3>
            <p>Utilizamos materiales reciclados, orgánicos y de bajo impacto ambiental.</p>
          </div>
          
          <div className="commitment-item">
            <div className="icon">♻️</div>
            <h3>Embalaje Eco-amigable</h3>
            <p>Todos nuestros envíos utilizan materiales reciclados y biodegradables.</p>
          </div>
          
          <div className="commitment-item">
            <div className="icon">🤝</div>
            <h3>Comercio Justo</h3>
            <p>Garantizamos condiciones justas para todos nuestros proveedores y artesanos.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;