// src/pages/WebDev.js
import { useEffect, useState, useRef } from 'react';
import { websitesData } from '../data/websitesData';
import Icon from '../components/Icon';

export default function WebDev() {
  const [isVisible, setIsVisible] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (lightboxOpen && e.key === 'Escape') {
        setLightboxOpen(false);
        setLightboxSrc(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxOpen]);

  const openImage = (src) => {
    setLightboxSrc(src);
    setLightboxOpen(true);
  };

  const closeImage = () => {
    setLightboxOpen(false);
    setLightboxSrc(null);
  };

  return (
    <section id="webdev" ref={sectionRef} className={`projects-section ${isVisible ? 'visible' : ''}`}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Разработка сайтов</h2>
          <p className="section-subtitle">Примеры реализованных проектов: корпоративные сайты, лендинги, интернет-магазины</p>
          <div className="projects-badge">
            <Icon name="rocket" className="carousel-icon" />
            <span>{websitesData.length} примеров работ</span>
          </div>
        </div>

        <div className="webdev-grid">
          {websitesData.map((site) => (
            <div key={site.id} className="webdev-card">
              <div className="webdev-thumb" onClick={() => openImage(site.image)}>
                <img
                  src={site.image}
                  alt={site.title}
                  loading="lazy"
                />
              </div>
              <div className="webdev-info">
                <h3 className="webdev-title">{site.title}</h3>
                <p className="webdev-desc">{site.description}</p>
                <button className="cta-button secondary" onClick={() => openImage(site.image)}>
                  <span>Открыть изображение</span>
                  <Icon name="image" className="button-icon" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightboxOpen && (
        <div className="lightbox-overlay" role="dialog" aria-modal="true" onClick={closeImage}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" aria-label="Закрыть" onClick={closeImage}>
              <Icon name="x" />
            </button>
            {lightboxSrc && (
              <img
                src={lightboxSrc}
                alt="Превью сайта"
                onClick={closeImage} // повторное нажатие по изображению закрывает лайтбокс
                style={{ cursor: 'zoom-out' }}
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
