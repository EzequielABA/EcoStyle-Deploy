import { useState, useEffect, useRef } from 'react'
import '../styles/slider.css'

const slides = [
  {
    id: 1,
    title: "Moda Sostenible",
    subtitle: "Descubre nuestra nueva colección eco-friendly",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
    cta: "Ver Colección"
  },
  {
    id: 2,
    title: "Estilo Consciente",
    subtitle: "Prendas que cuidan el planeta y tu estilo",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=600&fit=crop",
    cta: "Explorar"
  },
  {
    id: 3,
    title: "Calidad Premium",
    subtitle: "Materiales orgánicos y diseños únicos",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=600&fit=crop",
    cta: "Comprar Ahora"
  }
]

export default function Slider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef(null)
  const progressRef = useRef(null)
  const slideDuration = 5000 // 5 segundos por slide
  
  // Iniciar o detener el slider automático
  useEffect(() => {
    if (isPlaying) {
      startSlideTimer()
    } else {
      clearInterval(intervalRef.current)
      clearInterval(progressRef.current)
    }
    
    return () => {
      clearInterval(intervalRef.current)
      clearInterval(progressRef.current)
    }
  }, [isPlaying, currentSlide])
  
  // Función para iniciar el temporizador del slider
  const startSlideTimer = () => {
    // Limpiar intervalos anteriores
    clearInterval(intervalRef.current)
    clearInterval(progressRef.current)
    
    // Resetear el progreso
    setProgress(0)
    
    // Iniciar el contador de progreso (actualiza cada 50ms)
    progressRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          return 0
        }
        return prev + (100 / (slideDuration / 50))
      })
    }, 50)
    
    // Iniciar el temporizador para cambiar de slide
    intervalRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length)
    }, slideDuration)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
    if (isPlaying) {
      startSlideTimer()
    }
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    if (isPlaying) {
      startSlideTimer()
    }
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    if (isPlaying) {
      startSlideTimer()
    }
  }
  
  // Calcular el tiempo restante en segundos
  const remainingTime = Math.ceil((100 - progress) / 100 * slideDuration / 1000)

  return (
    <div className="slider reveal">
      <div className="slider-container">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="slide-overlay">
              <div className="slide-content container">
                <h2 className="slide-title">{slide.title}</h2>
                <p className="slide-subtitle">{slide.subtitle}</p>
                <button className="btn btn-primary slide-cta">{slide.cta}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="slider-controls">
        <div className="slider-progress-container">
          <div className="slider-timer">
            <span className="slider-counter">{remainingTime}s</span>
            <div className="slider-progress-bar">
              <div 
                className="slider-progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="slider-buttons">
            <button className="slider-control-btn" onClick={prevSlide} aria-label="Anterior">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <button className="slider-control-btn play-pause" onClick={togglePlayPause} aria-label={isPlaying ? "Pausar" : "Reproducir"}>
              {isPlaying ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" />
                  <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M6 4L20 12L6 20V4Z" fill="currentColor" />
                </svg>
              )}
            </button>
            
            <button className="slider-control-btn" onClick={nextSlide} aria-label="Siguiente">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="slider-indicator">
          <span className="current-slide">{currentSlide + 1}</span>
          <span className="slide-separator">/</span>
          <span className="total-slides">{slides.length}</span>
        </div>
      </div>
      
      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Ir a la diapositiva ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}