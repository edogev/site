// src/pages/WebDev.js
import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { websitesData } from '../data/websitesData';
import { personalInfo } from '../data/data.js';
import Icon from '../components/Icon';

export default function WebDev({ embedded = false }) {
  const [isVisible, setIsVisible] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [lightboxSite, setLightboxSite] = useState(null);
  const [lightboxTheme, setLightboxTheme] = useState('light');
  const [themeBySite, setThemeBySite] = useState({}); // { [id]: 'light'|'dark' }
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
      if (!lightboxOpen) return;
      if (e.key === 'Escape') {
        setLightboxOpen(false);
        setLightboxSrc(null);
        setLightboxSite(null);
        return;
      }
      if (e.key === '+') {
        zoomIn();
      } else if (e.key === '-') {
        zoomOut();
      } else if (e.key === '0') {
        resetZoom();
      } else if (e.key.toLowerCase && e.key.toLowerCase() === 'f') {
        fitToScreen();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxOpen, scale, translate]);

  const resolveImageSrc = (site, theme) => {
    if (!site) return '';
    if (site.images && (site.images[theme] || site.images.light || site.images.dark)) {
      return site.images[theme] || site.images.light || site.images.dark || '';
    }
    return site.image || '';
  };

  const openImageForSite = (site, initialTheme = 'light') => {
    const src = resolveImageSrc(site, initialTheme);
    if (!src || src.trim() === '') return; // не открываем, если изображения нет
    setLightboxSite(site);
    setLightboxTheme(initialTheme);
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
  const fitToScreen = () => {
    const container = contentRef.current;
    const img = imgRef.current;
    if (!container || !img) return;
    const cRect = container.getBoundingClientRect();
    const natW = img.naturalWidth || img.width;
    const natH = img.naturalHeight || img.height;
    if (!natW || !natH) return;
    const maxW = cRect.width * 0.95;
    const maxH = cRect.height * 0.95;
    const sc = Math.min(maxW / natW, maxH / natH, 5);
    setScale(sc);
    setTranslate({ x: 0, y: 0 });
  };

  const header = (
    <div className="section-header">
      <h2 className="section-title">Разработка сайтов</h2>
      <p className="section-subtitle">Примеры реализованных проектов: корпоративные сайты, лендинги, интернет-магазины</p>
      <div className="projects-badge">
        <Icon name="rocket" className="carousel-icon" />
        <span>{websitesData.length} примеров работ</span>
      </div>
    </div>
  );

  const grid = (
    <div className="webdev-grid">
      {websitesData.map((site) => {
        const hasLight = !!site.images?.light && site.images.light.trim() !== '';
        const hasDark = !!site.images?.dark && site.images.dark.trim() !== '';
        const canToggle = hasLight && hasDark;
        const currentTheme = themeBySite[site.id] || 'light';
        const imageSrc = (currentTheme === 'dark' ? (site.images?.dark || '') : (site.images?.light || ''))
          || site.image || '';
        const hasImage = imageSrc && imageSrc.trim() !== '';

        const setTheme = (theme) => setThemeBySite((prev) => ({ ...prev, [site.id]: theme }));

        return (
          <div key={site.id} className="webdev-card">
            <div
              className={`webdev-thumb ${!hasImage ? 'no-image' : ''}`}
              onClick={hasImage ? () => openImageForSite(site, currentTheme) : undefined}
            >
              {hasImage ? (
                <img src={imageSrc} alt={`${site.title} — ${currentTheme === 'dark' ? 'тёмная' : 'светлая'} тема`} loading="lazy" />
              ) : (
                <div className="image-placeholder">
                  <Icon name="image" size={48} className="carousel-icon" />
                  <p>Нет изображения</p>
                </div>
              )}

              {canToggle && (
                <div className="theme-toggle" onClick={(e) => e.stopPropagation()}>
                  <button
                    className={`theme-chip ${currentTheme === 'light' ? 'active' : ''}`}
                    onClick={() => setTheme('light')}
                    aria-pressed={currentTheme === 'light'}
                  >
                    Light
                  </button>
                  <button
                    className={`theme-chip ${currentTheme === 'dark' ? 'active' : ''}`}
                    onClick={() => setTheme('dark')}
                    aria-pressed={currentTheme === 'dark'}
                  >
                    Dark
                  </button>
                </div>
              )}
            </div>

            <div className="webdev-info">
              <h3 className="webdev-title">{site.title}</h3>
              <p className="webdev-desc">{site.description}</p>
              <div className="webdev-actions">
                <button
                  className="cta-button secondary"
                  onClick={() => openImageForSite(site, currentTheme)}
                  disabled={!hasImage}
                >
                  <span>Открыть изображение</span>
                  <Icon name="image" className="button-icon" />
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Промо-карточка: всегда последняя */}
      <div className="webdev-card promo-card">
        <div className="webdev-thumb no-image">
          <div className="image-placeholder">
            {/* SVG вместо изображения */}
            <svg width="100" height="100" viewBox="0 0 120 120" fill="none">
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="var(--primary)"/>
                  <stop offset="100%" stopColor="var(--secondary)"/>
                </linearGradient>
              </defs>
              <rect x="10" y="10" width="100" height="100" rx="18" stroke="url(#grad)" strokeWidth="4" fill="transparent"/>
              <path d="M30 80 L50 55 L65 70 L90 40" stroke="url(#grad)" strokeWidth="6" fill="none" strokeLinecap="round"/>
              <circle cx="90" cy="40" r="6" fill="var(--accent)"/>
            </svg>
          </div>
        </div>
        <div className="webdev-info">
          <h3 className="webdev-title">Место для вашего сайта</h3>
          <p className="webdev-desc">Современный сайт, который работает на вас 24/7 и привлекает новых клиентов.</p>
          <div className="webdev-actions">
            {(() => {
              const tg = personalInfo?.contacts?.telegram || '';
              const handle = tg.startsWith('@') ? tg.slice(1) : tg;
              const telegramLink = handle ? `https://t.me/${handle}` : 'https://t.me/edogev';
              return (
                <a href={telegramLink} target="_blank" rel="noopener noreferrer" className="cta-button primary">
                  <span>Связаться в Telegram</span>
                  <Icon name="telegram" className="button-icon" />
                </a>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {embedded ? (
        <>
          {header}
          {grid}
        </>
      ) : (
        <section id="webdev" ref={sectionRef} className={`projects-section ${isVisible ? 'visible' : ''}`}>
          <div className="container">
            {header}
            {grid}
          </div>
        </section>
      )}

      {lightboxOpen && lightboxSrc && createPortal(
        (
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
                <button className="toolbar-btn" onClick={resetZoom} aria-label="1:1">{`${Math.round(scale*100)}%`}</button>
                <button className="toolbar-btn" onClick={zoomIn} aria-label="Увеличить"><span>+</span></button>
                <button className="toolbar-btn" onClick={fitToScreen} aria-label="Подогнать">Fit</button>

                {lightboxSite && (
                  (() => {
                    const hasLight = !!lightboxSite.images?.light && lightboxSite.images.light.trim() !== '';
                    const hasDark = !!lightboxSite.images?.dark && lightboxSite.images.dark.trim() !== '';
                    if (!hasLight && !hasDark) return null;
                    return (
                      <div className="theme-toggle" style={{ position: 'static' }}>
                        <button
                          className={`theme-chip ${lightboxTheme === 'light' ? 'active' : ''}`}
                          onClick={() => {
                            const next = 'light';
                            setLightboxTheme(next);
                            setLightboxSrc(resolveImageSrc(lightboxSite, next));
                            setTranslate({ x: 0, y: 0 });
                          }}
                          disabled={!hasLight}
                        >Light</button>
                        <button
                          className={`theme-chip ${lightboxTheme === 'dark' ? 'active' : ''}`}
                          onClick={() => {
                            const next = 'dark';
                            setLightboxTheme(next);
                            setLightboxSrc(resolveImageSrc(lightboxSite, next));
                            setTranslate({ x: 0, y: 0 });
                          }}
                          disabled={!hasDark}
                        >Dark</button>
                      </div>
                    );
                  })()
                )}
              </div>

              {lightboxSrc && (
                <img
                  ref={imgRef}
                  src={lightboxSrc}
                  alt={`Превью сайта (${lightboxTheme})`}
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
        ),
        document.body
      )}
    </>
  );
}
