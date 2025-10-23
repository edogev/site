// src/components/BotSelector.js
export default function BotSelector({ bots, onSelect, selectedBot }) {
  return (
    <div className="bot-selector">
      <div className="projects-grid">
        {bots.map(bot => (
          <div 
            key={bot.id} 
            className={`project-card ${selectedBot?.id === bot.id ? 'selected' : ''}`}
            onClick={() => onSelect(bot)}
          >
            <div className="project-icon">
              {bot.icon || '🤖'}
            </div>
            <div className="project-content">
              <h3>{bot.name}</h3>
              <p>{bot.description}</p>
              <div className="project-tech">
                {bot.technologies?.map((tech, index) => (
                  <span key={index} className="tech-tag">{tech}</span>
                ))}
              </div>
            </div>
            <div className="project-arrow">
              <span>→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}