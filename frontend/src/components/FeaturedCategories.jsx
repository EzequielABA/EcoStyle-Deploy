import '../styles/home.css'
import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 1,
    name: "Ropa Sostenible",
    description: "Prendas fabricadas con materiales orgánicos y procesos eco-amigables",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
    link: "/products?category=ropa",
    count: "25+ productos"
  },
  {
    id: 2,
    name: "Accesorios Eco",
    description: "Complementos únicos hechos con materiales reciclados",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
    link: "/products?category=accesorios",
    count: "15+ productos"
  },
  {
    id: 3,
    name: "Hogar Verde",
    description: "Productos para el hogar que respetan el medio ambiente",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    link: "/products?category=hogar",
    count: "20+ productos"
  },
  {
    id: 4,
    name: "Belleza Natural",
    description: "Cosméticos y productos de cuidado personal naturales",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
    link: "/products?category=belleza",
    count: "12+ productos"
  }
];

function FeaturedCategories() {
  return (
    <section className="section" style={{ background: 'rgba(44,71,31,0.03)' }}>
      <div className="container">
        <div className="reveal">
          <h2 className="section-title">Nuestras Categorías</h2>
          <p className="section-sub">Explora nuestras colecciones de productos sostenibles</p>
        </div>
        
        <div className="categories-grid reveal reveal-delay">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              to={category.link}
              className="category-card"
            >
              <div className="category-image">
                <img src={category.image} alt={category.name} />
                <div className="category-overlay">
                  <span className="category-count">{category.count}</span>
                </div>
              </div>
              <div className="category-content">
                <h3 className="category-name">{category.name}</h3>
                <p className="category-description">{category.description}</p>
                <span className="category-link-text">Ver productos →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedCategories;