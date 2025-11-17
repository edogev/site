import { useState, useEffect, useRef } from 'react';
import Icon from '../components/Icon';
import { botsData } from '../data/botsData.js';
import BotCarousel from '../components/BotCarousel';
import WebDev from './WebDev';

const BotCard = ({ bot, onSelect, isSelected }) => {
  const thumb = bot.slides?.find(s => s.image)?.image || '';
  const emoji = bot.icon || '';
  const map = new Map([
    ['⭐', 'star'],
    ['🏗️', 'target'],
  ]);
  const iconName = map.get(emoji) || 'robot';

  return (
    <div className={`bot-card ${isSelected ? 'selected' : ''}`} onClick={() => onSelect(bot.id)}>
      <div className="bot-thumb">
        {thumb ? (
          <img src={thumb} alt={bot.name} loading="lazy" />
        ) : (
          <div className="image-placeholder">
            <Icon name="image" size={48} className="carousel-icon" />
            <p>Нет изображения</p>
          </div>
        )}
        <div className="bot-thumb-badge">
          <Icon name={iconName} />
        </div>
      </div>
      <div className="bot-info">
        <h3 className="bot-title">{bot.name}</h3>
        <p className="bot-desc">{bot.description}</p>
        <div className="bot-tech">
          {bot.technologies?.slice(0, 4).map((tech, idx) => (
            <span className="tech-tag" key={idx}>{tech}</span>
          ))}
          {bot.technologies && bot.technologies.length > 4 && (
            <span className="tech-tag-more">+{bot.technologies.length - 4}</span>
          )}
        </div>
      </div>
    </div>
  );
};

const BotsGrid = () => {
  const [selectedBotId, setSelectedBotId] = useState(null);
  const detailsRef = useRef(null);

  useEffect(() => {
    if (selectedBotId && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedBotId]);

  const handleSelectBot = (botId) => {
    setSelectedBotId(prevId => (prevId === botId ? null : botId));
  };

  const selectedBot = botsData.find(bot => bot.id === selectedBotId);

  return (
    <div className="projects-content">
      <div className="section-header">
        <h2 className="section-title">Telegram-боты и автоматизация</h2>
        <p className="section-subtitle">
          Примеры реализованных проектов: чат-боты, интеграции, автоматизация процессов
        </p>
        <div className="projects-badge">
          <Icon name="rocket" className="carousel-icon" />
          <span>{botsData.length} примеров работ</span>
        </div>
      </div>
      <div className="bot-grid">
        {botsData.map((bot) => (
          <BotCard 
            key={bot.id} 
            bot={bot} 
            onSelect={handleSelectBot}
            isSelected={selectedBotId === bot.id}
          />
        ))}
      </div>

      {selectedBot && (
        <div className="bot-details-container" ref={detailsRef}>
          <div className="bot-details-card">
            <div className="details-header">
              <h3>{selectedBot.name}</h3>
              <button onClick={() => setSelectedBotId(null)} className="close-details-btn">
                <Icon name="x" />
              </button>
            </div>
            <div className="details-content">
              <div className="details-carousel">
                <BotCarousel slides={selectedBot.slides} />
              </div>
              <div className="details-info">
                <h4>Подробное описание:</h4>
                <p>{selectedBot.fullDescription || selectedBot.description}</p>
                <h4>Технологии:</h4>
                <div className="bot-tech">
                  {selectedBot.technologies?.map((tech, idx) => (
                    <span className="tech-tag" key={idx}>{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Projects() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('bots');

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
            От Telegram ботов до комплексных веб-приложений
          </p>
        </div>

        <div className="project-tabs">
          <button 
            className={`tab-btn ${activeTab === 'bots' ? 'active' : ''}`}
            onClick={() => setActiveTab('bots')}
          >
            <Icon name="robot" className="tab-icon" />
            Боты/Автоматизация
          </button>
          <button 
            className={`tab-btn ${activeTab === 'sites' ? 'active' : ''}`}
            onClick={() => setActiveTab('sites')}
          >
            <Icon name="layout" className="tab-icon" />
            Сайты
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'bots' && <BotsGrid />}
          {activeTab === 'sites' && <WebDev embedded />}
        </div>
      </div>
    </section>
  );
}
