// [file name]: src/App.js

import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Bots from './pages/Bots';
import BackgroundAnimation from './components/BackgroundAnimation';
import './styles.css';

function App() {
  const [currentSection, setCurrentSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Определяем текущую секцию на основе скролла
      const sections = ['home', 'skills', 'experience', 'projects'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (current && current !== currentSection) {
        setCurrentSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentSection]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
      setCurrentSection(sectionId);
    }
  };

  return (
    <div className="app">
      <BackgroundAnimation />
      
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-content">
          <div className="logo" onClick={() => scrollToSection('home')}>
            <span className="logo-icon">  <img src="data:image/png;base64,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 
                " />
</span>
            DataPulse Analytics
          </div>
          <div className="nav-buttons">
            <button 
              className={`nav-btn ${currentSection === 'home' ? 'active' : ''}`}
              onClick={() => scrollToSection('home')}
            >
              Главная
            </button>
            <button 
              className={`nav-btn ${currentSection === 'skills' ? 'active' : ''}`}
              onClick={() => scrollToSection('skills')}
            >
              Навыки
            </button>
            <button 
              className={`nav-btn ${currentSection === 'experience' ? 'active' : ''}`}
              onClick={() => scrollToSection('experience')}
            >
              Опыт
            </button>
            <button 
              className={`nav-btn ${currentSection === 'projects' ? 'active' : ''}`}
              onClick={() => scrollToSection('projects')}
            >
              Проекты
            </button>
          </div>
        </div>
      </nav>

      <main>
        <Home scrollToSection={scrollToSection} />
        <Bots />
      </main>

      <button 
        className="back-to-top"
        onClick={() => scrollToSection('home')}
        aria-label="Back to top"
      >
        ↑
      </button>
    </div>
  );
}

export default App;
