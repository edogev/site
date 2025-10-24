// src/components/BotCarousel.js
import { useState, useEffect } from 'react';

export default function BotCarousel({ slides }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselKey, setCarouselKey] = useState(0);

  // Полный сброс при изменении slides
  useEffect(() => {
    setCurrentSlide(0);
    setCarouselKey(prev => prev + 1); // Принудительная перерисовка
  }, [slides]);

  // Защита от выхода за границы массива
  useEffect(() => {
    if (slides && slides.length > 0 && currentSlide >= slides.length) {
      setCurrentSlide(0);
    }
  }, [slides, currentSlide]);

  const nextSlide = () => {
    if (!slides || slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    if (!slides || slides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    if (!slides || slides.length === 0) return;
    setCurrentSlide(index);
  };

  // Защита от undefined
  if (!slides || slides.length === 0) {
    return (
      <div className="modern-carousel">
        <div className="carousel-header">
          <div className="slide-counter">
            <span className="current-slide">0</span>
            <span className="slide-divider">/</span>
            <span className="total-slides">0</span>
          </div>
        </div>
        <div className="carousel-content">
          <p>Нет данных для отображения</p>
        </div>
      </div>
    );
  }

  const currentSlideData = slides[currentSlide] || {};
  const hasImage = currentSlideData?.image && currentSlideData.image.trim() !== '';

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    const placeholder = e.target.nextSibling;
    if (placeholder) placeholder.style.display = 'block';
  };

  const handleImageLoad = (e) => {
    e.target.style.display = 'block';
    const placeholder = e.target.nextSibling;
    if (placeholder) placeholder.style.display = 'none';
  };

  return (
    <div key={carouselKey} className="modern-carousel">
      <div className="carousel-header">
        <div className="slide-counter">
          <span className="current-slide">{currentSlide + 1}</span>
          <span className="slide-divider">/</span>
          <span className="total-slides">{slides.length}</span>
        </div>
      </div>

      <div className="carousel-content">
        <button 
          className="carousel-nav-btn prev"
          onClick={prevSlide}
          aria-label="Previous slide"
          disabled={slides.length <= 1}
        >
          <span>‹</span>
        </button>

        <div className="slide-container">
          <div className={`slide-content ${hasImage ? 'with-image' : 'text-only'}`}>
            <div className="slide-text">
              <h3>{currentSlideData?.title || "Заголовок отсутствует"}</h3>
              <p>{currentSlideData?.content || "Описание отсутствует"}</p>
              {currentSlideData?.features && (
                <div className="slide-features">
                  {currentSlideData.features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <span className="feature-icon">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {hasImage ? (
              <div className="slide-image">
                <img 
                  key={`${currentSlideData.image}-${currentSlide}`}
                  src={currentSlideData.image} 
                  alt={currentSlideData.title || "Изображение"}
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                />
                <div className="image-placeholder">
                  <span>🖼️</span>
                  <p>Изображение не загружено</p>
                </div>
              </div>
            ) : (
              <div className="no-image-message">
                <span>📋</span>
                <p>Детальная информация о функционале</p>
              </div>
            )}
          </div>
        </div>

        <button 
          className="carousel-nav-btn next"
          onClick={nextSlide}
          aria-label="Next slide"
          disabled={slides.length <= 1}
        >
          <span>›</span>
        </button>
      </div>

      {slides.length > 1 && (
        <div className="carousel-footer">
          <div className="carousel-indicators">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}