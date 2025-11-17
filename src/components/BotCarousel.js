// src/components/BotCarousel.js
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icon';

export default function BotCarousel({ slides, compact = false }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselKey, setCarouselKey] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const touchStartX = useRef(null);
  const containerRef = useRef(null);

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

  // keyboard navigation (left/right) and Esc for lightbox
  useEffect(() => {
    const onKeyDown = (e) => {
      if (isLightboxOpen && e.key === 'Escape') {
        setIsLightboxOpen(false);
        return;
      }
      if (document.activeElement === containerRef.current || containerRef.current?.contains(document.activeElement)) {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isLightboxOpen, slides]);

  // touch swipe
  const onTouchStart = (e) => {
    touchStartX.current = e.touches?.[0]?.clientX ?? null;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const dx = (e.changedTouches?.[0]?.clientX ?? 0) - touchStartX.current;
    const threshold = 40;
    if (dx > threshold) prevSlide();
    else if (dx < -threshold) nextSlide();
    touchStartX.current = null;
  };

  const openLightbox = (src) => {
    if (!src || src.trim() === '') return; // не открываем без изображения
    setLightboxSrc(src);
    setIsLightboxOpen(true);
  };
  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setLightboxSrc(null);
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
    <div
      key={carouselKey}
      className={`modern-carousel ${compact ? 'compact' : ''}`}
      ref={containerRef}
      tabIndex={0}
      aria-label="Карусель слайдов"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
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
          <Icon name="chevronLeft" className="carousel-icon" />
        </button>

        <div className="slide-container">
          <div className={`slide-content ${hasImage ? 'with-image' : 'text-only'}`}>
            <div className="slide-text">
              <h3>{currentSlideData?.title || "Заголовок отсутствует"}</h3>
              <p className={compact ? 'text-truncate-2' : ''}>{currentSlideData?.content || "Описание отсутствует"}</p>
              {currentSlideData?.features && (
                compact ? (
                  <div className="feature-chips">
                    {(currentSlideData.features || []).slice(0, 3).map((feature, index) => (
                      <span key={index} className="chip chip-primary">
                        <Icon name="check" className="feature-icon" />
                        {feature}
                      </span>
                    ))}
                    {currentSlideData.features.length > 3 && (
                      <span className="chip chip-muted">+{currentSlideData.features.length - 3}</span>
                    )}
                  </div>
                ) : (
                  <div className="slide-features">
                    {currentSlideData.features.map((feature, index) => (
                      <div key={index} className="feature-item">
                        <Icon name="check" className="feature-icon" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                )
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
                  onClick={() => openLightbox(currentSlideData.image)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openLightbox(currentSlideData.image); }}
                />
                <div className="image-placeholder">
                  <Icon name="image" size={48} className="carousel-icon" />
                  {!compact && <p>Изображение не загружено</p>}
                </div>
              </div>
            ) : (
              <div className="no-image-message">
                <Icon name="file" size={48} className="carousel-icon" />
                {!compact && <p>Детальная информация о функционале</p>}
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
          <Icon name="chevronRight" className="carousel-icon" />
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

      {isLightboxOpen && lightboxSrc && createPortal(
        (
          <div className="lightbox-overlay" role="dialog" aria-modal="true" onClick={closeLightbox}>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <button className="lightbox-close" aria-label="Закрыть" onClick={closeLightbox}>
                <Icon name="x" />
              </button>
              {lightboxSrc && (
                <img src={lightboxSrc} alt="Просмотр изображения" />
              )}
            </div>
          </div>
        ),
        document.body
      )}
    </div>
  );
}