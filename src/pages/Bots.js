// [file name]: src/pages/Bots.js

import { useState, useEffect } from 'react';
import BotSelector from '../components/BotSelector';
import BotCarousel from '../components/BotCarousel';
import Icon from '../components/Icon';
import { botsData } from '../data/botsData.js';

export default function Bots() {
  const [selectedBot, setSelectedBot] = useState(botsData[0]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('projects');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" className={`projects-section ${isVisible ? 'visible' : ''}`}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Мои Проекты</h2>
          <p className="section-subtitle">
            Telegram боты и автоматизированные системы для бизнеса и образования
          </p>
          <div className="projects-badge">
            <Icon name="rocket" className="carousel-icon" />
            <span>{botsData.length} завершенных проекта</span>
          </div>
        </div>

        <div className="projects-content">
          {/* Карточки проектов сверху */}
          <div className="projects-selector-wrapper">
            <BotSelector 
              bots={botsData} 
              onSelect={setSelectedBot}
              selectedBot={selectedBot}
            />
          </div>
          
          {/* Описание проекта */}
          {selectedBot && (
            <div className="project-details">
              <div className="project-header">
                <div className="project-title">
                  <span className="project-icon">
                    {(() => {
                      const emoji = selectedBot.icon || '';
                      const map = new Map([
                        ['⭐', 'star'],
                        ['🏗️', 'target'],
                      ]);
                      const iconName = map.get(emoji) || 'robot';
                      return <Icon name={iconName} size={36} className="icon-gradient" />;
                    })()}
                  </span>
                  <h3>{selectedBot.name}</h3>
                </div>
                <div className="project-tech-stack">
                  {selectedBot.technologies?.map((tech, index) => (
                    <span key={index} className="tech-badge">{tech}</span>
                  ))}
                </div>
              </div>
              <p className="project-description">{selectedBot.description}</p>
              
              {/* Карусель в самом низу */}
              <div className="project-carousel-wrapper">
                <BotCarousel slides={selectedBot.slides} />
              </div>
            </div>
          )}
        </div>

        <div className="projects-cta">
          <div className="cta-card">
            <h3>Заинтересованы в сотрудничестве?</h3>
            <p>Готов обсудить ваш проект и предложить решение</p>
            <div className="cta-actions">
              <a 
                href="https://t.me/edogev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="cta-button primary"
              >
                <span>Написать в Telegram</span>
                <Icon name="telegram" className="button-icon" />
              </a>
              <a 
                href="https://dzerzhinskiy.hh.ru/resume/036e2e1bff0b44a6a10039ed1f4758324f6835" 
                target="_blank" 
                rel="noopener noreferrer"
                className="cta-button secondary"
              >
                <span>Ссылка на резюме</span>
                <Icon name="file" className="button-icon" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}