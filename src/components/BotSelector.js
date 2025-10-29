// src/components/BotSelector.js
import { memo } from 'react';

const BotSelector = memo(({ bots, onSelect, selectedBot }) => {
  return (
    <div className="bot-selector">
      <div className="projects-grid">
        {bots.map(bot => (
          <ProjectCard 
            key={bot.id} 
            bot={bot}
            isSelected={selectedBot?.id === bot.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
});

const ProjectCard = memo(({ bot, isSelected, onSelect }) => {
  const handleClick = () => {
    onSelect(bot);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(bot);
    }
  };

  return (
    <div 
      className={`project-card ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      tabIndex={0}
      role="button"
      aria-label={`Выбрать проект ${bot.name}`}
    >
      {/* Анимированный фон для выбранной карточки */}
      {isSelected && (
        <div className="selection-glow"></div>
      )}
      
      <div className="project-icon-wrapper">
        <div className="project-icon">
          {bot.icon || '🤖'}
        </div>
        {/* Индикатор статуса проекта */}
        {bot.status && (
          <div className={`project-status-indicator ${bot.status}`} 
               title={bot.status === 'completed' ? 'Завершен' : 
                      bot.status === 'inProgress' ? 'В разработке' : 'Планируется'}>
          </div>
        )}
      </div>
      
      <div className="project-content">
        <div className="project-header-mini">
          <h3>{bot.name}</h3>
          {bot.rating && (
            <div className="project-rating">
              {'⭐'.repeat(Math.floor(bot.rating))}
              {bot.rating % 1 > 0 && '½'}
            </div>
          )}
        </div>
        
        <p className="project-description">{bot.description}</p>
        
        <div className="project-tech">
          {bot.technologies?.slice(0, 3).map((tech, index) => (
            <span key={index} className="tech-tag">{tech}</span>
          ))}
          {bot.technologies && bot.technologies.length > 3 && (
            <span className="tech-tag-more">+{bot.technologies.length - 3}</span>
          )}
        </div>
      </div>
      
      <div className="project-arrow">
        <span className="arrow-icon">→</span>
      </div>

      {/* Эффект свечения при наведении */}
      <div className="card-glow-effect"></div>
    </div>
  );
});

BotSelector.displayName = 'BotSelector';
ProjectCard.displayName = 'ProjectCard';

export default BotSelector;