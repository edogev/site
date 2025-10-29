// [file name]: src/App.js

import { useState, useEffect, useRef } from 'react';
import Home from './pages/Home';
import Bots from './pages/Bots';
import BackgroundAnimation from './components/BackgroundAnimation';
import './styles.css';

function App() {
  const [currentSection, setCurrentSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const isInitialMount = useRef(true);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    // Отключаем восстановление скролла браузером
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }


    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Добавляем троттлинг чтобы избежать частых обновлений
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      
      scrollTimeout.current = setTimeout(() => {
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
      }, 50);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
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
            <span className="logo-icon">
              <img src="https://raw.githubusercontent.com/edogev/site/refs/heads/main/src/img/logo_50_50.png" alt="Logo" />
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