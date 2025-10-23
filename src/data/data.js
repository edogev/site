// [file name]: src/data/data.js

export const personalInfo = {
  name: "Геворкян Эдуард Меликович",
  position: "BI Analyst & Data Analyst",
  careerStartDate: "2018-03-01",
  contacts: {
    phone: "+7 (915) 1090649",
    email: "aduard1995@gmail.com",
    location: "Москва, м. Котельники",
    telegram:"@edogev"
  }
};

export const skillsData = [
  {
    name: "Apache Superset",
    startDate: "2025-01-01",
    description: "Разработка интерактивных дашбордов, настройка виджетов и графиков, управление пользователями и ролями, оптимизация производительности, работа с Docker Compose",
    level: "advanced"
  },
  {
    name: "Visiology",
    startDate: "2023-04-01",
    description: "Создание дашбордов для визуализации KPI, разработка BPMN моделей, интеграция данных из различных систем",
    level: "advanced"
  },
  {
    name: "Yandex Datalens",
    startDate: "2023-04-01",
    description: "Разработка дашбордов для отображения плановых показателей, работа с Yandex API, создание интерактивных отчетов",
    level: "advanced"
  },
  {
    name: "Python",
    startDate: "2023-04-01",
    description: "Pandas, NumPy, Selenium, BeautifulSoup, xlsxwriter, парсинг данных, автоматизация формирования отчетов, анализ и агрегация данных",
    level: "advanced"
  },
  {
    name: "SQL/PostgreSQL",
    startDate: "2023-04-01",
    description: "Написание и оптимизация SQL-запросов, работа с базами данных PostgreSQL, извлечение данных для анализа",
    level: "advanced"
  },
  {
    name: "Apache Airflow",
    startDate: "2023-04-01",
    description: "Автоматизация процессов, оркестрация ETL-задач, мониторинг и управление пайплайнами данных",
    level: "intermediate"
  },
  {
    name: "Docker",
    startDate: "2025-01-01",
    description: "Настройка и управление контейнерами с использованием Docker Compose, автоматизация развертывания приложений",
    level: "intermediate"
  },
  {
    name: "Git",
    startDate: "2023-04-01",
    description: "Версионный контроль, управление репозиториями, совместная работа над проектами",
    level: "intermediate"
  }
];

export const workExperience = [
  {
    company: "АО «Системы управления»",
    position: "Аналитик команды Web разработки",
    startDate: "2025-01-01",
    endDate: null,
    responsibilities: [
      "Разработка интерактивных дашбордов для визуализации KPI",
      "Написание и оптимизация SQL-запросов",
      "Интеграция данных из различных систем",
      "Управление пользователями и ролями в Superset",
      "Работа с Docker Compose"
    ]
  },
  {
    company: "Госкорпорация Росатом",
    position: "Главный специалист аналитического отдела",
    startDate: "2024-04-01",
    endDate: "2024-12-01",
    responsibilities: [
      "Работа с BI-системами: Visiology, Yandex Datalens",
      "Разработка BPMN моделей",
      "Автоматизация процессов с Airflow",
      "Программирование на Python"
    ]
  },
  {
    company: "ГБУЗ МО Люберецкая ОБ",
    position: "Начальник аналитического отдела",
    startDate: "2023-04-01",
    endDate: "2024-05-01",
    responsibilities: [
      "Разработка дашбордов на Yandex Datalens",
      "Автоматизация формирования отчетов",
      "Парсинг данных из медицинских ИС",
      "Организация аналитического отдела"
    ]
  }
];
