// [file name]: src/pages/Home.js

import { personalInfo, skillsData, workExperience } from '../data/data.js';
import { useEffect, useRef } from 'react';

// Функции для расчета опыта остаются без изменений
const calculateExperience = (startDate, endDate = null) => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  
  let months = (end.getFullYear() - start.getFullYear()) * 12;
  months -= start.getMonth();
  months += end.getMonth();
  
  return Math.max(0, months);
};

const formatExperience = (months) => {
  if (months < 12) {
    return `${months} ${getMonthsWord(months)}`;
  }
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (remainingMonths === 0) {
    return `${years} ${getYearsWord(years)}`;
  }
  return `${years} ${getYearsWord(years)} ${remainingMonths} ${getMonthsWord(remainingMonths)}`;
};

const getYearsWord = (years) => {
  if (years % 10 === 1 && years % 100 !== 11) return 'год';
  if (years % 10 >= 2 && years % 10 <= 4 && (years % 100 < 10 || years % 100 >= 20)) return 'года';
  return 'лет';
};

const getMonthsWord = (months) => {
  if (months === 1) return 'месяц';
  if (months >= 2 && months <= 4) return 'месяца';
  return 'месяцев';
};

const formatPeriod = (startDate, endDate = null) => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  
  const formatDate = (date) => {
    const months = [
      'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
      'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };
  
  const startStr = formatDate(start);
  const endStr = endDate ? formatDate(end) : 'настоящее время';
  
  return `${startStr} — ${endStr}`;
};

const calculateTotalExperience = () => {
  const totalMonths = calculateExperience(personalInfo.careerStartDate);
  return formatExperience(totalMonths);
};

const SkillLevel = ({ level, experienceMonths }) => {
  const getPercentage = () => {
    const maxMonths = 60;
    return Math.min((experienceMonths / maxMonths) * 100, 100);
  };

  const getLevelText = () => {
    switch(level) {
      case 'advanced': return 'Продвинутый';
      case 'intermediate': return 'Средний';
      case 'beginner': return 'Начальный';
      default: return level;
    }
  };

  const getLevelColor = () => {
    switch(level) {
      case 'advanced': return 'var(--success)';
      case 'intermediate': return 'var(--warning)';
      case 'beginner': return 'var(--error)';
      default: return 'var(--primary)';
    }
  };

  return (
    <div className="skill-level">
      <div className="level-info">
        <span className="level-text">{getLevelText()}</span>
        <span className="level-percentage">{Math.round(getPercentage())}%</span>
      </div>
      <div className="level-bar-container">
        <div 
          className="level-fill" 
          style={{ 
            width: `${getPercentage()}%`,
            background: getLevelColor()
          }}
        ></div>
      </div>
    </div>
  );
};

export default function Home({ scrollToSection }) {
  const totalExperience = calculateTotalExperience();
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section id="home" className="hero-section" ref={heroRef}>
        <div className="hero-background">
          <div className="floating-elements">
            <div className="floating-element el-1"></div>
            <div className="floating-element el-2"></div>
            <div className="floating-element el-3"></div>
          </div>
        </div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="title-line">Геворкян</span>
              <span className="title-line accent">Эдуард Меликович</span>
            </h1>
            <p className="hero-subtitle">
              Создаю сложные аналитические системы и дашборды для бизнеса. 
              Специализация: BI-аналитика, визуализация данных, автоматизация процессов.
            </p>
            
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">{calculateTotalExperience()}</div>
                <div className="stat-label">Опыт работы</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{skillsData.length}+</div>
                <div className="stat-label">Технологий</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{workExperience.length}</div>
                <div className="stat-label">Проектов</div>
              </div>
            </div>

            <div className="hero-actions">
              <button 
                className="cta-button primary"
                onClick={() => scrollToSection('projects')}
              >
                <span>Смотреть проекты</span>
                <span className="button-icon">→</span>
              </button>
              <button 
                className="cta-button secondary"
                onClick={() => scrollToSection('experience')}
              >
                <span>Мой опыт</span>
              </button>
            </div>

            <div className="contact-info">
              <a href={`tel:${personalInfo.contacts.phone}`} className="contact-item">
                <span className="contact-icon">📱</span>
                <span>{personalInfo.contacts.phone}</span>
              </a>
              <a href={`mailto:${personalInfo.contacts.email}`} className="contact-item">
                <span className="contact-icon">✉️</span>
                <span>{personalInfo.contacts.email}</span>
              </a>
              <div className="contact-item">
                <span className="contact-icon">💬</span>
                <span>{personalInfo.contacts.telegram}</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span>{personalInfo.contacts.location}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="skills-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Технологический стек</h2>
            <p className="section-subtitle">
              Современные технологии и инструменты для решения сложных аналитических задач
            </p>
          </div>
          
          <div className="skills-grid">
            {skillsData.map((skill, index) => {
              const experienceMonths = calculateExperience(skill.startDate);
              const experienceFormatted = formatExperience(experienceMonths);
              
              return (
                <div key={index} className="skill-card" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="skill-header">
                    <h3>{skill.name}</h3>
                    <span className="experience-tag">{experienceFormatted}</span>
                  </div>
                  <p>{skill.description}</p>
                  <SkillLevel 
                    level={skill.level} 
                    experienceMonths={experienceMonths}
                  />
                  <div className="skill-meta">
                    <span className="meta-item">🚀 {skill.level === 'advanced' ? 'Эксперт' : skill.level === 'intermediate' ? 'Опытный' : 'Начальный'}</span>
                    <span className="meta-item">📅 с {new Date(skill.startDate).getFullYear()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="experience-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Карьерный путь</h2>
            <p className="section-subtitle">
              Профессиональный рост и ключевые достижения в аналитике данных
            </p>
          </div>
          
          <div className="timeline">
            {workExperience.map((job, index) => {
              const experienceMonths = calculateExperience(job.startDate, job.endDate);
              const experienceFormatted = formatExperience(experienceMonths);
              const periodFormatted = formatPeriod(job.startDate, job.endDate);
              
              return (
                <div key={index} className="timeline-item" style={{animationDelay: `${index * 0.15}s`}}>
                  <div className="timeline-marker">
                    <div className="marker-inner"></div>
                  </div>
                  <div className="timeline-content">
                    <div className="job-header">
                      <h3>{job.position}</h3>
                      <span className="job-duration">{experienceFormatted}</span>
                    </div>
                    <div className="company-info">
                      <span className="company-name">{job.company}</span>
                      <span className="job-period">{periodFormatted}</span>
                    </div>
                    <ul className="responsibilities">
                      {job.responsibilities.map((resp, respIndex) => (
                        <li key={respIndex}>{resp}</li>
                      ))}
                    </ul>
                    <div className="achievement-badge">
                      <span>🎯</span>
                      <span>Успешных проектов: {job.responsibilities.length}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
