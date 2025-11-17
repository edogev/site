import React from 'react';
import Icon from './Icon';

export default function CTA() {
  return (
    <section className="projects-cta">
      <div className="container">
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
    </section>
  );
}
