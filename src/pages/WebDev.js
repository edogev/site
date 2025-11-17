// src/pages/WebDev.js
import { useEffect, useState, useRef } from 'react';
import { websitesData } from '../data/websitesData';
import Icon from '../components/Icon';

export default function WebDev() {
  const [isVisible, setIsVisible] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const sectionRef = useRef(null);
  const imgRef = useRef(null);
  const contentRef = useRef(null);

  // Zoom/Pan state
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const draggingRef = useRef({ isDragging: false, startX: 0, startY: 0, lastX: 0, lastY: 0 });
  const pinchRef = useRef({ active: false, startDist: 0, startScale: 1, lastCenter: { x: 0, y: 0 } });

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
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  };

  const closeImage = () => {
    setLightboxOpen(false);
    setLightboxSrc(null);
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  };

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const applyBounds = (tx, ty, sc) => {
    const container = contentRef.current;
    const img = imgRef.current;
    if (!container || !img) return { x: tx, y: ty };
    const cRect = container.getBoundingClientRect();
    const iRect = img.getBoundingClientRect();
    // Base image size (without current transform) approximation:
    const baseWidth = iRect.width / scale; // previous scale in closure
    const baseHeight = iRect.height / scale;
    const maxX = Math.max(0, (baseWidth * sc - cRect.width) / 2);
    const maxY = Math.max(0, (baseHeight * sc - cRect.height) / 2);
    return { x: clamp(tx, -maxX, maxX), y: clamp(ty, -maxY, maxY) };
  };

  const setScaleAtPoint = (newScale, clientX, clientY) => {
    newScale = clamp(newScale, 1, 5);
    const img = imgRef.current;
    const container = contentRef.current;
    if (!img || !container) {
      setScale(newScale);
      return;
    }
    const rect = img.getBoundingClientRect();
    const cx = clientX - rect.left - rect.width / 2; // cursor relative to center
    const cy = clientY - rect.top - rect.height / 2;
    const factor = newScale / scale;
    let nx = translate.x - cx * (factor - 1);
    let ny = translate.y - cy * (factor - 1);
    const bounded = applyBounds(nx, ny, newScale);
    setTranslate(bounded);
    setScale(newScale);
  };

  const onWheel = (e) => {
    if (!lightboxOpen) return;
    e.preventDefault();
    const delta = e.deltaY;
    const direction = delta > 0 ? -1 : 1; // zoom out on wheel down
    const zoomStep = 0.15;
    const targetScale = scale * (1 + direction * zoomStep);
    setScaleAtPoint(targetScale, e.clientX, e.clientY);
  };

  const onMouseDown = (e) => {
    if (scale === 1) return; // панорамирование только при зуме
    e.preventDefault();
    draggingRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      lastX: translate.x,
      lastY: translate.y,
    };
  };
  const onMouseMove = (e) => {
    if (!draggingRef.current.isDragging) return;
    const dx = e.clientX - draggingRef.current.startX;
    const dy = e.clientY - draggingRef.current.startY;
    const nx = draggingRef.current.lastX + dx;
    const ny = draggingRef.current.lastY + dy;
    const bounded = applyBounds(nx, ny, scale);
    setTranslate(bounded);
  };
  const onMouseUp = () => {
    draggingRef.current.isDragging = false;
  };

  const distance = (t1, t2) => {
    const dx = t2.clientX - t1.clientX;
    const dy = t2.clientY - t1.clientY;
    return Math.hypot(dx, dy);
  };

  const centerPoint = (t1, t2) => ({ x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2 });

  const onTouchStart = (e) => {
    if (e.touches.length === 2) {
      const [t1, t2] = e.touches;
      pinchRef.current = {
        active: true,
        startDist: distance(t1, t2),
        startScale: scale,
        lastCenter: centerPoint(t1, t2),
      };
    } else if (e.touches.length === 1 && scale > 1) {
      const t = e.touches[0];
      draggingRef.current = {
        isDragging: true,
        startX: t.clientX,
        startY: t.clientY,
        lastX: translate.x,
        lastY: translate.y,
      };
    }
  };

  const onTouchMove = (e) => {
    if (pinchRef.current.active && e.touches.length === 2) {
      e.preventDefault();
      const [t1, t2] = e.touches;
      const dist = distance(t1, t2);
      const center = centerPoint(t1, t2);
      const newScale = clamp(pinchRef.current.startScale * (dist / pinchRef.current.startDist), 1, 5);
      setScaleAtPoint(newScale, center.x, center.y);
    } else if (draggingRef.current.isDragging && e.touches.length === 1) {
      const t = e.touches[0];
      const dx = t.clientX - draggingRef.current.startX;
      const dy = t.clientY - draggingRef.current.startY;
      const nx = draggingRef.current.lastX + dx;
      const ny = draggingRef.current.lastY + dy;
      const bounded = applyBounds(nx, ny, scale);
      setTranslate(bounded);
    }
  };

  const onTouchEnd = () => {
    pinchRef.current.active = false;
    draggingRef.current.isDragging = false;
  };

  const onDblClick = (e) => {
    if (scale === 1) setScaleAtPoint(2, e.clientX, e.clientY);
    else {
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    }
  };

  const onImageClick = () => {
    // Закрываем по клику, только если нет зума и не идёт перетаскивание
    if (scale === 1 && !draggingRef.current.isDragging) {
      closeImage();
    }
  };

  const zoomIn = () => setScaleAtPoint(scale * 1.25, window.innerWidth / 2, window.innerHeight / 2);
  const zoomOut = () => setScaleAtPoint(scale / 1.25, window.innerWidth / 2, window.innerHeight / 2);
  const resetZoom = () => { setScale(1); setTranslate({ x: 0, y: 0 }); };

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
          <div
            className="lightbox-content"
            ref={contentRef}
            onClick={(e) => e.stopPropagation()}
            onWheel={onWheel}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{ touchAction: 'none', overscrollBehavior: 'contain' }}
          >
            <button className="lightbox-close" aria-label="Закрыть" onClick={closeImage}>
              <Icon name="x" />
            </button>

            <div className="lightbox-toolbar">
              <button className="toolbar-btn" onClick={zoomOut} aria-label="Уменьшить"><span>-</span></button>
              <button className="toolbar-btn" onClick={resetZoom} aria-label="Сбросить">100%</button>
              <button className="toolbar-btn" onClick={zoomIn} aria-label="Увеличить"><span>+</span></button>
            </div>

            {lightboxSrc && (
              <img
                ref={imgRef}
                src={lightboxSrc}
                alt="Превью сайта"
                onDoubleClick={onDblClick}
                onMouseDown={onMouseDown}
                onClick={onImageClick}
                style={{
                  cursor: scale > 1 ? (draggingRef.current.isDragging ? 'grabbing' : 'grab') : 'zoom-out',
                  transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                  transition: draggingRef.current.isDragging ? 'none' : 'transform 0.15s ease',
                  transformOrigin: 'center center',
                  userSelect: 'none',
                }}
                draggable={false}
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
